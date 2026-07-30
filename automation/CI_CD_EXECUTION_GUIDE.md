# CI/CD Execution Guide

This guide details how the GitHub Actions pipeline automatically executes E2E tests and publishes live reports.

## Pipeline Trigger Events
- **Push**: Triggered on every commit pushed to `main` or `master`.
- **Pull Request**: Runs verification tests on PR submission.
- **Workflow Dispatch**: Allows manual trigger from GitHub Actions tab.
- **Schedule**: Automatically runs daily at midnight UTC.

## GitHub Pages Setup
1. In your GitHub repository, navigate to **Settings** -> **Pages**.
2. Set **Source** to `Deploy from a branch`.
3. Choose the `gh-pages` branch and `/ (root)` folder.
4. Save the configuration.

Report URL:
`https://praveenac4272.github.io/SMART-CAREER-PATH/reports/latest/execution-report.html`
