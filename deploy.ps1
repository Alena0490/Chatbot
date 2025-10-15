# 1) Build
git checkout main
git pull
npm run build

# 2) Připrav si pracovního "worktree" pro větev gh-pages
# Pokud větev neexistuje, vytvoř ji prázdnou:
if (-not (git ls-remote --exit-code --heads origin gh-pages 2>$null)) {
  git branch gh-pages 2>$null | Out-Null
}
# Připoj worktree do složky ./gh-pages
if (Test-Path gh-pages) { Remove-Item -Recurse -Force gh-pages }
git worktree add gh-pages gh-pages

# 3) Zkopíruj build do gh-pages a commitni
Remove-Item -Recurse -Force gh-pages\* -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force dist\* gh-pages\

Push-Location gh-pages
git add --all
git commit -m "Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin gh-pages
Pop-Location

# 4) Úklid worktree (volitelné)
git worktree remove gh-pages -f

Write-Host "Deployment complete!" -ForegroundColor Green
