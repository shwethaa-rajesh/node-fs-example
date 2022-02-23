/* eslint-disable no-unused-vars */
const fs = require('fs');
const {
  promisifyReadDirectory, promisifyReadFile, promisifyAppendFile,
  removeFromFile,
} = require('../src/utils/fileUtilities');

describe('PromisifyReadFile function', () => {
  it('should read and display the data as an array', async () => {
    jest.spyOn(fs, 'readFile').mockImplementation((filepath, callback) => {
      callback(null, 'mango\r\nbanana\r\norange\r\napple');
    });
    const fruits = promisifyReadFile('../seed/fruits.txt');
    return expect(fruits).resolves.toStrictEqual(['mango', 'banana', 'orange', 'apple']);
  });
  it('should return invalid message if file is not found', async () => {
    jest.spyOn(fs, 'readFile').mockImplementation((filepath, callback) => {
      callback(new Error('File cannot be found!'), null);
    });
    try {
      await promisifyReadFile('file.txt');
    } catch (err) {
      expect(err.message).toBe('File cannot be found!');
    }
  });
  it('should return invalid message if input is not a string', async () => {
    try {
      await promisifyReadFile(5);
    } catch (err) {
      expect(err.message).toBe('Invalid filepath!');
    }
  });
});

describe('PromisifyReadDirectory function', () => {
  it('should read files name into an array', async () => {
    jest.spyOn(fs, 'readdir').mockImplementation((directoryPath, callback) => {
      callback(null, ['beverages.txt', 'fruits.txt', 'vegetables.txt']);
    });
    const files = await promisifyReadDirectory('../seed');
    expect(files).toStrictEqual(['beverages.txt', 'fruits.txt', 'vegetables.txt']);
  });
  it('should return invalid message if directory not found', async () => {
    jest.spyOn(fs, 'readdir').mockImplementation((directoryPath, callback) => {
      callback(new Error('Directory not found!'), null);
    });
    try {
      await promisifyReadDirectory('seeds');
    } catch (err) {
      expect(err.message).toBe('Directory not found!');
    }
  });
  it('should return invalid message if input is not a string', async () => {
    try {
      await promisifyReadDirectory(5);
    } catch (err) {
      expect(err.message).toBe('Invalid directory Path');
    }
  });
});

describe('PromisifyAppendFile function', () => {
  it('should write into a new line of the file and return file contents in array', async () => {
    jest.spyOn(fs, 'appendFile').mockImplementation((filePath, content, errorCallback) => {
      errorCallback(null);
    });
    jest.spyOn(fs, 'readFile').mockImplementation((filePath, callback) => {
      callback(null, ['mango\r\nbanana\r\norange\r\napple\r\nstrawberry\r\npeach']);
    });
    const writefilePromise = await promisifyAppendFile('./seed/fruits.txt', '\r\nstrawberry\r\npeach');
    expect(writefilePromise).toStrictEqual(['mango', 'banana', 'orange', 'apple', 'strawberry', 'peach']);
  });
  it('should return invalid message if file is not found', async () => {
    jest.spyOn(fs, 'appendFile').mockImplementation((filePath, content, errorCallback) => {
      errorCallback('Cannot append to file \'seed\'!');
    });
    try {
      await promisifyAppendFile('seed', 'exampledata');
    } catch (err) {
      expect(err.message).toBe('Cannot append to file \'seed\'!');
    }
  });
  it('should return invalid message if file path is not string', async () => {
    try {
      await promisifyAppendFile(5);
    } catch (err) {
      expect(err.message).toBe('Invalid, enter a proper filepath!');
    }
  });
  it('should return invalid message if no data is given to write', async () => {
    try {
      await promisifyAppendFile('./seed/fruits.txt');
    } catch (err) {
      expect(err.message).toBe('Invalid, Enter data to write!');
    }
  });
  it('should return invalid message if data is not a string buffer', async () => {
    try {
      await promisifyAppendFile('./seed/fruits.txt', 5);
    } catch (err) {
      expect(err.message).toBe('Invalid, enter string buffer data!');
    }
  });
});

describe('RemoveFromFile function', () => {
  it('should filter content from file and return the modified file contents in an array', async () => {
    jest.spyOn(fs, 'writeFile').mockImplementation((filePath, content, errorCallback) => {
      errorCallback(null);
    });
    jest.spyOn(fs, 'readFile').mockImplementation((filePath, callback) => {
      callback(null, ['mango\r\norange\r\napple\r\nstrawberry\r\npeach']);
    });
    const fruitsWithoutB = await removeFromFile('./seed/fruits.txt', 'b');
    expect(fruitsWithoutB).toEqual(['mango', 'orange', 'apple', 'strawberry', 'peach']);
  });
  it('should return invalid message if file is not found', async () => {
    jest.spyOn(fs, 'readFile').mockImplementation((filePath, callback) => {
      callback(new Error('File not found'), null);
    });
    try {
      await removeFromFile('seed', 'c');
    } catch (err) {
      expect(err.message).toBe('File not found');
    }
  });
  it('should return invalid message if filePath is not string', async () => {
    try {
      await removeFromFile(5);
    } catch (err) {
      expect(err.message).toBe('Filepath not a string');
    }
  });
  it('should return invalid message if filter character not given', async () => {
    try {
      await removeFromFile('somedirectory');
    } catch (err) {
      expect(err.message).toBe('Filter character not a string');
    }
  });
  it('should return invalid message if filter character is not string', async () => {
    try {
      await removeFromFile('somedirectory', 5);
    } catch (err) {
      expect(err.message).toBe('Filter character not a string');
    }
  });
});
