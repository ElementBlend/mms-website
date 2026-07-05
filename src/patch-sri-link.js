const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'mms-website', 'browser');
const regex = /"((?:chunk|main|polyfills|styles)-[a-zA-Z0-9]+\.(?:js|css))"/g;

function patchHtmlFilesInDir(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      patchHtmlFilesInDir(fullPath);
    } else if (file === 'index.html' || file === 'index.csr.html') {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const fixedContent = content.replace(regex, '"./$1"');

        // Only write to the file if changes were actually made
        if (content !== fixedContent) {
          fs.writeFileSync(fullPath, fixedContent);
          console.log(`Patched: ${fullPath}`);
        }
      } catch (error) {
        console.error(`Error patching ${fullPath}:`, error);
      }
    }
  }
}

console.log('Scanning for index.html files to patch...');
patchHtmlFilesInDir(distPath);
console.log('Finished patching import maps.');
