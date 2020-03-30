
  const fs = require('fs');
  const path = require('path');
  const Sequelize = require('sequelize');
  sequelize = require('../connection');

  let adapters = {};
  module.exports = adapters;

  fs.readdirSync(__dirname)
    .filter( file =>{ return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  }).forEach( file =>{

    let adapter = require(path.join(__dirname, file));
    if( adapters[adapter.adapterName] ){
      throw Error(`Duplicated adapter name ${adapter.adapterName}`);
    }
    
    if(adapter.adapterType === 'local'){
      adapters[adapter.adapterName] = adapter.init(sequelize, Sequelize);
    }else{
      adapters[adapter.adapterName] = adapter;
    }
  });
  
  