存储了 npm 库

pnpm --filter @imohuan-plus/init-command exec esbuild src/index.ts --outfile=dist/index.js --bundle --platform=node --external:node-gyp/bin/node-gyp.js

pnpm login
pnpm -r publish --access public

pnpm changeset
pnpm changeset version

pnpm --filter @imohuan-plus/init-command publish --access public

# 流程

pnpm changeset
pnpm changeset version
pnpm -r build
pnpm -r publish
git add .
git commit -m "xxxx"
