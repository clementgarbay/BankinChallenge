const path = require('path');
const fs = require('fs');

function createDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  return directoryPath;
}

async function saveAsFile(directory = 'res', fileName = 'res.txt', data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(createDirectory(directory), fileName), data, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

module.exports = {
  createDirectory,
  saveAsFile
};
