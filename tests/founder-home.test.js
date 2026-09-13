const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const manifest = fs.existsSync('manifest.webmanifest') ? fs.readFileSync('manifest.webmanifest', 'utf8') : '';

const requiredHtml = [
  'Raphael Bueno',
  'AUREON',
  'O que estou construindo',
  'Quero criar meu app',
  'Quero aprender',
  'Instagram',
  'YouTube',
  'TikTok',
  'Facebook',
  'GitHub',
  'viewport-fit=cover'
];

for (const token of requiredHtml) {
  if (!html.includes(token)) {
    throw new Error(`Missing required home token: ${token}`);
  }
}

const requiredManifest = ['Raphael Bueno', 'AUREON'];
for (const token of requiredManifest) {
  if (!manifest.includes(token)) {
    throw new Error(`Missing required manifest token: ${token}`);
  }
}

console.log('founder-home tests passed');
