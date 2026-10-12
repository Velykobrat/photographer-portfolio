Studio dependency checks run on pull requests, weekly, and before deployment. Run `npm run audit:security` inside `studio` to reproduce them. The complete npm report is uploaded as a CI artifact. Registry failures and unreviewed advisories fail the check.

The scoped overrides patch js-yaml and smol-toml in Vercel framework detection, and uuid in typeid-js. Studio's TypeScript check, build and identifier generation were verified with these overrides.

Two source advisories currently have no patched release: [braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and [sprintf-js](https://github.com/advisories/GHSA-hp3w-g68c-fv3c). npm also lists their dependent packages as affected. They remain in Sanity CLI's transitive tooling dependency tree; a passing check does not mean zero vulnerabilities.

`security-exceptions.json` accepts only each recorded advisory, package and exact installed version through 2026-11-11. Changed versions, new advisories and expired exceptions block deployment. Review upstream fixes and the actual tooling exposure before that date; do not renew exceptions automatically. The exceptions do not assert that these vulnerabilities are harmless.
