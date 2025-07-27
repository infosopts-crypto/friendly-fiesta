#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Prepare production build by copying dist/public to server/public
async function prepareProduction() {
  const sourceDir = path.join(projectRoot, 'dist', 'public');
  const targetDir = path.join(projectRoot, 'server', 'public');
  
  console.log('Preparing production static files...');
  
  if (!fs.existsSync(sourceDir)) {
    console.error('Source directory does not exist:', sourceDir);
    console.error('Run "npm run build" first');
    process.exit(1);
  }
  
  // Remove existing target directory
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  
  // Create target directory
  fs.mkdirSync(targetDir, { recursive: true });
  
  // Copy all files from dist/public to server/public
  copyDirectorySync(sourceDir, targetDir);
  
  console.log('Production static files prepared successfully!');
  console.log(`Files copied from ${sourceDir} to ${targetDir}`);
}

function copyDirectorySync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

prepareProduction().catch(console.error);