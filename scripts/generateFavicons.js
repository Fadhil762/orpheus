// Node script to generate PNG favicons from public/favicon.svg
// Requires `sharp` to be installed as a devDependency.

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// run with: node --loader ts-node/esm scripts/generateFavicons.js or use plain node with CommonJS

const projectRoot = path.resolve(process.cwd())
const svgPath = path.join(projectRoot, 'public', 'favicon.svg')
const outDir = path.join(projectRoot, 'public')

if (!fs.existsSync(svgPath)) {
  console.error('favicon.svg not found in public/. Create one first.')
  process.exit(1)
}

const sizes = [16, 32, 48, 96, 192, 256, 512]

;(async () => {
  try {
    const svgBuffer = fs.readFileSync(svgPath)
    for (const s of sizes) {
      const out = path.join(outDir, `favicon-${s}.png`)
      await sharp(svgBuffer).resize(s, s).png().toFile(out)
      console.log('Written', out)
    }

    // create apple-touch-icon (180)
    const appleOut = path.join(outDir, 'apple-touch-icon.png')
    await sharp(svgBuffer).resize(180, 180).png().toFile(appleOut)
    console.log('Written', appleOut)

    console.log('All icons generated in public/')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
