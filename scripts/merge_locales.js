const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'i18n', 'locales');
const baseFile = path.join(localesDir, 'en.json');
const targets = ['de.json','es.json','fr.json','it.json','ja.json','pt.json','ru.json','zh.json'];

function readJson(p){
  return JSON.parse(fs.readFileSync(p,'utf8'));
}

function writeJson(p,obj){
  fs.writeFileSync(p, JSON.stringify(obj, null, 2)+'\n', 'utf8');
}

function merge(){
  const base = readJson(baseFile);
  const baseKeys = Object.keys(base);
  const report = {};
  targets.forEach(file => {
    const p = path.join(localesDir, file);
    if(!fs.existsSync(p)){
      console.log('missing file', file);
      return;
    }
    let obj = readJson(p);
    let added = 0;
    baseKeys.forEach(k => {
      if(!(k in obj)){
        obj[k] = base[k];
        added++;
      }
    });
    if(added>0){
      writeJson(p, obj);
    }
    report[file] = added;
  });
  console.log('merge complete');
  Object.keys(report).forEach(f => console.log(f + ': ' + report[f] + ' keys added'));
}

merge();
