# Html file compression
html-minifier --collapse-whitespace index.html -o compressed\index.html
html-minifier --collapse-whitespace game.html -o compressed\game.html
html-minifier --collapse-whitespace notes.html -o compressed\notes.html

# CSS file compression
csso main.css --output compressed\main.css

# js file compression
terser game.js --compress --mangle --keep-fnames -o compressed\game.js
terser webmon.js --compress --mangle -o compressed\webmon.js

# Copy Favicon
Copy-Item ./favicon.ico ./compressed/favicon.ico

Write-Output "Compression complete"