const {cat} = require('./cats.js');

let inDex = 2;
let outPath;

if(process.argv[2] === "--out") {
  outPath = process.argv[3];
  inDex = 4;
}

for(let inPath of process.argv.slice(inDex)) {
  cat(inPath, outPath);
}