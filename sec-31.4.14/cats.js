const fs = require('fs');
const axios = require('axios');

function fileCat(path, outPath) {
  fs.readFile(path, "utf8", (error, data) => {
    if(error)
      handleError("Error reading file:", error);

    processOutput(outPath, data);
  });
}

async function webCat(url, outPath) {
  try{
    res = await axios.get(url);
  }
  catch(error) {
    handleError("Error getting page:", error);
  }

  processOutput(outPath, res.data);
}

function processOutput(outPath, data) {
  if(outPath)
    fs.appendFile(outPath, data+'\n', "utf8", error => {
      if(error)
        handleError("Error writing file:", error);
        console.log("Output saved to " + outPath);
    });
  else
    console.log(data);
}

function handleError(msg, error) {
  console.error(msg, error.message);
  process.exit(1);
}

function cat(inPath, outPath) {
  if(inPath.includes("://"))
    webCat(inPath, outPath);
  else
    fileCat(inPath, outPath);
}

module.exports = { cat: cat };