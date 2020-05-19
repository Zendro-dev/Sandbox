import requestGraphql from './request.graphql'
import getAttributes from './requests.attributes'

export default {
  
  tableTemplate(url) {
    let query = `query {csvTableTemplateObservationVariable}`

    /**
     * Debug
     */
    console.log("tableTemplate.query: gql:\n", query);

    return requestGraphql({ url, query });
  },

  /**
   * getCountItems
   * 
   * Get count of items from GraphQL Server.
   *  
   * @param {String} url GraphQL Server url
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  getCountItems(url, searchText, ops) {
    //search
    var s = getSearchArgument('observationVariable', searchText, ops);
    
    var query = '';

    //if has search
    if (s !== null) {
      query = `{ countObservationVariables(${s}) }`;
    }
    else {
      query = `{ countObservationVariables }`;
    }

    /**
     * Debug
     */
    console.log("getCountItems.query: gql:\n", query);

    return requestGraphql({ url, query });
  },

  /**
   * getItemsConnection
   * 
   * Get items from GraphQL Server using a cursor-based-connection. 
   * 
   * @param {String} url GraphQL Server url
   * @param {String} searchText Text string currently on search bar.
   * @param {String} orderBy Order field string.
   * @param {String} orderDirection Text string: asc | desc.
   * @param {Object} variables Object with cursor-based-pagination variables. 
   * @param {String} ops Object with additional query options.
   */
  getItemsConnection(url, searchText, orderBy, orderDirection, variables, ops) {
    //search
    var s = getSearchArgument('observationVariable', searchText, ops);

    //order
    var o = null;
    if (orderBy !== '' && orderBy !== null) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      o = `order: [ {field: ${orderBy}, order: ${upOrderDirection}} ]`;
    }
    
    var query = '';
    var qbody = `
          pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
          }
          edges {
            node {
              commonCropName,
              defaultValue,
              documentationURL,
              growthStage,
              institution,
              language,
              scientist,
              status,
              submissionTimestamp,
              xref,
              observationVariableDbId,
              observationVariableName,
              methodDbId,
              scaleDbId,
              traitDbId,
              ontologyDbId,
              method{ methodDbId },
              ontologyReference{ ontologyDbId },
              scale{ scaleDbId },
              trait{ traitDbId },
            }
          }`

    //if has search
    if (s !== null) {
      //if has order
      if (o != null) {
        
        query =
          `query observationVariablesConnection($pagination: paginationCursorInput)
            { observationVariablesConnection( ${s}, ${o}, pagination: $pagination ) {
              ${qbody}
            }}`
      }
      else {

        query =
          `query observationVariablesConnection($pagination: paginationCursorInput)
            { observationVariablesConnection( ${s}, pagination: $pagination ) {
              ${qbody}
            }}`
      }
    }
    else {
      //if has order
      if (o != null) {
        
        query =
          `query observationVariablesConnection($pagination: paginationCursorInput)
          { observationVariablesConnection( ${o}, pagination: $pagination ) {
            ${qbody}
          }}`
      }
      else {
        
        query =
          `query observationVariablesConnection($pagination: paginationCursorInput)
          { observationVariablesConnection( pagination: $pagination ) {
            ${qbody}
          }}`
      }
    }

    /**
     * Debug
     */
    console.log("getItemsConnection.query: gql:\n", query);
    console.log("getItemsConnection.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });

  },

  /**
   * createItem
   * 
   * Add new ObservationVariable item on GraphQL Server.
   * 
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new ObservationVariable item. 
   */
  createItem(url, variables) {
    var query = 
      `mutation
        addObservationVariable(
          $observationVariableDbId:ID!,
          $commonCropName:String,
          $defaultValue:String,
          $documentationURL:String,
          $growthStage:String,
          $institution:String,
          $language:String,
          $scientist:String,
          $status:String,
          $submissionTimestamp:DateTime,
          $xref:String,
          $observationVariableName:String,
          $addMethod: ID,
          $addOntologyReference: ID,
          $addScale: ID,
          $addTrait: ID,
          $addObservations: [ID],
          ) { addObservationVariable(
            observationVariableDbId:$observationVariableDbId,
            commonCropName:$commonCropName,
            defaultValue:$defaultValue,
            documentationURL:$documentationURL,
            growthStage:$growthStage,
            institution:$institution,
            language:$language,
            scientist:$scientist,
            status:$status,
            submissionTimestamp:$submissionTimestamp,
            xref:$xref,
            observationVariableName:$observationVariableName,
            addMethod: $addMethod,
            addOntologyReference: $addOntologyReference,
            addScale: $addScale,
            addTrait: $addTrait,
            addObservations: $addObservations,
          ) {
            commonCropName,
            defaultValue,
            documentationURL,
            growthStage,
            institution,
            language,
            scientist,
            status,
            submissionTimestamp,
            xref,
            observationVariableDbId,
            observationVariableName,
            methodDbId,
            scaleDbId,
            traitDbId,
            ontologyDbId,
            method{ methodDbId },
            ontologyReference{ ontologyDbId },
            scale{ scaleDbId },
            trait{ traitDbId },
          } }`;

    /**
     * Debug
     */
    console.log("createItem.query: gql:\n", query);
    console.log("createItem.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * updateItem
   * 
   * Update ObservationVariable item on GraphQL Server.
   * 
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given ObservationVariable item.  
   */
  updateItem(url, variables) {
    var query = 
      `mutation
        updateObservationVariable(
          $observationVariableDbId:ID!
          $commonCropName:String,
          $defaultValue:String,
          $documentationURL:String,
          $growthStage:String,
          $institution:String,
          $language:String,
          $scientist:String,
          $status:String,
          $submissionTimestamp:DateTime,
          $xref:String,
          $observationVariableName:String,
          $addMethod: ID,
          $removeMethod: ID,
          $addOntologyReference: ID,
          $removeOntologyReference: ID,
          $addScale: ID,
          $removeScale: ID,
          $addTrait: ID,
          $removeTrait: ID,
          $addObservations: [ID],
          $removeObservations: [ID],
          ) { updateObservationVariable(
            observationVariableDbId: $observationVariableDbId
            commonCropName: $commonCropName,
            defaultValue: $defaultValue,
            documentationURL: $documentationURL,
            growthStage: $growthStage,
            institution: $institution,
            language: $language,
            scientist: $scientist,
            status: $status,
            submissionTimestamp: $submissionTimestamp,
            xref: $xref,
            observationVariableName: $observationVariableName,
            addMethod: $addMethod,
            removeMethod: $removeMethod,
            addOntologyReference: $addOntologyReference,
            removeOntologyReference: $removeOntologyReference,
            addScale: $addScale,
            removeScale: $removeScale,
            addTrait: $addTrait,
            removeTrait: $removeTrait,
            addObservations: $addObservations,
            removeObservations: $removeObservations,
          ) {
            commonCropName,
            defaultValue,
            documentationURL,
            growthStage,
            institution,
            language,
            scientist,
            status,
            submissionTimestamp,
            xref,
            observationVariableDbId,
            observationVariableName,
            methodDbId,
            scaleDbId,
            traitDbId,
            ontologyDbId,
            method{ methodDbId },
            ontologyReference{ ontologyDbId },
            scale{ scaleDbId },
            trait{ traitDbId },
          } }`;

    /**
     * Debug
     */
    console.log("updateItem.query: gql:\n", query);
    console.log("updateItem.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * deleteItem
   * 
   * Delete an item on GraphQL Server.
   * 
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values needed to delete the ObservationVariable item. 
   */
  deleteItem(url, variables) {
    var query = 
      `mutation
        deleteObservationVariable(
          $observationVariableDbId:ID! 
        ) {
          deleteObservationVariable(
            observationVariableDbId:$observationVariableDbId
        ) }`

    /**
     * Debug
     */
    console.log("deleteItem.query: gql:\n", query);
    console.log("deleteItem.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * getMethodConnection
   * 
   * Get methods connection (cursor based) records associated to the given observationVariable record
   * through association 'Method', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} label Label name.
   * @param {String} sublabel Sublabel name.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  getMethodConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    var query = 
      `{ readOneObservationVariable(observationVariableDbId: "${itemId}") { 
        method{ 
          description,
          formula,
          methodClass,
          methodName,
          reference,
          methodDbId,
          ontologyDbId,
      } } }`;

    /**
     * Debug
     */
    console.log("getAssociationFilter.query: gql:\n", query);
    console.log("getAssociationFilter.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * 
   *  
   * getAssociatedMethodConnection
   * 
   * Get the method-ids associated (by cursor based connection) to the given observationVariable record 
   * through association 'Method', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedMethodConnection(url, itemId) {
    var query = 
    `{ readOneObservationVariable( observationVariableDbId: "${itemId}" ){ 
      method{ methodDbId } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },
  /**
   * getObservationsConnection
   * 
   * Get observations connection (cursor based) records associated to the given observationVariable record
   * through association 'Observations', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} label Label name.
   * @param {String} sublabel Sublabel name.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  getObservationsConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    //search
    var s = getSearchArgument('observation', searchText, ops); 

    var qbody = `
          pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
          },
          edges {
            node {
              collector,
              germplasmDbId,
              observationTimeStamp,
              observationUnitDbId,
              observationVariableDbId,
              studyDbId,
              uploadedBy,
              value,
              observationDbId,
              seasonDbId,
              imageDbId,
            }
          }`

    var query = (s) ?
      `query readOneObservationVariable($pagination: paginationCursorInput) {
        readOneObservationVariable(observationVariableDbId: "${itemId}") { 
          observationsConnection( ${s}, pagination: $pagination ) { 
            ${qbody},
          },
          countFilteredObservations( ${s} ) 
      } }` :      
      `query readOneObservationVariable($pagination: paginationCursorInput) {
        readOneObservationVariable(observationVariableDbId: "${itemId}") { 
          observationsConnection( pagination: $pagination ) { 
            ${qbody},
          },
          countFilteredObservations 
      } }`;

    /**
     * Debug
     */
    console.log("getAssociationFilter.query: gql:\n", query);
    console.log("getAssociationFilter.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * 
   *  
   * getAssociatedObservationsConnection
   * 
   * Get the observation-ids associated (by cursor based connection) to the given observationVariable record 
   * through association 'Observations', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedObservationsConnection(url, itemId) {
    var query = 
      `{ readOneObservationVariable( observationVariableDbId: "${itemId}" ){ 
        observationsConnection{ edges { node { observationDbId } } } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },
  /**
   * getOntologyReferenceConnection
   * 
   * Get ontologyReferences connection (cursor based) records associated to the given observationVariable record
   * through association 'OntologyReference', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} label Label name.
   * @param {String} sublabel Sublabel name.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  getOntologyReferenceConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    var query = 
      `{ readOneObservationVariable(observationVariableDbId: "${itemId}") { 
        ontologyReference{ 
          documentationURL,
          ontologyDbId,
          ontologyName,
          version,
      } } }`;

    /**
     * Debug
     */
    console.log("getAssociationFilter.query: gql:\n", query);
    console.log("getAssociationFilter.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * 
   *  
   * getAssociatedOntologyReferenceConnection
   * 
   * Get the ontologyReference-ids associated (by cursor based connection) to the given observationVariable record 
   * through association 'OntologyReference', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedOntologyReferenceConnection(url, itemId) {
    var query = 
    `{ readOneObservationVariable( observationVariableDbId: "${itemId}" ){ 
      ontologyReference{ ontologyDbId } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },
  /**
   * getScaleConnection
   * 
   * Get scales connection (cursor based) records associated to the given observationVariable record
   * through association 'Scale', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} label Label name.
   * @param {String} sublabel Sublabel name.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  getScaleConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    var query = 
      `{ readOneObservationVariable(observationVariableDbId: "${itemId}") { 
        scale{ 
          decimalPlaces,
          scaleName,
          xref,
          scaleDbId,
          ontologyDbId,
      } } }`;

    /**
     * Debug
     */
    console.log("getAssociationFilter.query: gql:\n", query);
    console.log("getAssociationFilter.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * 
   *  
   * getAssociatedScaleConnection
   * 
   * Get the scale-ids associated (by cursor based connection) to the given observationVariable record 
   * through association 'Scale', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedScaleConnection(url, itemId) {
    var query = 
    `{ readOneObservationVariable( observationVariableDbId: "${itemId}" ){ 
      scale{ scaleDbId } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },
  /**
   * getTraitConnection
   * 
   * Get traits connection (cursor based) records associated to the given observationVariable record
   * through association 'Trait', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} label Label name.
   * @param {String} sublabel Sublabel name.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  getTraitConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    var query = 
      `{ readOneObservationVariable(observationVariableDbId: "${itemId}") { 
        trait{ 
          attribute,
          entity,
          mainAbbreviation,
          status,
          traitClass,
          traitDescription,
          traitName,
          xref,
          traitDbId,
          ontologyDbId,
      } } }`;

    /**
     * Debug
     */
    console.log("getAssociationFilter.query: gql:\n", query);
    console.log("getAssociationFilter.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * 
   *  
   * getAssociatedTraitConnection
   * 
   * Get the trait-ids associated (by cursor based connection) to the given observationVariable record 
   * through association 'Trait', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedTraitConnection(url, itemId) {
    var query = 
    `{ readOneObservationVariable( observationVariableDbId: "${itemId}" ){ 
      trait{ traitDbId } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },
}

/**
 * Utils
 */
function getSearchArgument(filterName, searchText, ops) {
  
  var filterAttributes = getAttributes(filterName);
  var modelAttributes = Object.keys(filterAttributes);
  var ors = '';
  var orSearch = null;
  var ands = '';
  var andSearch = null;

  if(searchText !== null && searchText !== '' && modelAttributes.length > 0) {
    /*
      Make AND fields
    */
    var words = searchText.split(' ');

    //for each word
    for(let w = 0; w < words.length; w++) {
      /*
        Make OR fields
      */

      //for each attribute
      for(let i = 0; i < modelAttributes.length; i++) {
        let num = 0;
        let d = '';
        let t = '';
        let dt = '';

        switch (filterAttributes[modelAttributes[i]]) {
          case 'String':
            //add
            ors += `{field:${modelAttributes[i]}, value:{value:"%${words[w]}%"}, operator:like},`
            break;

          case 'Int':
            num = parseInt(words[w]);
            //add if: word is an integer number
            if (!isNaN(num)) {
              ors += `{field:${modelAttributes[i]}, value:{value:"${num}"}, operator:eq},`
            }
            break;

          case 'Float':
            num = parseFloat(words[w]);
            //add if: word is a float number
            if (!isNaN(num)) {
              ors += `{field:${modelAttributes[i]}, value:{value:"${num}"}, operator:eq},`
            }
            break;

          case 'Boolean':
            //add if: word is 'true' or 'false'
            if (words[w] === 'true' || words[w] === 'false') {
              ors += `{field:${modelAttributes[i]}, value:{value:"${words[w]}"}, operator:eq},`
            }
            break;

          case 'Date':
            d = getIsoDate(words[w]);
            //add if: word is an ISO date
            if (d !== '') {
              ors += `{field:${modelAttributes[i]}, value:{value:"${d}"}, operator:eq},`
            }
            break;

          case 'Time':
            t = getIsoTime(words[w]);
            //add if: word is an ISO time
            if (t !== '') {
              ors += `{field:${modelAttributes[i]}, value:{value:"${t}"}, operator:eq},`
            }
            break;

          case 'DateTime':
            dt = getIsoDateTime(words[w]);
            //add if: word is an ISO datetime
            if (dt !== '') {
              ors += `{field:${modelAttributes[i]}, value:{value:"${dt}"}, operator:eq},`
            }
            break;

          default:
            break;
        }

        //make OR search argument
        orSearch = `{operator:or, search: [ ${ors} ]},`

      }//end: for each attribute (ORs)

      //add to ANDs
      ands += orSearch;

    }//end: for each word (ANDs)

    /*
      Options
    */
    if (ops !== undefined && ops !== null && typeof ops === 'object') {

      /*
        -- 'only' option --
        For each field name in only array, an AND search argument will be added to search string. 

        Format:
          {
            only: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('only') && Array.isArray(ops.only)) {
        let onlyOrs = '';
        let onlySearch = '';

        //for each only object
        for(let i = 0; i < ops.only.length; i++) {
          let o = ops.only[i];
          /*
            Switch type
            At the momment, this only works for [InternalId] fields.
            An internalID can be of types: Int, Float or String.
          */
          if (o.type === 'Int' || o.type === 'Float' || o.type === 'String') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for(let k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //for each value
              for(let kv = 0; kv < va.length; kv++) {
                onlyOrs += `{field:${vkeys[k]}, value:{value:"${String(va[kv])}"}, operator:eq},`
              }//end: for earch value
            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch only object

        onlySearch = `{operator:or, search: [ ${onlyOrs} ]},`;
        ands += onlySearch;

      }//end: if has 'only'

      /*
        -- 'exclude' option --
        For each field name in exclude array, an AND search argument will be added to search string. 

        Format:
          {
            exclude: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('exclude') && Array.isArray(ops.exclude)) {
        //for each exclude object
        for(let i = 0; i < ops.exclude.length; i++) {
          let o = ops.exclude[i];

          /*
            Switch type
            At the momment, this only works for [InternalId] fields.
            An internalID can be of types: Int, Float or String.
          */
          if (o.type === 'Int' || o.type === 'Float' || o.type === 'String') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for(let k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //for each value
              for(let kv = 0; kv < va.length; kv++) {
                ands += `{field:${vkeys[k]}, value:{value:"${String(va[kv])}"}, operator:ne},`
              }//end: for earch value
            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch exclude object
      }//end: if has 'exclude'
    }//end: if has 'ops'

    //make search argument
    andSearch = `search: {operator:and, search: [ ${ands} ]}`
  }//end: if searchText
  else {
    /*
      Check: ops
    */
    /*
      Options
    */
    if (ops !== undefined && ops !== null && typeof ops === 'object') {
      /*
        -- 'only' option --
        For each field name in only array, an AND search argument will be added to search string. 
  
        Format:
          {
            only: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('only') && Array.isArray(ops.only)) {
        let onlyOrs = '';
        let onlySearch = '';

        //for each only object
        for(let i = 0; i < ops.only.length; i++) {
          let o = ops.only[i];
          /*
            Switch type
            At the momment, this only works for [InternalId] fields.
            An internalID can be of types: Int, Float or String.
          */
          if (o.type === 'Int' || o.type === 'Float' || o.type === 'String') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for(let k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //for each value
              for(let kv = 0; kv < va.length; kv++) {
                onlyOrs += `{field:${vkeys[k]}, value:{value:"${String(va[kv])}"}, operator:eq},`
              }//end: for earch value
            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch only object

        onlySearch = `{operator:or, search: [ ${onlyOrs} ]},`;
        ands += onlySearch;

      }//end: if has 'only'

      /*
        -- 'exclude' option --
        For each field name in exclude array, an AND search argument will be added to search string. 
  
        Format:
          {
            exclude: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('exclude') && Array.isArray(ops.exclude)) {

        //for each exclude object
        for(let i = 0; i < ops.exclude.length; i++) {
          let o = ops.exclude[i];
          /*
            Switch type
            At the momment, this only works for [InternalId] fields.
            An internalID can be of types: Int, Float or String.
          */
          if (o.type === 'Int' || o.type === 'Float' || o.type === 'String') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for(let k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //for each value
              for(let kv = 0; kv < va.length; kv++) {
                ands += `{field:${vkeys[k]}, value:{value:"${String(va[kv])}"}, operator:ne},`
              }//end: for earch value
            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch exclude object
      }//end: if has 'exclude'

      //make search argument
      andSearch = `search: {operator:and, search: [ ${ands} ]}`
    }//end: if has 'ops'
  }//end: if !searchText

  return andSearch;
}

function getIsoDate(text) {
  //if has the form: aaaa[-/]mm[-/]dd
  if (/^\d{4}[-/][01]\d[-/][0-3]\d/.test(text)) {

    let m = text.slice(5, 7);
    let d = text.slice(8, 10);

    let numM = parseInt(m);
    let numD = parseInt(d);

    //if has the correct content
    if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31)) {
      return text;
    }
  }
  return '';
}

function getIsoTime(text) {

  /**
   * Case: complete precision: hh:mm:ss.d+
   */
  if (/^[0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(text)) {

    let h = text.slice(0, 2);
    let numH = parseInt(h);

    if (numH >= 0 && numH <= 23) {
      return text;
    }

    return '';
  } else {
    /**
     * Case: no milliseconds: hh:mm:ss
     */
    if (/^[0-2]\d:[0-5]\d:[0-5]\d/.test(text)) {

      let h = text.slice(0, 2);
      let numH = parseInt(h);

      if (numH >= 0 && numH <= 23) {
        return text;
      }

      return '';
    } else {
      /**
       * Case: no seconds: hh:mm
       */
      if (/^[0-2]\d:[0-5]\d/.test(text)) {

        let h = text.slice(0, 2);
        let numH = parseInt(h);

        if (numH >= 0 && numH <= 23) {
          return text;
        }

        return '';
      }
    }
  }

  return '';
}

function getIsoDateTime(text) {

  /**
   * Case: complete precision: YYYY[-/]MM[-/]DD[ T]hh:mm:ss.d+
   */
  if (/^\d{4}[/-][01]\d[/-][0-3]\d[T ][0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(text)) {

    let M = text.slice(5, 7);
    let D = text.slice(8, 10);
    let h = text.slice(11, 13);

    let numM = parseInt(M);
    let numD = parseInt(D);
    let numH = parseInt(h);

    //if content ok
    if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31) && (numH >= 0 && numH <= 23)) {
      return text;
    }

    return '';
  } else {
    /**
     * Case: no milliseconds: YYYY[-/]MM[-/]DD[ T]hh:mm:ss
     */
    if (/^\d{4}[/-][01]\d[/-][0-3]\d[T ][0-2]\d:[0-5]\d:[0-5]\d/.test(text)) {

      let M = text.slice(5, 7);
      let D = text.slice(8, 10);
      let h = text.slice(11, 13);

      let numM = parseInt(M);
      let numD = parseInt(D);
      let numH = parseInt(h);

      //if content ok
      if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31) && (numH >= 0 && numH <= 23)) {
        return text;
      }

      return '';
    } else {
      /**
       * Case: no seconds: YYYY[-/]MM[-/]DD[ T]hh:mm
       */
      if (/^\d{4}[/-][01]\d[/-][0-3]\d[T ][0-2]\d:[0-5]\d/.test(text)) {

        let M = text.slice(5, 7);
        let D = text.slice(8, 10);
        let h = text.slice(11, 13);

        let numM = parseInt(M);
        let numD = parseInt(D);
        let numH = parseInt(h);

        //if content ok
        if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31) && (numH >= 0 && numH <= 23)) {
          return text;
        }

        return '';
      } else {
        /**
         * Case: no time: YYYY[-/]MM[-/]DD
         */
        if (/^\d{4}[/-][01]\d[/-][0-3]\d/.test(text)) {

          let M = text.slice(5, 7);
          let D = text.slice(8, 10);

          let numM = parseInt(M);
          let numD = parseInt(D);

          //if content ok
          if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31)) {
            return text;
          }

          return '';
        }
      }
    }
  }

  return '';
}