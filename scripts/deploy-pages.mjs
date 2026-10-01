// Publish dist/ to the gh-pages branch of origin (GitHub Pages project site).
// Run via `npm run deploy` (builds with --mode pages first).
import { execSync } from 'node:child_process'
import { writeFileSync, existsSync } from 'node:fs'

const run = (cmd, cwd = 'dist') => execSync(cmd, { cwd, stdio: 'inherit' })
if (!existsSync('dist/index.html')) throw new Error('dist/ missing — build first')

const remote = execSync('git remote get-url origin').toString().trim()
writeFileSync('dist/.nojekyll', '') // serve files as-is (no Jekyll processing)

run('git init -q -b gh-pages')
run('git add -A')
run('git -c user.name="CAR LOFT deploy" -c user.email="deploy@carloft.local" commit -q -m "Deploy to GitHub Pages"')
run(`git push -f ${remote} gh-pages`)
console.log('\nPublished → https://sigovs.github.io/CARLOFT/')
