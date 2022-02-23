const fs = require('fs');

const promisifyReadDirectory = (directoryPath) => new Promise((resolve, reject) => {
  fs.readdir(directoryPath, (err, data) => {
    if (err) reject(new Error('Directory not found!'));
    else resolve(data);
  });
});

const promisifyReadFile = (filepath, filterCharacter = null) => new Promise((resolve, reject) => {
  fs.readFile(filepath, (err, data) => {
    if (err) reject(err);
    else if (filterCharacter) resolve(data.toString().split('\r\n').filter((item) => item.toLowerCase().startsWith(filterCharacter.toLowerCase())));
    else {
      resolve(data.toString().split('\r\n'));
    }
  });
});

module.exports = {
  promisifyReadDirectory,
  promisifyReadFile,
}