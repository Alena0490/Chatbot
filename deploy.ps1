# deploy.ps1 (PowerShell, ne Bash)
$ErrorActionPreference = "Stop"

$branchMain  = "main"
$branchPages = "gh-pages"
$worktreeDir = "gh-pages"

Write-Host "== Checkout $branchMain & build ==" -ForegroundColor Cyan
git checkout $branchMain
git pull --ff-only

npm run build

# SPA fallback + razítko buildu
Copy-Item -Force "dist/index.html" "dist/404.html"
Set-Content "dist/BUILD.txt" ("Built at: " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'))

Write-Host "== Prepare gh-pages worktree ==" -ForegroundColor Cyan

# Když zůstal rozbitý adresář (bez .git), smaž ho
if ( (Test-Path $worktreeDir -PathType Container) -and -not (Test-Path "$worktreeDir/.git") ) {
  Remove-Item -Recurse -Force $worktreeDir
}

git fetch origin --prune

# Odpoj případný starý worktree
if (Test-Path $worktreeDir) {
  git worktree remove $worktreeDir -f
}

# Zjisti, jestli existuje remote větev gh-pages
git ls-remote --exit-code --heads origin $branchPages *> $null
$remoteExists = ($LASTEXITCODE -eq 0)

if ($remoteExists) {
  # Připoj worktree na remote větev (a lokální -B ji bude sledovat)
  git worktree add -B $branchPages $worktreeDir origin/$branchPages
} else {
  # Remote neexistuje -> založ lokální gh-pages (orphan-like start) a připoj
  git worktree add -B $branchPages $worktreeDir
}

Write-Host "== Sync files to gh-pages ==" -ForegroundColor Cyan
# Vymaž vše mimo .git
Get-ChildItem $worktreeDir -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force

# Zkopíruj build
Copy-Item -Recurse -Force "dist\*" "$worktreeDir\"

# Vypni Jekyll
New-Item -Path "$worktreeDir\.nojekyll" -ItemType File -Force | Out-Null

# Commit & push PŘÍMO v gh-pages (žádné commity do main)
git -C $worktreeDir add --all
$changes = git -C $worktreeDir status --porcelain
if ($changes) {
  git -C $worktreeDir commit -m ("Deploy " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
  git -C $worktreeDir push origin $branchPages --force-with-lease
  Write-Host "Pushed to $branchPages." -ForegroundColor Green
} else {
  Write-Host "No changes to deploy." -ForegroundColor Yellow
}

Write-Host "Deployment complete!" -ForegroundColor Green
