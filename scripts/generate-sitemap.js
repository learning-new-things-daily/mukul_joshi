#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const base = 'https://learning-new-things-daily.github.io/mukul_joshi/';
const root = process.cwd();
function listHtml(dir){
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let result = [];
  for(const e of entries){
    const name = e.name;
    // Skip heavy/irrelevant or hidden directories early
    if(e.isDirectory() && (name === 'node_modules' || name.startsWith('.'))){
      continue;
    }
    const p = path.join(dir, name);
    if(e.isDirectory()){
      result = result.concat(listHtml(p));
    } else if(name.endsWith('.html')){
      // Guard against broken symlinks or inaccessible files
      try {
        const rel = path.relative(root, p).replace(/\\/g,'/');
        result.push(rel);
      } catch {}
    }
  }
  return result;
}
const htmlFiles = listHtml(root);
const urls = htmlFiles.map(p=> base + p.replace(/^\//,'')).sort();
const xml = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls.map(u=>`  <url>\n    <loc>${u}</loc>\n  </url>`), '</urlset>'].join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log('Sitemap updated with', urls.length, 'URLs');
