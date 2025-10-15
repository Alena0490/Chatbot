git checkout main
git push origin main
npm run build
$subtree = git subtree split --prefix dist
git push origin "${subtree}:gh-pages" --force
Write-Host "Deployment complete!" -ForegroundColor Green