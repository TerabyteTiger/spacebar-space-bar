# Html file compression
html-minifier --collapse-whitespace index.html -o compressed\index.html
html-minifier --collapse-whitespace game.html -o compressed\game.html
html-minifier --collapse-whitespace notes.html -o compressed\notes.html

# CSS file compression
csso main.css --output compressed\main.css

# js file compression
uglifyjs game.js --compress --mangle -o compressed\game.js
uglifyjs webmon.js --compress --mangle -o compressed\webmon.js

# Copy Favicon
Copy-Item ./favicon.webp ./compressed/favicon.webp

Write-Output "Compression complete"