# Html file compression
html-minifier --collapse-whitespace index.html -o dist\index.html
html-minifier --collapse-whitespace game.html -o dist\game.html
html-minifier --collapse-whitespace notes.html -o dist\notes.html

# CSS file compression
csso main.css --output dist\main.css

# js file compression
terser game.js --compress --mangle --keep-fnames -o dist\game.js
terser webmon.js --compress --mangle -o dist\webmon.js

# Copy Favicon
Copy-Item ./favicon.ico ./dist/favicon.ico

Write-Output "Compression complete"

# Create Zipped file
Compress-Archive ./dist/* ./dist.zip -Force

Write-Output "Compressed Files Zipped to dist.zip"