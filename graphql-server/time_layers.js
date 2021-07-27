const path = require('path');
const models = require(path.join(__dirname, 'models', 'index.js'));
const resolvers = require(path.join(__dirname, 'resolvers', 'index.js'));
const adapters = require(path.join(__dirname, 'models', 'adapters', 'index.js'));
const fs = require('fs');
const errorHelper = require('./utils/errors');
const { simple_queries, search_queries, cursor_queries  } = require('./queries');
const {Op} =  require('sequelize');

const initializeStorageHandlersForModels = require(path.join(
    __dirname,
    "utils",
    "helper.js"
  )).initializeStorageHandlersForModels;


const initializeStorageHandlersForAdapters = require(path.join(
  __dirname,
  "utils",
  "helper.js"
)).initializeStorageHandlersForAdapters;


let time_results = {
    resolver: `resolver_9000`,
    model: `model_9000`,
    adapter_instance1: `adapter_instance1_9000`,
    adapter_instance2: `adapter_instance2_9000`

}


//measure time in model layer
async function time_model(context){

    let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
    return await models.book.readAllCursor(undefined,undefined,{first: 9000}, undefined,benignErrorReporter, undefined);
}


//measure time in resolver layer

async function time_resolver(context){
    
    return await resolvers.booksConnection({pagination:{first:9000}},context);
}

//measure time in adapter layer
async function time_adapter(adapter_name, context){

let benignErrorReporter = new errorHelper.BenignErrorReporter(context);	
 return await adapters[adapter_name].readAllCursor(undefined,undefined,{first: 5000},benignErrorReporter);

}

let context = {
    body: {
        query: `booksConnection(pagination:{first: 9000}){
            books{
                book_id
                name
            }
        }`
    },
    acl: null,
    benignErrors : [],
    recordsLimit: 10000
}


async function principal(){
    await initializeStorageHandlersForModels(models);
    await initializeStorageHandlersForAdapters(adapters);
   for await (let i of [...Array(100).keys()]){
    let time_start =  Date.now();
    let result = await time_resolver(context);
    let time_end =  Date.now();	   
    let time_total = time_end - time_start ;
    //console.log("RESULT RESOLVER IN LOOP: ", result_resolver);
    //console.log("TIME RESULT: ", time_total, "ms");
    context.recordsLimit = 10000;
    time_results.resolver+= `,${time_total}`
    delete result;
   } 

   for await (let i of [...Array(100).keys()]){
    let time_start =  Date.now();
    let result = await time_model(context);
    let time_end =  Date.now();
    let time_total = time_end - time_start;
    //console.log("RESULT MODEL: ", result);
    //console.log("TIME RESULT: ", time_total, "ms");
    context.recordsLimit = 10000;
    time_results.model+= `,${time_total}`
    delete result;
   } 

   
   for await (let i of [...Array(100).keys()]){
    let time_start =  Date.now();
    let result = await time_adapter('book_instance2');
    let time_end =  Date.now();
    let time_total = time_end - time_start;
   // console.log("RESULT MODEL: ", result);
   // console.log("TIME RESULT ADAPTER: ", time_total, "ms");
    context.recordsLimit = 10000;
    time_results.adapter_instance2+= `,${time_total}`
    delete result;
   }

  /*	
   for await (let i of [...Array(100).keys()]){
    let time_start =  Date.now();
    let result = await time_adapter('book_instance1');
    let time_end =  Date.now();
    let time_total = time_end - time_start;
   // console.log("RESULT MODEL: ", result);
    console.log("TIME RESULT ADAPTER 1: ", time_total, "ms");
    context.recordsLimit = 10000;
    time_results.adapter_instance1+= `,${time_total}`
    delete result;
   }*/
	

   console.log("TIME RESULTS: ", time_results);
    //PRINT FILE
    for await( const [query, result] of Object.entries(time_results)){
        fs.appendFile("time_layers.csv", `${result} \n`, (err)=>{
            if(err) throw err;
        } );
    }

}

principal();
