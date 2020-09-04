const fs = require('fs');
const path = require("path");

const MAX_FILES = 2;
const MAX_DEPTH = 2;
const PUBLIC_FOLDER = './graphql-server/public/'


/**
 * @function getImageFolder will try to find a current path with available
 * entries to store a new image or it will create a new path if there no
 * exists one or if the current one have no enough available entries to
 * store a new image.
 * 
 * The behaviour of this function is regulated by the following global
 * constants:
 * 
 * @MAX_FILES_PER_ATTACHMENT_FOLDER regulates the maximum number of entries
 * that each directory on the desired path can have to be considered as
 * available.
 * @PUBLIC_ATTACHMENT_FOLDER_DEPTH regulates the number of directories that
 * the full path will contain after @basePath.
 * 
 * Algorithm behavior:
 * 
 * This function enforces the following behaviors:
 * - Always returns a path with @PUBLIC_ATTACHMENT_FOLDER_DEPTH number of
 * directories after @basePath.
 * - The root path (i.e @basePath) will not be restricted by the global
 * constant @MAX_FILES_PER_ATTACHMENT_FOLDER value. Only non root or non
 * level-0 directories will be restricted by this constant. This means
 * that in the root path any number of directories can be created.
 * - The algorithm will ensure that alway exists a full path with 
 * @PUBLIC_ATTACHMENT_FOLDER_DEPTH value depth, skiping the restrinction
 * of @MAX_FILES_PER_ATTACHMENT_FOLDER value if needed. E.g. if a depth
 * of 3 and max files value of 2 are configures, and for some reason
 * the there existis the following max path: /0/1, which already have
 * 2, the algorith will return /0/1/0/, even when this left the partial
 * path /0/1/ with 3 entries on it.
 * 
 * @param {String} basePath Base path name from which the max path to store
 * a new image will be calculated. If @basePath is not provided, a default
 * base path will be initialized to PUBLIC_FOLDER/images/ path.
 * @returns A path with available entries to store a new image.
 */
function getImageFolder(basePath) {
  let currentLevel = 0;
  let currentMaxPath = basePath ? basePath : path.join(PUBLIC_FOLDER, 'images');
  let currentMaxValue = null;
  let currentMaxPathStack = [];
  let _MAX_FILES = MAX_FILES > 1 ? MAX_FILES : 1;
  let _MAX_DEPTH = MAX_DEPTH > 1 ? MAX_DEPTH : 1;

  /**
   * I. Get full-depth max path, or created if needed.
   *    If created, it also will be returned.
   */
  while(currentLevel < _MAX_DEPTH){
    currentMaxValue = getMaxPathValue(currentMaxPath, currentLevel, _MAX_FILES);

    if(currentMaxValue === null) {
      //-- @debug
      console.log("@@ creating initial level-0 path at: ", currentMaxPath);
      //--

      return makeFullPath(currentMaxPath, currentLevel, _MAX_DEPTH);
    } else {
      //go one level forward
      currentMaxPathStack.push(currentMaxValue);
      currentMaxPath = path.join(currentMaxPath, currentMaxValue.toString());
      currentLevel++;
      continue;
    }
  }//end: while

  /**
   * Until here, we have the current max path and a stack
   * of values corresponding to each directory in the path.
   * 
   * II. Check if current max path have enough space to
   *     store one more entry and if this is the case, returns
   *     the current max path. If no space left, create new
   *     paths as needed. 
   */
  if(getTotalDirEntries(currentMaxPath) < _MAX_FILES) { //case: enough space in current max path.
    //-- @debug
    console.log("@@ enough space in current path: ", currentMaxPath);
    //--
    return currentMaxPath;
  } else { //case: enough space in current max path.
    while(currentMaxPathStack.length > 0) {
      //go back one level
      currentMaxValue = currentMaxPathStack.pop();
      currentMaxPath = path.dirname(currentMaxPath);
      currentLevel--;

      //case: we are at an intermediate level > 0
      if(currentLevel > 0) {
        if(getTotalDirEntries(currentMaxPath) < _MAX_FILES) { //case: enough space in current intermediate level path.
          //-- @debug
          console.log(`@@ creating new level-${currentLevel+1} full path at: `, path.join(currentMaxPath, (currentMaxValue+1).toString()));
          //--

          //make next level-0 full path & return it.
          return makeFullPath(path.join(currentMaxPath, (currentMaxValue+1).toString()), currentLevel+1, _MAX_DEPTH);

        } else { //case: not enough space in current intermediate level path.
          continue;
        }
      } else {//case: we are at level 0
        //-- @debug
        console.log("@@ creating new level-0 full path at: ", path.join(currentMaxPath, (currentMaxValue+1).toString()));
        //--
        
        //make next level-0 full path.
        return makeFullPath(path.join(currentMaxPath, (currentMaxValue+1).toString()), currentLevel+1, _MAX_DEPTH); 
      }
    }//end: while
  }
}

function getMaxPathValue(basePath, currentLevel, _MAX_FILES) {
  try {
    let dirs = fs.readdirSync(basePath, { withFileTypes: true })
      /**
       * Filters:
       *  1. entry type: only directories.
       *  2. entry name: dir names with positive integer values (without leading 0s) or 0.
       *  3. entry name:
       *        if current level is > 0: dir names with integer value lesser than _MAX_FILES value.
       *        if current level is = 0: not restricted by _MAX_FILES. 
       */
      .filter(dirent => dirent.isDirectory() 
              && /^([1-9][0-9]*)|([0])$/.test(dirent.name)
              && (currentLevel>0 ? (Number.parseInt(dirent.name) < _MAX_FILES) : true) )
      .map(dirent => dirent.name)
      .sort(compareNumericStringAsc);

    return (dirs.length > 0) ? Number.parseInt(dirs[dirs.length-1]) : null;
  }catch(e) {
    console.log(e);
    throw new Error("!Error: trying to get max path value from images' storage.");
  }
}

function getTotalDirEntries(basePath) {
  try {  
    let entries = fs.readdirSync(basePath);
    return entries.length;
  }catch(e) {
    console.log(e);
    throw new Error("!Error: trying to get total entries in a path of images' storage.");
  }
}

function makeFullPath(basePath, currentLevel, depth) {
  try {
    //make full path string
    let fullPath = basePath;
    let numDirsToCreate = (depth - currentLevel);
    for(let i=0; i<numDirsToCreate; i++) fullPath = path.join(fullPath, '/0');

    //make path
    fs.mkdirSync(fullPath, { recursive: true, mode: 0o1775 });
    return fullPath;
  }catch(e) {
    console.log(e);
    throw new Error("!Error: trying to make a path to store images.");
  }
}

function compareNumericStringAsc(a, b) {
  try {
    if (Number.parseInt(a) < Number.parseInt(b)) {
      return -1;
    }
    if (Number.parseInt(a) > Number.parseInt(b)) {
      return 1;
    }
    // a equal to b
    return 0;
  }catch(e) {
    console.log(e);
    throw new Error("!Error: trying to compare numeric strings.");
  }
}

console.log("\n@@ Image folder available:", getImageFolder(), '\n');