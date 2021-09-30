const inflection = require('inflection');

var modelNames;
const readOneGqlTemplate = '{readOne###model###(###id_name###: ###id###){###attributes###}}';
const readManyGqlTemplate = '{###modelPl###(order:{field:###sortBy### order: ###sortOrder###} pagination:{limit: ###pageSize### offset: ###page###} ###search_request###){###attributes###}}'
const excludeModels = ["user", "role", "role_to_user"];

/**
 * capitalizeString - set initial character to upper case
 *
 * @param  {type} word String input to capitalize
 * @return {type}      String with upper case in the initial character
 */
const capitalizeString = function(word) {
  let length = word.length;
  if (length == 1) {
    return word.toUpperCase();
  } else {
    return word.slice(0, 1).toUpperCase() + word.slice(1, length);
  }
};


const getModelNames = function(models) {
  if (undefined === modelNames && models !== undefined) {
    modelNames = Object.keys(models).filter(x => models[[x]].definition).map(
      x => models[[x]].definition
      .model).filter(x => !excludeModels.includes(x));
  }
  return modelNames;
}

const matchUrlWithModel = function(urlStr, modelNames) {
  return modelNames.filter(m => urlStr.includes(m));
}

const isSearchRequest = function(urlStr) {
  return urlStr.includes("search");
}

const getReadOneGraphQlQuery = function(modelName, idName, idValue, attributesToFetch) {
  return readOneGqlTemplate.replace(
    "###model###", modelName).replace(
    "###id_name###", idName).replace(
    "###id###", `"${idValue}"`).replace(
    "###attributes###", attributesToFetch);
}

const createReadOneRoute = function(model, acl, gqlFunc) {
  return async function(req, res) {
    // console.log(JSON.stringify(req.query,null,2))
    const modelName = capitalizeString(model.definition.model);
    const idValue = req.params[model.idAttribute()];
    const atrs = Object.keys(model.definition.attributes).join(" ");
    const gqlQuery = getReadOneGraphQlQuery(modelName, model.idAttribute(), idValue, atrs);
    const gqlContext = {
      request: req,
      acl: acl,
      benignErrors: [],
      recordsLimit: process.env.LIMIT_RECORDS || 10000,
    }
    const gqlResponse = await gqlFunc(gqlQuery, gqlContext, undefined);
    res.json(gqlResponse);
  };
}

const buildSearch = function(params) {
  if (Object.keys(params).length === 0) {
    return ""
  }

  let search = Object.entries(params).reduce((a,c) => {
    const operator = Array.isArray(c[1]) && c[1].length > 1 ? 'in' : 'eq'; 
    const valueType = Array.isArray(c[1]) && c[1].length > 1 ? 'Array' : "String"
    return a + `{field: ${c[0]} value: "${c[1].toString()}" valueType: ${valueType} operator: ${operator}} `
  },"")
  return `search:{operator: and search: [${search}]}`;
  
}

const getReadManyGraphQlQuery = function(modelPl,sortBy, sortOrder, pageSize, page, search, attributesToFetch) {
  return readManyGqlTemplate.replace(
    "###modelPl###", modelPl).replace(
      "###sortBy###", sortBy).replace(
        "###sortOrder###", sortOrder).replace(
    "###pageSize###", pageSize).replace(
    "###page###", page).replace(
      "###search_request###",search).replace(
    "###attributes###", attributesToFetch);
}

const createReadManyRoute = function(model, acl, gqlFunc) {
  return async function(req, res) {
    const modelPl = inflection.pluralize(model.definition.model);
    const {pageSize, page, sortBy, sortOrder, ...params} = req.query;

    const search = buildSearch(params);
    const orderField = sortBy ? sortBy : model.idAttribute();
    const orderOrder = sortOrder ? sortOrder : 'ASC';
    pageSize = pageSize ? pageSize : process.env.LIMIT_RECORDS || 10000;
    page = page ? page : 0;
    const attrs = Object.keys(model.definition.attributes).join(" ");

    const gqlQuery = getReadManyGraphQlQuery(modelPl,orderField, orderOrder, pageSize, page, search,attrs);
    
    const gqlContext = {
      request: req,
      acl: acl,
      benignErrors: [],
      recordsLimit: process.env.LIMIT_RECORDS || 10000,
    }
    const gqlResponse = await gqlFunc(gqlQuery, gqlContext, undefined);
    res.json(gqlResponse);
  };
}

const createSearchRoute = function(model, acl, gqlFunc) {
  return async function(req, res) {
    const modelPl = inflection.pluralize(model.definition.model);
    let {pageSize, page, sortBy, sortOrder, ...params} = req.body;
    

    const search = buildSearch(params);
    const orderField = sortBy ? sortBy : model.idAttribute();
    const orderOrder = sortOrder ? sortOrder : 'ASC';
    pageSize = pageSize ? pageSize : process.env.LIMIT_RECORDS || 10000;
    page = page ? page : 0;
    const attrs = Object.keys(model.definition.attributes).join(" ");

    const gqlQuery = getReadManyGraphQlQuery(modelPl,orderField, orderOrder, pageSize, page, search,attrs);
    console.log(gqlQuery)
    const gqlContext = {
      request: req,
      acl: acl,
      benignErrors: [],
      recordsLimit: process.env.LIMIT_RECORDS || 10000,
    }
    const gqlResponse = await gqlFunc(gqlQuery, gqlContext, undefined);
    res.json(gqlResponse);
  };
}

const buildGqlFunction = function(gqlSchema, gqlResolvers, gqlImplFunc) {
  return async function(gqlQuery, gqlContext, gqlVariables) {
    console.log(`Resolvers = ${gqlResolvers}`);
    return gqlImplFunc(
        gqlSchema,
        gqlQuery,
        gqlResolvers,
        gqlContext,
        gqlVariables
      );
  };
};

const mountRoutes = function(app, base, models, graphQlFunc, acl) {
  if (undefined === base) {
    base = "/brapi/v2";
  }
  const modelNames = getModelNames(models);
  modelNames.forEach( function(m) {
    const model = models[m];
    const modelPl = inflection.pluralize(m);

    const readOneRoute = `${base}/${modelPl}/:${model.idAttribute()}`;
    app.get(readOneRoute, createReadOneRoute(model, acl, graphQlFunc));

    const readManyRoute = `${base}/${modelPl}`;
    app.get(readManyRoute, createReadManyRoute(model, acl, graphQlFunc));

    const searchRoute = `${base}/search/${modelPl}`;
    app.post(searchRoute, createSearchRoute(model, acl, graphQlFunc));
  })
}

module.exports = {
  mountRoutes,
  buildGqlFunction
};
