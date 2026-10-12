import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export function inspectAudit(report, lock, exceptions, today = new Date().toISOString().slice(0, 10)) {
  if (report.error || !report.vulnerabilities || !report.metadata) throw new Error('Invalid npm audit response');
  const accepted = [];
  const blocked = [];
  for (const [name, vulnerability] of Object.entries(report.vulnerabilities)) {
    for (const advisory of vulnerability.via) {
      if (typeof advisory === 'string') continue; // Inherited findings are checked at their source.
      const exception = exceptions.find(item => item.package === name && item.url === advisory.url);
      const versionsMatch = vulnerability.nodes.length > 0 && vulnerability.nodes.every(node =>
        lock.packages[node]?.version === exception?.version);
      const finding = `${name}: ${advisory.url}`;
      if (exception && exception.expires >= today && versionsMatch) accepted.push(finding);
      else blocked.push(finding);
    }
  }
  if (report.metadata.vulnerabilities.total > 0 && !accepted.length && !blocked.length) {
    throw new Error('Audit reported vulnerabilities without source advisories');
  }
  return { accepted: [...new Set(accepted)], blocked: [...new Set(blocked)] };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (!process.env.npm_execpath) throw new Error('Run through npm run audit:security');
    const cwd = fileURLToPath(new URL('../', import.meta.url));
    let output;
    try {
      output = execFileSync(process.execPath, [process.env.npm_execpath, 'audit', '--json', '--package-lock-only'],
        { cwd, encoding: 'utf8', timeout: 60000, maxBuffer: 5 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (error) {
      if (error.status !== 1 || !error.stdout) throw error;
      output = error.stdout;
    }
    const report = JSON.parse(output);
    const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
    const exceptions = JSON.parse(readFileSync(new URL('../security-exceptions.json', import.meta.url), 'utf8'));
    const result = inspectAudit(report, lock, exceptions);
    writeFileSync(new URL('../security-audit.json', import.meta.url), JSON.stringify(report, null, 2));
    for (const finding of result.accepted) console.warn(`Known temporary exception: ${finding}`);
    for (const finding of result.blocked) console.error(`Security check blocked: ${finding}`);
    console.log(`Audit: ${result.accepted.length} known exceptions, ${result.blocked.length} blocking advisories.`);
    if (result.blocked.length) process.exitCode = 1;
  } catch (error) {
    console.error(`Security audit failed: ${error.message}`);
    process.exitCode = 1;
  }
}
