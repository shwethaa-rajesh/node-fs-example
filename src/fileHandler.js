const path = require('path');
const { promisifyReadFile, promisifyReadDirectory, promisifyAppendFile,promisifyWriteFile } = require('./utils/fileUtilities');

const readAndFilterFiles = async (directoryPath, filterCharacter = null) => {
  const directoryFilenames = await promisifyReadDirectory(directoryPath);
  const fileNames = directoryFilenames.map((fileName) => path.parse(fileName).name);
  const allFilePromises = directoryFilenames.map((file) => promisifyReadFile(`${directoryPath}/${file}`, filterCharacter));
  let allFilesContent = await Promise.all(allFilePromises);
  allFilesContent = allFilesContent.reduce((allContent, perFileContent, index) => ({
    ...allContent,
    [fileNames[index]]: perFileContent,
  }), {});
  return allFilesContent;
};
 (async () => {
    console.log(await promisifyAppendFile('./seed/fruits.txt','\r\nWatermelon'));
  })();
  (async () => {
    console.log(await promisifyWriteFile('./seed/beverages.txt','Tea\r\nCoffee'));
  })();
  
  (async () => {
    console.log(await readAndFilterFiles('./seed'));
  })();
module.exports = {
  readAndFilterFiles,
};