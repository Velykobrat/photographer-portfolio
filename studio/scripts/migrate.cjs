// Run with: sanity exec scripts/migrate.cjs --with-user-token
// The token is passed directly to the child process, never printed or stored in source.
const { getCliClient } = require('sanity/cli');
const { spawn } = require('node:child_process');
const { resolve } = require('node:path');

const client = getCliClient({ apiVersion: '2026-10-12' });
const token = client.config().token;
if (!token) throw new Error('Sign in first and use --with-user-token.');
const child = spawn(process.execPath, ['scripts/migrate-portfolio.mjs', '--apply'], {
  cwd: resolve(__dirname, '../..'),
  env: { ...process.env, SANITY_AUTH_TOKEN: token },
  stdio: 'inherit',
});
child.on('error', () => { console.error('Could not start migration.'); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
