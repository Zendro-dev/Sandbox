const XLSX = require('xlsx');
const Promise = require('bluebird');
const promise_csv_parse = Promise.promisify(require('csv-parse'));
const csv_parse = require('csv-parse');
const fs = require('fs');
const awaitifyStream = require('awaitify-stream');
const validatorUtil = require('./validatorUtil');
const admZip = require('adm-zip');
const { exec } = require("child_process");
const path = require("path");
const uuidv4 = require('uuid').v4;
const globals = require('../config/globals');


/**
 * replaceNullStringsWithLiteralNulls - Replace null entries of columns with literal null types
 *
 * @param  {array} arrOfObjs Each item correponds to a column represented as object.
 * @return {array}           Each item corresponds to a column and all items have either a valid entry or null type.
 */
replaceNullStringsWithLiteralNulls = function(arrOfObjs) {
  console.log(typeof arrOfObjs, arrOfObjs);
  return arrOfObjs.map(function(csvRow) {
    Object.keys(csvRow).forEach(function(csvCol) {
      csvCell = csvRow[csvCol]
      csvRow[csvCol] = csvCell === 'null' || csvCell === 'NULL' ?
        null : csvCell
    })
    return csvRow;
  });
}


/**
 * parseCsv - parse csv file (string)
 *
 * @param  {string} csvStr Csv file converted to string.
 * @param {string} delim Set the field delimiter in the csv file. One or multiple character.
 * @param {array|boolean|function} cols Columns as in csv-parser options.(true if auto-discovered in the first CSV line).
 * @return {array}        Each item correponds to a column represented as object and filtered with replaceNullStringsWithLiteralNulls function.
 */
exports.parseCsv = function(csvStr, delim, cols) {
  if (!delim) delim = ","
  if (typeof cols === 'undefined') cols = true
  return replaceNullStringsWithLiteralNulls(
    promise_csv_parse(csvStr, {
      delimiter: delim,
      columns: cols
    })
  )
}


/**
 * parseXlsx - description
 *
 * @param  {string} bstr Xlsx file converted to string
 * @return {array}      Each item correponds to a column represented as object and filtered with replaceNullStringsWithLiteralNulls function.
 */
exports.parseXlsx = function(bstr) {
  var workbook = XLSX.read(bstr, {
    type: "binary"
  });
  var sheet_name_list = workbook.SheetNames;
  return replaceNullStringsWithLiteralNulls(
    XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]])
  );
};

/**
 * Function that will delete a file if it exists and is insensitive to the
 * case when a file not exist.
 *
 * @param {String} path - A path to the file
 */
exports.deleteIfExists = function(path) {
  console.log(`Removing ${path}`);
  fs.unlink(path, function(err) {
    // file may be already deleted
  });
};

/**
 * Function deletes properties that contain string values "NULL" or "null".
 *
 * @param {Object} pojo - A plain old JavaScript object.
 *
 * @return {Object} A modified clone of the argument pojo in which all String
 * "NULL" or "null" values are deleted.
 */
exports.replacePojoNullValueWithLiteralNull = function(pojo) {
  if (pojo === null || pojo === undefined) {
    return null
  }
  let res = Object.assign({}, pojo);
  Object.keys(res).forEach((k) => {
    if (typeof res[k] === "string" && res[k].match(/\s*null\s*/i)) {
      delete res[k];
    }
  });
  return res
};


/**
 * Parse by streaming a csv file and create the records in the correspondant table
 * @function
 * @param {string} csvFilePath - The path where the csv file is stored.
 * @param {object} model - Sequelize model, record will be created through this model.
 * @param {string} delim - Set the field delimiter in the csv file. One or multiple character.
 * @param {array|boolean|function} cols - Columns as in csv-parser options.(true if auto-discovered in the first CSV line).
 */
exports.parseCsvStream = async function(csvFilePath, model, delim, cols) {

  if (!delim) delim = ",";
  if (typeof cols === 'undefined') cols = true;
  console.log("TYPEOF", typeof model);
  // Wrap all database actions within a transaction:
  let transaction = await model.sequelize.transaction();

  let addedFilePath = csvFilePath.substr(0, csvFilePath.lastIndexOf(".")) +
    ".json";
  let addedZipFilePath = csvFilePath.substr(0, csvFilePath.lastIndexOf(".")) +
    ".zip";

  console.log(addedFilePath);
  console.log(addedZipFilePath);

  try {
    // Pipe a file read-stream through a CSV-Reader and handle records asynchronously:
    let csvStream = awaitifyStream.createReader(
      fs.createReadStream(csvFilePath).pipe(
        csv_parse({
          delimiter: delim,
          columns: cols,
          cast: true
        })
      )
    );

    // Create an output file stream
    let addedRecords = awaitifyStream.createWriter(
      fs.createWriteStream(addedFilePath)
    );

    let record;
    let errors = [];

    while (null !== (record = await csvStream.readAsync())) {

      console.log(record);
      record = exports.replacePojoNullValueWithLiteralNull(record);
      console.log(record);


      try {
        let result = await validatorUtil.validateData(
          'validateForCreate', model, record);
        //console.log(result);
        await model.create(record, {
          transaction: transaction
        }).then(created => {

          // this is async, here we just push new line into the parallel thread
          // synchronization goes at endAsync;
          addedRecords.writeAsync(`${JSON.stringify(created)}\n`);

        }).catch(error => {
          console.log(
            `Caught sequelize error during CSV batch upload: ${JSON.stringify(error)}`
          );
          error.record = record;
          errors.push(error);
        })
      } catch (error) {
        console.log(
          `Validation error during CSV batch upload: ${JSON.stringify(error)}`
        );
        error['record'] = record;
        errors.push(error);

      }

    }

    // close the addedRecords file so it can be sent afterwards
    await addedRecords.endAsync();

    if (errors.length > 0) {
      let message =
        "Some records could not be submitted. No database changes has been applied.\n";
      message += "Please see the next list for details:\n";

      errors.forEach(function(error) {
        valErrMessages = error.errors.reduce((acc, val) => {
          return acc.concat(val.dataPath).concat(" ").concat(val.message)
            .concat(" ")
        })
        message +=
          `record ${JSON.stringify(error.record)} ${error.message}: ${valErrMessages}; \n`;
      });

      throw new Error(message.slice(0, message.length - 1));
    }

    await transaction.commit();

    // zip comitted data and return a corresponding file path
    let zipper = new admZip();
    zipper.addLocalFile(addedFilePath);
    await zipper.writeZip(addedZipFilePath);

    console.log(addedZipFilePath);

    // At this moment the parseCsvStream caller is responsible in deleting the
    // addedZipFilePath
    return addedZipFilePath;

  } catch (error) {

    await transaction.rollback();

    exports.deleteIfExists(addedFilePath);
    exports.deleteIfExists(addedZipFilePath);

    throw error;

  } finally {
    exports.deleteIfExists(addedFilePath);
  }
};

/**
 * @start ImageAttachment handlers
 */
module.exports.deleteFile = function (filePath) {
  // check if the file exists
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
  } catch (e) {
    console.log(`@Warning: trying to delete file: '${filePath}', does not exist`);
    console.log(e);
    return;
  }
  // delete
  try {
    fs.unlinkSync(filePath);
    console.log("@@ file deleted: ", filePath);
  } catch (e) {
    console.log(e);
    throw new Error("!Error: trying to delete file.");
  }
 }

module.exports.addImageFile = async function (input, context) {
  // case: does not have file
  if(!context.request.files || Object.keys(context.request.files).length === 0) {
    if(globals.CREATE_IMAGE_ATTACHMENT_FILE_REQUIRED) {
      throw new Error("No image attachment was provided with addImageAttachment mutation request");
    } else {
      /**
       * Delete internal image attributes from input
       */
      delete input.fileName;
      delete input.fileSizeKb;
      delete input.fileType;
      delete input.filePath;
      delete input.smallTnPath;
      delete input.mediumTnPath;
      return input;
    }
  } else { // case: has file
    //check: attachment
    if(!context.request.files.attachment) {
      throw new Error(`Input field name "attachment" was expected, but "${Object.keys(context.request.files.join(','))}" was received.`);
    } 
    //check: mime type
    if(/image/i.exec(context.request.files.attachment.mimetype) === null) {
      throw new Error(`Type of file "image" was expected, but "${context.request.files.attachment.mimetype}" was received.`);
    }
    //-- @debug
    console.log(`@@ express-fileupload generated the following handles: ${Object.keys(context.request.files)}`);
    //--
    /**
     * Store image & thumbnails
     */
    let fileHandle = context.request.files.attachment;
    let filePath = await exports.storeUploadedImageFile(fileHandle);
    let thumbnails = await exports.createThumbnails(filePath);
    /**
     * Set internal image attributes
     */
    input.fileName = fileHandle.name;
    input.fileSizeKb = (fileHandle.size / 1000);
    input.fileType = fileHandle.mimetype;
    input.filePath = filePath;
    input.smallTnPath = thumbnails.smallTnPath;
    input.mediumTnPath = thumbnails.mediumTnPath;
    return input;
  }
}

module.exports.deleteImageFile = async function ({filePath, smallTnPath, mediumTnPath}) {
  if(filePath) exports.deleteFile(filePath);
  if(smallTnPath) exports.deleteFile(smallTnPath);
  if(mediumTnPath) exports.deleteFile(mediumTnPath);
}

module.exports.updateImageFile = async function (input, context, {filePath, smallTnPath, mediumTnPath}) {
  /**
   * Add new image file
   *   - addImageFile will check if attachment was provided.
   */
  await exports.addImageFile(input, context);
  /**
   * Remove previous image file
   *   - if 'filePath' attribute exists, means that new image
   *     was stored, so previous image needs to be deleted.
   */
  if(input.filePath) await exports.deleteImageFile({filePath, smallTnPath, mediumTnPath});
  //done
  return input;
}

module.exports.storeUploadedImageFile = async function (expressFileUploadHandle) {
  try {  
    let destFolder = getImageFolder();
    let uuidFileName = uuidv4()
    let fileName = expressFileUploadHandle.name.replace(/^\S+(\.\S+)$/, `${uuidFileName}$1`)
    let destPath = path.join(destFolder, fileName)
    await expressFileUploadHandle.mv(path.resolve(destPath))
    console.log("@@ image file stored: ", destPath);
    return destPath
  }catch(e) {
    console.log(e);
    throw new Error("!Error: trying to store image file.");
  }  
}

module.exports.createThumbnails = async function (path2ImageFile) {
  try {
    let smallTnPath = path2ImageFile.replace(/^(\S+)(\.\S+$)/, '$1_small_tn$2')
    let mediumTnPath = path2ImageFile.replace(/^(\S+)(\.\S+$)/, '$1_medium_tn$2')
    let sysCmd = `convert ${path2ImageFile} -resize 64x64\\> ${smallTnPath} && ` +
      `convert ${path2ImageFile} -resize 120x120\\> ${mediumTnPath}`
    return await (new Promise((resolve, reject) => {
      exec(sysCmd, (error, stdout, stderr) => {
        if (error) reject(error)
        if (stderr) reject(stderr)
        resolve({
          smallTnPath: smallTnPath,
          mediumTnPath: mediumTnPath
        })
      })
    }))
  } catch (e) {
    console.log(e);
    throw new Error("!Error: trying to create thumbnails.");
  }
}

module.exports.isFileImage = async function (path2File) {
  return await (new Promise((resolve, reject) => {
    exec(`file ${path.resolve(path2File)}`, (error,
      stdout, stderr) => {
      if (error) reject(error)
      if (stderr) reject(stderr)
      resolve(/image/i.exec(stdout) !== null)
    })
  }))
}

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
  let currentMaxPath = basePath ? basePath : path.join('.', globals.PUBLIC_FOLDER, 'images');
  let currentMaxValue = null;
  let currentMaxPathStack = [];
  let _MAX_FILES = globals.MAX_FILES_PER_ATTACHMENT_FOLDER > 1 ? globals.MAX_FILES_PER_ATTACHMENT_FOLDER : 1;
  let _MAX_DEPTH = globals.PUBLIC_ATTACHMENT_FOLDER_DEPTH > 1 ? globals.PUBLIC_ATTACHMENT_FOLDER_DEPTH : 1;
  
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
        && (currentLevel > 0 ? (Number.parseInt(dirent.name) < _MAX_FILES) : true))
      .map(dirent => dirent.name)
      .sort(compareNumericStringAsc);

    return (dirs.length > 0) ? Number.parseInt(dirs[dirs.length - 1]) : null;
  } catch (e) {
    console.log(e);
    throw new Error("!Error: trying to get max path value from images' storage.");
  }
}

function getTotalDirEntries(basePath) {
  try {
    let entries = fs.readdirSync(basePath);
    return entries.length;
  } catch (e) {
    console.log(e);
    throw new Error("!Error: trying to get total entries in a path of images' storage.");
  }
}

function makeFullPath(basePath, currentLevel, depth) {
  try {
    //make full path string
    let fullPath = basePath;
    let numDirsToCreate = (depth - currentLevel);
    for (let i = 0; i < numDirsToCreate; i++) fullPath = path.join(fullPath, '/0');

    //make path
    fs.mkdirSync(fullPath, { recursive: true, mode: 0o1775 });
    return fullPath;
  } catch (e) {
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
  } catch (e) {
    console.log(e);
    throw new Error("!Error: trying to compare numeric strings.");
  }
}
/**
 * @end ImageAttachment handlers
 */
 