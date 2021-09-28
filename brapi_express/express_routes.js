const modelNames;
const readOneGqlTemplate = 'readOne###model###(id: ###id###){###attributes###}';

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

const getReadOneGraphQlQuery = function(model, idValue, attributesToFetch) {
  return readOneGqlTemplate.replace(
    "###model###", modelName).replace(
    "###id###", idValue).replace(
    "###attributes###", attributesToFetch);
}

const createReadOneRoute = function(model, acl, gqlFunc) {
  return async function(req, res) {
    const modelName = capitalizeString(model.definition.model);
    const idValue = req.params[model.idAttribute()];
    const atrs = Object.keys(model.definition.attributes).join(" ");
    let gqlQuery;
    if (isSearchRequest(req.url)) {
      /* gqlQuery = ... */;
      throw new Error("Not implemented");
    } else {
      gqlQuery = getReadOneGraphQlQuery(model, idValue, atrs);
    }
    const gqlContext = {
      request: req,
      acl: acl,
      benignErrors: [],
      recordsLimit: globals.LIMIT_RECORDS,
    }
    const gqlResponse = await gqlFunc(gqlQuery, gqlContext, undefined);
    res.json(gqlResponse);
  };
}

const buildGqlFunction = function(gqlSchema, gqlResolvers, gqlImplFunc) {
  return async function(gqlQuery, gqlContext, gqlVariables) {
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
    const readOneRoute = `${base}/${m}/:${model.idAttribute()}`;
    app.get(readOneRoute, createReadOneRoute(model, acl, graphQlFunc));
  })
}

module.exports = {
  mountRoutes,
  buildGqlFunction
};
