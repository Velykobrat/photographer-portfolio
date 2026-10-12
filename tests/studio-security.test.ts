import { expect, it } from 'vitest';
// @ts-expect-error The audit runner is shared with Node CI as a native ES module.
import { inspectAudit } from '../studio/scripts/audit-security.mjs';

const url = 'https://github.com/advisories/GHSA-test';
const exception = { package: 'example', version: '1.0.0', url, expires: '2026-11-11' };
const report = { metadata: { vulnerabilities: { total: 2 } }, vulnerabilities: {
  example: { via: [{ url }], nodes: ['node_modules/example'] },
  parent: { via: ['example'], nodes: ['node_modules/parent'] },
} };
const lock = { packages: { 'node_modules/example': { version: '1.0.0' } } };

it('accepts only the reviewed advisory and exact installed version until expiry', () => {
  expect(inspectAudit(report, lock, [exception], '2026-10-12')).toEqual({
    accepted: [`example: ${url}`], blocked: [],
  });
  expect(inspectAudit(report, lock, [exception], '2026-11-12').blocked).toHaveLength(1);
  expect(inspectAudit(report, { packages: { 'node_modules/example': { version: '1.0.1' } } }, [exception], '2026-10-12').blocked).toHaveLength(1);
});

it('blocks a new advisory even when its package already has an exception', () => {
  const changed = structuredClone(report);
  changed.vulnerabilities.example.via.push({ url: `${url}-new` });
  expect(inspectAudit(changed, lock, [exception], '2026-10-12').blocked).toEqual([`example: ${url}-new`]);
});

it('does not treat registry failures or incomplete findings as a clean audit', () => {
  expect(() => inspectAudit({ error: { code: 'ENETUNREACH' } }, lock, [])).toThrow();
  expect(() => inspectAudit({ metadata: report.metadata, vulnerabilities: { parent: report.vulnerabilities.parent } }, lock, [])).toThrow();
});
