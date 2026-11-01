# Continuous integration

[Frontend CI runs](https://github.com/zeyadkhaled2/yefhamak/actions/workflows/ci.yml)

Every push and pull request runs `.github/workflows/ci.yml`. Manual runs are also available under **Actions → Frontend CI → Run workflow**.

The job uses Node 24 on a standard Ubuntu runner, runs `npm ci`, then `npm test` and `npm run build`. The production build includes Next.js TypeScript validation. Tests use scripted data and mocked fetch; they do not call OpenRouter, the Python backend, or the contact webhook. No repository secrets or local `.env.local` are needed.

Test/build output is attached to the run as `frontend-check-results` for 14 days, including available logs after failures. Actions are pinned, repository access is read-only, old same-branch runs are cancelled, and the job has a timeout. Output-saving pipelines preserve failure exit codes.

Reproduce checks locally:

```text
npm ci
npm test
npm run build
```

Check a failed run's job steps, fix the code, then push again. Download logs if you want longer-term evidence for a portfolio or recording.

Vercel remains the deployment system. These checks report failures but do not gate Vercel or block direct pushes to `main`. Enforcing that is a separate configuration decision. Docker and real PostgreSQL integration tests are not part of this step.
