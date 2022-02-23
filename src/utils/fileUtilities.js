const fs = require('fs');

const promisifyReadDirectory = (directoryPath) => new Promise((resolve, reject) => {
  if (typeof directoryPath !== 'string') throw Error('Invalid directory Path');
  fs.readdir(directoryPath, (err, data) => {
    if (err) reject(new Error('Directory not found!'));
    else resolve(data);
  });
});

const promisifyReadFile = (filepath, filterCharacter = null) => new Promise((resolve, reject) => {
  if (typeof filepath !== 'string') throw Error('Invalid filepath!');
  if (filterCharacter && typeof filterCharacter !== 'string') throw Error('Invalid, enter a proper filter Character!');
  fs.readFile(filepath, (err, data) => {
    if (err) reject(err);
    else if (filterCharacter) resolve(data.toString().split('\r\n').filter((item) => item.toLowerCase().startsWith(filterCharacter.toLowerCase())));
    else {
      resolve(data.toString().split('\r\n'));
    }
  });
});
const promisifyAppendFile = (filepath, data) => new Promise((resolve, reject) => {
  if (typeof filepath !== 'string') throw Error('Invalid, enter a proper filepath!');
  if (!data) throw Error('Invalid, Enter data to write!');
  else if (typeof data !== 'string') throw Error('Invalid, enter string buffer data!');
  fs.appendFile(filepath, data, (err) => {
    if (err) reject(new Error(`Cannot append to file '${filepath}'!`));
    resolve(promisifyReadFile(filepath));
  });
});
const promisifyWriteFile = (filepath, data) => new Promise((resolve, reject) => {
  if (typeof filepath !== 'string') throw Error('Invalid, enter a proper filepath!');
  if (!data) throw Error('Invalid, Enter data to write!');
  else if (typeof data !== 'string') throw Error('Invalid, enter string buffer data!');
  fs.writeFile(filepath, data, (err) => {
    if (err) reject(new Error(`Cannot write into file '${filepath}'!`));
    resolve(promisifyReadFile(filepath));
  });
});
const removeFromFile = async (filepath, filterCharacter = null) => {
  if (typeof filepath !== 'string') throw Error('Filepath not a string');
  if (!filterCharacter || typeof filterCharacter !== 'string') throw Error('Filter character not a string');
  let fileContent = await promisifyReadFile(filepath);
  fileContent = fileContent.filter((item) => !item.toLowerCase().startsWith(filterCharacter.toLowerCase())).join('\r\n');
  const writePromise = await promisifyWriteFile(filepath, fileContent);
  return writePromise;
};
module.exports = {
  promisifyReadDirectory,
  promisifyReadFile,
  promisifyAppendFile,
  promisifyWriteFile,
  removeFromFile,
};
