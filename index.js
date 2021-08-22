const fs = require('fs');
const  path = require('path');

const fileActions = {};

/** *********************************************************
 * readDir: Get a list of files in a given directory
 * @param {string} dir
 * @param {boool} flat whether to flatten array or not
 * @returns {array}
 * *********************************************************/
fileActions.readDir = (dir, flat = false) => fs.statSync(dir).isDirectory() && fs.promises.readdir(dir).then(files => Promise.all(files.reduce((list, file) => {
  const name = path.join(dir, file);
  const isDir = fs.statSync(name).isDirectory();
  return list.concat(isDir ? fileActions.readDir(name) : [name]);
}, [])))
.then(files => flat ? files.flat(Infinity) : files)
.catch(err => {
  if (err.code === 'ENOTDIR') {
    console.error(`"${dir}" is not a directory`);
    return;
  }
  throw err;
});



/** *********************************************************
 * readFile: read contents of file
 * @param {string} dir
 * @returns {buffer} contents of the file
 * *********************************************************/
fileActions.readFile = dir => fs.statSync(dir).isFile() && fs.promises.readFile(dir)
.catch(err => {
  if (err.code === 'ENOENT') {
    console.error(`"${dir}" is not a directory`);
    return;
  }
  throw err;
});



/** *********************************************************
 * writeFile: write contents to a file
 * @param {string} dir fule path including file name and ext.
 * @param {buffer} data contents of the file
 * @returns {string | boolean} file path if successful. Otherwise false
 * *********************************************************/
fileActions.writeFile = (dir, data) => fs.promises.writeFile(dir, data)
  .catch(err => {
    console.error(`Something went wrong writing the file at ${dir}. `, err.message)
    return false;
  })



/** *********************************************************
 * fileOfType: Get a list of files with a certain extension
 * @param {array} files
 * @param {string} ext extension type (ie. `js`, `html`)
 * @returns {array}
 * *********************************************************/
fileActions.fileOfType = (files, ext = 'js') =>  Array.isArray(files) && files.reduce((list, file) => {
  try{
    let arrayFiles;
    if(Array.isArray(file)) {
      arrayFiles = fileActions.fileOfType(file);
      return arrayFiles.length > 0 ? list.concat([arrayFiles]) : list;
    }
    const hasExt = file.split('.').pop().toLowerCase() === ext.toLowerCase()
    return hasExt ? list.concat(file) : list;

   } catch(err) {
     console.log(`${err.name}: ${err.message}`);
   }
}, [])



const filess = "t"
fileActions.writeFile('./otherMarkdown.md', undefined)
// fileActions.readFile('./myMarkdown.md')
// .then(buff => fileActions.writeFile('./otherMarkdown.md', buff))
// .readDir('./', true)
// .then(files => fileActions.fileOfType(files))
// .then(files => console.log(files.toString('utf-8')));


module.exports = fileActions;