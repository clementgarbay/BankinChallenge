const path = require('path');
const fs = require('fs');

async function saveAsFile(filename = 'res.json', data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, `../res/${filename}`), data, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

module.exports = {
  saveAsFile
};
