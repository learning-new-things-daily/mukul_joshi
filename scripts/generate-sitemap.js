#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const base = 'https://learning-new-things-daily.github.io/devops-hub/';
const root = process.cwd();
function listHtml(dir){
  const files = fs.readdirSync(dir);
  let result = [];
  for(const f of files){
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if(stat.isDirectory()){
      result = result.concat(listHtml(p));
    } else if(f.endsWith('.html')){
      const rel = path.relative(root, p).replace(/\\/g,'/');
      result.push(rel);
    }
  }
  return result;
}
const htmlFiles = listHtml(root).filter(p=>!p.startsWith('.git/') && !p.startsWith('node_modules/'));
const urls = htmlFiles.map(p=> base + p.replace(/^\//,'')).sort();
const xml = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls.map(u=>`  <url>\n    <loc>${u}</loc>\n  </url>`), '</urlset>'].join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log('Sitemap updated with', urls.length, 'URLs');
