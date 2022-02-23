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
const promisifyAppendFile = (filepath, data) => new Promise((resolve, reject) => {
      fs.appendFile(filepath, data, (err) => {
      if (err) reject(new Error(`Cannot append to file '${filepath}'!`));
       resolve(promisifyReadFile(filepath));
    });
  });
  const promisifyWriteFile = (filepath, data) => new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, (err) => {
      if (err) reject(new Error(`Cannot write into file '${filepath}'!`));
       resolve(promisifyReadFile(filepath));
    });
  });
module.exports = {
  promisifyReadDirectory,
  promisifyReadFile,
  promisifyAppendFile,
  promisifyWriteFile
}