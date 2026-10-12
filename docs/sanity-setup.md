# MK Photography: Sanity owner panel (v1.3.0)

Project: `d3nr3igp`; dataset: `production`. The Studio lives in `studio/` and is built independently of the public React site. It uses Sanity login; no write token is included in either browser bundle.

## Setup from a browser only

1. In Sanity, open MK Photography → API → Tokens. Create a temporary **Editor** token for importing the current public portfolio. Store it in GitHub repository Settings → Secrets and variables → Actions as `SANITY_MIGRATION_TOKEN`.
2. Create a **Deploy Studio** token and store it in the same GitHub secrets page as `SANITY_DEPLOY_TOKEN`. These secrets must never be committed or pasted into issue/PR/chat text. GitHub jobs receive each token only in the step which needs it.
3. Run/rerun **Set up Sanity portfolio** on `release/v1.3.0`. It imports seven existing series (57 photos at the time of implementation), verifies a site build from published Sanity data, and deploys Studio to `https://mk-photography-d3nr3igp.sanity.studio` if that hostname is available. The workflow runs on pushes to the setup branch and can be dispatched once present on the default branch.
4. Sign in to Studio using the owner's existing Sanity account. Confirm both languages, covers, photo order and the full gallery. Imported descriptions initially preserve the previous generic descriptions; replace these with meaningful descriptions as you edit.
5. In the Vercel `mk-photography` project, set `PORTFOLIO_SOURCE=sanity` in Preview first. Rebuild the release preview and verify the portfolio, direct URLs, SEO and existing mobile swipe behavior.
6. Once verified, enable the same variable in Production and merge the release. Do not enable this variable before migration: an empty published CMS intentionally creates an empty portfolio.
7. In Vercel Settings → Git → Deploy Hooks create a hook for `main`. In Sanity API → Webhooks add a POST webhook for `production`, on create/update/delete, **excluding drafts and versions**, with this GROQ filter:

   ```groq
   _type == "portfolioSeries" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))
   ```

   Use the Deploy Hook URL as its destination. Keep the hook URL out of the repository and public Studio config. Do not enable draft triggers. Publish/unpublish/delete will trigger a fresh deployment; draft edits and image uploads alone will not.
8. Test publish and unpublish on a test series. Confirm the series appears/disappears in both languages and the sitemap after successful deployment. A CMS publish is not a deployment completion: if the Vercel build fails, the previous website stays live. Inspect Vercel deployment status before reporting success.
9. Revoke the temporary migration token in Sanity and remove `SANITY_MIGRATION_TOKEN` from GitHub after successful migration. Keep the deploy token only if future Studio deployments will use GitHub Actions.

## How content reaches the website

`PORTFOLIO_SOURCE=legacy` (default during setup) keeps the existing catalogue and Cloudinary tag-based photo loading. `PORTFOLIO_SOURCE=sanity` runs `scripts/sync-portfolio.mjs` first in the build, queries the **uncached API** with `perspective=published`, validates all documents and writes one public snapshot. Both client and prerendered HTML use this snapshot, with generated localized routes, metadata and sitemap. New series require no code changes.

An upstream API error or malformed published document stops the build. It never silently substitutes legacy content or an empty result. A genuinely empty published result is valid, so withdrawn series do not reappear. The generated snapshot is public content, with no credentials. Do not commit a locally generated production snapshot over the checked-in legacy bootstrap file. For local CMS review run `PORTFOLIO_SOURCE=sanity npm run content:sync` before starting Vite.

## Migration behavior

`npm run content:migrate` is a read-only dry run. `SANITY_API_TOKEN=... node scripts/migrate-portfolio.mjs --apply` uploads Cloudinary JPEGs to Sanity and creates documents with stable IDs. It preserves current addresses, covers and numeric filename order. `createIfNotExists` and an existing-document check prevent overwriting edited content. Existing matching drafts are skipped; conflicting slugs fail the migration. Partial asset uploads are recorded in an ignored local cache and Sanity deduplicates identical uploads.

## Owner workflow

- Open **Серії фотографій** and create a series.
- Fill both names and generate an address; choose a category.
- In **Фотографії**, drag in multiple images, add Ukrainian/English descriptions and drag cards to set their order.
- In **Вигляд у портфоліо**, select a cover, adjust crop/hotspot, set ordering and optionally feature the series.
- Publish when ready. The first publication locks the address to protect shared links. Editing a published series creates a draft and leaves the published version unchanged until the next publication.
- Unpublish a series to remove it from the website after the next deployment. Removing a photo from the series leaves its asset in the library for reuse.
- Ukrainian interface translations can be selected in the Studio user menu; field labels are Ukrainian by default.

## Verification

Root: lint, frontend/API type checks, regression tests, production build and generated SEO checks. Studio: `npm ci`, `npm run check`, `npm run build`. GitHub runs both sets of checks separately. The setup job additionally builds from the real Sanity dataset after migration.

Full end-to-end acceptance still requires authenticated Studio publish/edit/unpublish and successful Vercel Preview/Production deployment. The last recorded Vercel preview had a failed status; diagnose that deployment before enabling production CMS publishing.
