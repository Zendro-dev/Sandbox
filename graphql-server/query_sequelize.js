const path = require('path');
const models = require(path.join(__dirname, 'models', 'index.js'));
const fs = require('fs');
const { simple_queries, search_queries, cursor_queries  } = require('./queries');
const {Op} =  require('sequelize');

const initializeStorageHandlersForModels = require(path.join(
    __dirname,
    "utils",
    "helper.js"
  )).initializeStorageHandlersForModels;

async function principal(queries, file_name){

   // console.log("SIMPLE QUERIES: ",simple_queries);

    let results = {};
    
    //BENCHMARK FUNCTION: ADD TIME TO RESULT
    function printBenchmark( ...time){
        const name = time[2].model.name+ '_' + time[2].limit;
        results[name]+= `,${time[1]}`;
      }

    //INITIALIZE MODELS 
     await initializeStorageHandlersForModels(models);

    

    //CREATE IDENTIFIES FOR RESULT
    queries.forEach( query =>{
        const name = query.model+ '_' + query.options.limit;
        results[name] = `${name}`;
    })


    //RUN THE SAME QUERY 100 TIMES
    for await(let query of queries){
        let options = query.options;
        options['logging'] = printBenchmark;
        for await( i of [...Array(100).keys()]){
         await models[ query.model ].findAll(options);
        }
       
    }

    //PRINT FILE
    for await( const [query, result] of Object.entries(results)){
        fs.appendFile(file_name, `${result} \n`, (err)=>{
            if(err) throw err;
        } );
    }
}

principal(simple_queries,'results_simple.csv');
principal(search_queries,'results_search.csv');
principal(cursor_queries,'results_cursor.csv');
