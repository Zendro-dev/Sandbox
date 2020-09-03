const fs = require('fs');

const maxFiles = 2;
const maxDepth = 2;

function getMaxDirectoryValue(path) {
  let dirs = fs.readdirSync(path, { withFileTypes: true })
    //filer: positive integer named directories
    .filter(dirent => dirent.isDirectory() && /^([1-9][0-9]*)|([0])$/.test(dirent.name) && Number.parseInt(dirent.name) <= maxFiles)
    .map(dirent => dirent.name)
    .sort(compareNumericStringAsc);

  return (dirs.length > 0) ? dirs[dirs.length-1] : null;
}

function getMaxPathStack(path) {
  let currentLevel = 0;
  let stack = [];

  /**
   * Check: root path
   */
  let currentMaxDirValue = getMaxDirectoryValue(path);
  if(currentMaxDirValue === null) {
    /**
     * Create full path, with maxDepth levels
     */
    let newMaxPath = new Array(maxDepth).join('/');
    console.log(newMaxPath);
  }

}

function compareNumericStringAsc(a, b) {
  if (Number.parseInt(a) < Number.parseInt(b)) {
    return -1;
  }
  if (Number.parseInt(a) > Number.parseInt(b)) {
    return 1;
  }
  // a equal to b
  return 0;
}



let maxDirValue = getMaxDirectoryValue('./graphql-server/public/images');
console.log("maxDirValue: ", maxDirValue);