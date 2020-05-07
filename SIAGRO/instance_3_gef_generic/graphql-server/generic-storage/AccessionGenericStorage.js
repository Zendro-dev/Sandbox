let fs = require('fs');
path = require('path');

module.exports = class AccessionGenericStorage {
  constructor(){
    this.data = null;
    this.dataFileName = __dirname+'/accession-generic-data.json';
    this.init();
  }

  /**
   * init() - Read stored records.
   */
  init(){
    let data = null;
    //msg
    console.log("\n@ On init(): AccessionGenericStorage...");
    console.log("\n@ On dir: ", __dirname);

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

    //msg
    console.log("\n@ init(): AccessionGenericStorage ... ok");
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
   * addOne
   */
  async addOne(input){
    return null;
  }

  /**
   * updateOne
   */
  async updateOne(input, id){
    let record = null;

    //for each record... until found
    for(let i=0; i<this.data.length;++i){
      if(input[id] === this.data[i][id]) {
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
  async deleteOne(input){
      return null;
  }

}