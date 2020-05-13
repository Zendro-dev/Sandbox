let fs = require('fs');
path = require('path');

module.exports = class GenericStorage {
  constructor({idName, dataFileName}){
    this.dataFileName = __dirname+'/'+dataFileName;
    this.data = [];
    this.idName = idName;
    this.ids = [];
    this.maxRecords = 1000;
    this.init();
  }

  /**
   * init() - Read stored records.
   */
  init(){
    let data = null;
    //msg
    console.log("@ On init(): GenericStorage...");
    console.log("@ dataFileName: ", this.dataFileName);
    console.log("@ idName: ", this.idName);
    
    //check idName
    if(!this.idName || (typeof this.idName !== 'string' && !(this.idName instanceof String))) {
      throw new Error('@@ Error: a non-empty string value in attribute idName must be provided for GenericStorage.');
    }

    //check dataFileName
    if(!this.dataFileName || (typeof this.dataFileName !== 'string' && !(this.dataFileName instanceof String))) {
      throw new Error('@@ Error: a non-empty string value in attribute dataFileName must be provided for GenericStorage.');
    }

    //read
    try {
      data = fs.readFileSync(this.dataFileName, 'utf8');
      //msg
      console.log("@@ File readed:", this.dataFileName, '... ok');
    } catch (e) {
      //msg
      console.log('@@ Error: reading file:', this.dataFileName);
      console.log('@@', e);
      throw new Error(e);
    }

    //parse
    try {
      this.data = JSON.parse(data);
      //msg
      console.log("@@ Data parsed: ... ok");
      console.log("@@ Stored records count:", this.data.length);
    } catch (e) {
      //msg
      console.log('@@ Error: parsing JSON on file:', this.dataFileName);
      console.log('@@', e);
      this.data = null;
      throw new Error(e);
    }

    //construct ids array
    for(let i=0; i<this.data.length; i++) {
      let internalId = this.data[i][this.idName];

      //check: ID constraint:
      if(!internalId) {
        throw new Error(`ID constraint: All records must have the id attribute: ${this.idName}, but the following record does not have it: ${JSON.stringify(data[i])}`);
      }

      if(this.ids.includes(internalId)) {
        console.log(`@@ Warning: the internal id ${this.idName}=${internalId} is duplicated!`);
      } else {
        this.ids.push(internalId);
      }
    }
    //msg
    console.log("@@ Internal id's obtained: ... ok");
    console.log("@@ ids: ", this.ids);
    //msg
    console.log("@ init(): AccessionGenericStorage ... ok");
  }

  /**
   * countRecords
   */
  async countRecords(search){
    return this.data.length;
  }

  /**
   * readAll
   */
  async readAll(search, order, pagination){
    return this.data;
  }

  /**
   * readById
   */
  async readById(id){
    //for each record... until found
    for(let i=0; i<this.data.length;++i){
      if(id === this.data[i][this.idName]) {
        //found
        return this.data[i];
      }
    }
    //not found
    return null;
  }

  /**
   * addOne
   */
  async addOne(input){
    let internalId = input[this.idName];
    console.log("internalID: ", internalId);
    console.log("ids: ", this.ids);
    
    
    //check: Not null constraint on @id
    if(!internalId) {
      throw new Error(`Not null constraint: the internal id must be defined and have a non-null and non-empty and non-zero value.`);
    }//else...

    // check: Unique constraint on @id     
    if(this.ids.includes(internalId)) {
      throw new Error(`Unique constraint: the internal id ${this.idName}=${internalId} already exists.`);
    }//else...

    //check: maxRecords
    if(this.data.length >= this.maxRecords) {
      throw new Error(`Max records constraint: the generic storage has reached its maximum records limit`);
    }//else...

    //add
    this.data.push(input);
    this.ids.push(internalId);

    //save on storage
    try {
      fs.writeFileSync(this.dataFileName, JSON.stringify(this.data));
    } catch (e) {
      //msg
      console.log('@@ Error: writing file:', this.dataFileName);
      console.log('@@', e);
      throw new Error(e);
    }

    return input;
  }

  /**
   * updateOne
   */
  async updateOne(input){
    let record = null;

    //for each record... until found
    for(let i=0; i<this.data.length;++i){
      if(input[this.idName] === this.data[i][this.idName]) {
        //found
        record = this.data[i];
        break;
      }
    }

    //update
    if(record){
      let keys = Object.keys(input);
      
      //for each input property
      for(let i=0; i<keys.length; ++i){
        record[keys[i]] = input[keys[i]];
      }
    }

    //save on storage
    try {
      fs.writeFileSync(this.dataFileName, JSON.stringify(this.data));
    } catch (e) {
      //msg
      console.log('@@ Error: writing file:', this.dataFileName);
      console.log('@@', e);
      throw new Error(e);
    }

    return record;
  }

  /**
   * deleteOne
   */
  async deleteOne(id){
    //for each record... until found
    for(let i=0; i<this.data.length;++i){
      if(id === this.data[i][this.idName]) {
        //found: delete
        this.data.splice(i, 1);

        //save on storage
        try {
          fs.writeFileSync(this.dataFileName, JSON.stringify(this.data));
        } catch (e) {
          //msg
          console.log('@@ Error: writing file:', this.dataFileName);
          console.log('@@', e);
          throw new Error(e);
        }
        return id;
      }
    }
    //not found
    return null;
  }
}