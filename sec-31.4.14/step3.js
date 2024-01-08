const {cat} = require('./cats.js');

let inPath;
let outPath;

if(process.argv[2] === "--out") {
  outPath = process.argv[3];
  inPath = process.argv[4];
}
else
  inPath = process.argv[2];

cat(inPath, outPath);