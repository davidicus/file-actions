const fs = require('fs');
const path = require('path');

const fileActions = {};

/** *********************************************************
 * readDir: Get a list of files in a given directory
 * @param {string} dir
 * @param {boool} flat whether to flatten array or not
 * @returns {array}
 * *********************************************************/
fileActions.readDir = (dir = __dirname, flat = false) => {
  try {
    return (
      fs.statSync(dir).isDirectory() &&
      fs.promises
        .readdir(dir)
        .then((files) =>
          Promise.all(
            files.reduce((list, file) => {
              const name = path.join(dir, file);
              const isDir = fs.statSync(name).isDirectory();
              return list.concat(isDir ? fileActions.readDir(name) : [name]);
            }, [])
          )
        )
        .then((files) => (flat ? files.flat(Infinity) : files))
    );
  } catch (err) {
    /* istanbul ignore else */
    if (err.code === 'ENOTDIR' || err.code === 'ENOENT') {
      console.error(`"${dir}" is not a directory`);
      return;
    }
    /* istanbul ignore next */
    throw err;
  }
};

/** *********************************************************
 * readFile: read contents of file
 * @param {string} dir
 * @returns {buffer} contents of the file
 * *********************************************************/
fileActions.readFile = (dir) => {
  try {
    return fs.statSync(dir).isFile() && fs.promises.readFile(dir);
  } catch (err) {
    /* istanbul ignore else */
    if (err.code === 'ENOENT') {
      console.error(`"${dir}" is not a file`);
      return;
    }
    /* istanbul ignore next */
    throw err;
  }
};

/** *********************************************************
 * writeFile: write contents to a file
 * @param {string} dir fule path including file name and ext.
 * @param {buffer} data contents of the file
 * @returns {string | boolean} file path if successful. Otherwise false
 * *********************************************************/
fileActions.writeFile = (dir, data) =>
  fs.promises.writeFile(dir, data).catch((err) => {
    console.error(
      `Something went wrong writing the file at ${dir}. `,
      err.message
    );
    return false;
  });

/** *********************************************************
 * fileOfType: Get a list of files with a certain extension
 * @param {array} files
 * @param {string} ext extension type (ie. `js`, `html`)
 * @returns {array}
 * *********************************************************/
fileActions.fileOfType = (files, ext = 'js') =>
  Array.isArray(files) &&
  files.reduce((list, file) => {
    let arrayFiles;
    /* istanbul ignore else */
    if (Array.isArray(file)) {
      arrayFiles = fileActions.fileOfType(file);
      return list.concat([arrayFiles]);
    }
    const hasExt = file.split('.').pop().toLowerCase() === ext.toLowerCase();
    return hasExt ? list.concat(file) : list;
  }, []);

// fileActions
//   .readDir('./__test__/myDir')
//   .then((e) => fileActions.fileOfType(e))
//   .then((e) => console.log(e));
// fileActions.writeFile('./otherMarkdown.md', undefined);
// fileActions
//   .readFile('__test__/myDir/myMarkdown.md')
//   .then((files) => console.log(files));
// fileActions.readDir('./__test__/myDir').then((e) => console.log(e));
// .then(buff => fileActions.writeFile('./otherMarkdown.md', buff))
// .readDir('./', true)
// .then(files => fileActions.fileOfType(files))

module.exports = fileActions;
