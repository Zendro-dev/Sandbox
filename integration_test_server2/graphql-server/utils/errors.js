const { GraphQLError } = require('graphql');
const helper = require('./helper')

class CenzontleError extends Error{
  constructor({message, path, locations, extensions}) {
    super();
    this.message = message;
    this.path = path;
    this.locations = locations;
    this.extensions = extensions
  }
}

module.exports.handleRemoteErrors = function( errs, multErrsMessage ) {
  if ( helper.isNonEmptyArray( errs ) ) {
    // Only a SINGLE error was sent
    if ( errs.length === 1 ) {
      let e = errs[0]
      // properties of e will be automatically extracted
      // with named arguments (destructuring)
      return new CenzontleError( e )
    } else if ( errs.length > 1 ) {  // actually length > 1 is a given here, isn't it?
      return new CenzontleError( {message: multErrsMessage, extensions: errs} )
    }
  } else {
   return null
  }
}

module.exports.isRemoteGraphQlError = function( err ) {
  return err.response && err.response.data && Array.isArray( err.response.data.errors )
}

module.exports.stringifyCompletely = function(error, replacer, space) {
  let allKeys = Reflect.ownKeys(error);
  let errorMap = {};
  for (let key of allKeys) {
    errorMap[`${key}`] = error[`${key}`];
  }
  return JSON.stringify(errorMap, replacer, space);
}

module.exports.handleError = function(error){
  throw new Error(error);
}

/*constructErrorForLogging = function(error) {
  if(error.message){
    return transformDetailsAndReturnError(error, error.message);
  }else if(error.name === "SequelizeValidationError"){
    return transformDetailsAndReturnError(error, "Validation error.");
  }else if(error.code === 'ECONNABORTED' && error.url!== undefined){
    return new GraphQLError(`Time out exceeded trying to reach server ${error.url}`);
  }else{
    return transformDetailsAndReturnError(error, "");
  }
}*/