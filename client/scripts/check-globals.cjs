#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const file = path.resolve(__dirname, '../src/styles/globals.css')
if (!fs.existsSync(file)) {
  console.error('globals.css not found at', file)
  process.exit(0)
}

let src = fs.readFileSync(file, 'utf8')

// Remove :root blocks
src = src.replace(/:root\s*{[\s\S]*?}/g, '')

// Remove @tailwind directives
src = src.replace(/@tailwind\s+\w+;?/g, '')

// Remove CSS comments
src = src.replace(/\/\*[\s\S]*?\*\//g, '')

// If anything non-whitespace remains, warn and exit non-zero
if (src.trim().length > 0) {
  console.error('ERROR: client/src/styles/globals.css contains non-token content.\nKeep only :root tokens, comments, and @tailwind directives.\nRemaining content:\n')
  console.error(src.trim().slice(0, 1000))
  process.exit(1)
}

console.log('OK: globals.css contains only allowed content')
process.exit(0)
