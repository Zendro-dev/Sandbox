import requestGraphql from './request.graphql'
import getAttributes from './requests.attributes'

export default {
  
  tableTemplate(url) {
    let query = `query {csvTableTemplateGermplasm}`

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
    var s = getSearchArgument('germplasm', searchText, ops);
    
    var query = '';

    //if has search
    if (s !== null) {
      query = `{ countGermplasms(${s}) }`;
    }
    else {
      query = `{ countGermplasms }`;
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
    var s = getSearchArgument('germplasm', searchText, ops);

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
              accessionNumber,
              acquisitionDate,
              breedingMethodDbId,
              commonCropName,
              countryOfOriginCode,
              defaultDisplayName,
              documentationURL,
              germplasmGenus,
              germplasmName,
              germplasmPUI,
              germplasmPreprocessing,
              germplasmSpecies,
              germplasmSubtaxa,
              instituteCode,
              instituteName,
              pedigree,
              seedSource,
              seedSourceDescription,
              speciesAuthority,
              subtaxaAuthority,
              xref,
              germplasmDbId,
              biologicalStatusOfAccessionCode,
              breedingMethod{ breedingMethodDbId },
            }
          }`

    //if has search
    if (s !== null) {
      //if has order
      if (o != null) {
        
        query =
          `query germplasmsConnection($pagination: paginationCursorInput)
            { germplasmsConnection( ${s}, ${o}, pagination: $pagination ) {
              ${qbody}
            }}`
      }
      else {

        query =
          `query germplasmsConnection($pagination: paginationCursorInput)
            { germplasmsConnection( ${s}, pagination: $pagination ) {
              ${qbody}
            }}`
      }
    }
    else {
      //if has order
      if (o != null) {
        
        query =
          `query germplasmsConnection($pagination: paginationCursorInput)
          { germplasmsConnection( ${o}, pagination: $pagination ) {
            ${qbody}
          }}`
      }
      else {
        
        query =
          `query germplasmsConnection($pagination: paginationCursorInput)
          { germplasmsConnection( pagination: $pagination ) {
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
   * Add new Germplasm item on GraphQL Server.
   * 
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Germplasm item. 
   */
  createItem(url, variables) {
    var query = 
      `mutation
        addGermplasm(
          $germplasmDbId:ID!,
          $accessionNumber:String,
          $acquisitionDate:Date,
          $commonCropName:String,
          $countryOfOriginCode:String,
          $defaultDisplayName:String,
          $documentationURL:String,
          $germplasmGenus:String,
          $germplasmName:String,
          $germplasmPUI:String,
          $germplasmPreprocessing:String,
          $germplasmSpecies:String,
          $germplasmSubtaxa:String,
          $instituteCode:String,
          $instituteName:String,
          $pedigree:String,
          $seedSource:String,
          $seedSourceDescription:String,
          $speciesAuthority:String,
          $subtaxaAuthority:String,
          $xref:String,
          $biologicalStatusOfAccessionCode:String,
          $addBreedingMethod: ID,
          $addObservations: [ID],
          $addObservationUnits: [ID],
          ) { addGermplasm(
            germplasmDbId:$germplasmDbId,
            accessionNumber:$accessionNumber,
            acquisitionDate:$acquisitionDate,
            commonCropName:$commonCropName,
            countryOfOriginCode:$countryOfOriginCode,
            defaultDisplayName:$defaultDisplayName,
            documentationURL:$documentationURL,
            germplasmGenus:$germplasmGenus,
            germplasmName:$germplasmName,
            germplasmPUI:$germplasmPUI,
            germplasmPreprocessing:$germplasmPreprocessing,
            germplasmSpecies:$germplasmSpecies,
            germplasmSubtaxa:$germplasmSubtaxa,
            instituteCode:$instituteCode,
            instituteName:$instituteName,
            pedigree:$pedigree,
            seedSource:$seedSource,
            seedSourceDescription:$seedSourceDescription,
            speciesAuthority:$speciesAuthority,
            subtaxaAuthority:$subtaxaAuthority,
            xref:$xref,
            biologicalStatusOfAccessionCode:$biologicalStatusOfAccessionCode,
            addBreedingMethod: $addBreedingMethod,
            addObservations: $addObservations,
            addObservationUnits: $addObservationUnits,
          ) {
            accessionNumber,
            acquisitionDate,
            breedingMethodDbId,
            commonCropName,
            countryOfOriginCode,
            defaultDisplayName,
            documentationURL,
            germplasmGenus,
            germplasmName,
            germplasmPUI,
            germplasmPreprocessing,
            germplasmSpecies,
            germplasmSubtaxa,
            instituteCode,
            instituteName,
            pedigree,
            seedSource,
            seedSourceDescription,
            speciesAuthority,
            subtaxaAuthority,
            xref,
            germplasmDbId,
            biologicalStatusOfAccessionCode,
            breedingMethod{ breedingMethodDbId },
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
   * Update Germplasm item on GraphQL Server.
   * 
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Germplasm item.  
   */
  updateItem(url, variables) {
    var query = 
      `mutation
        updateGermplasm(
          $germplasmDbId:ID!
          $accessionNumber:String,
          $acquisitionDate:Date,
          $commonCropName:String,
          $countryOfOriginCode:String,
          $defaultDisplayName:String,
          $documentationURL:String,
          $germplasmGenus:String,
          $germplasmName:String,
          $germplasmPUI:String,
          $germplasmPreprocessing:String,
          $germplasmSpecies:String,
          $germplasmSubtaxa:String,
          $instituteCode:String,
          $instituteName:String,
          $pedigree:String,
          $seedSource:String,
          $seedSourceDescription:String,
          $speciesAuthority:String,
          $subtaxaAuthority:String,
          $xref:String,
          $biologicalStatusOfAccessionCode:String,
          $addBreedingMethod: ID,
          $removeBreedingMethod: ID,
          $addObservations: [ID],
          $removeObservations: [ID],
          $addObservationUnits: [ID],
          $removeObservationUnits: [ID],
          ) { updateGermplasm(
            germplasmDbId: $germplasmDbId
            accessionNumber: $accessionNumber,
            acquisitionDate: $acquisitionDate,
            commonCropName: $commonCropName,
            countryOfOriginCode: $countryOfOriginCode,
            defaultDisplayName: $defaultDisplayName,
            documentationURL: $documentationURL,
            germplasmGenus: $germplasmGenus,
            germplasmName: $germplasmName,
            germplasmPUI: $germplasmPUI,
            germplasmPreprocessing: $germplasmPreprocessing,
            germplasmSpecies: $germplasmSpecies,
            germplasmSubtaxa: $germplasmSubtaxa,
            instituteCode: $instituteCode,
            instituteName: $instituteName,
            pedigree: $pedigree,
            seedSource: $seedSource,
            seedSourceDescription: $seedSourceDescription,
            speciesAuthority: $speciesAuthority,
            subtaxaAuthority: $subtaxaAuthority,
            xref: $xref,
            biologicalStatusOfAccessionCode: $biologicalStatusOfAccessionCode,
            addBreedingMethod: $addBreedingMethod,
            removeBreedingMethod: $removeBreedingMethod,
            addObservations: $addObservations,
            removeObservations: $removeObservations,
            addObservationUnits: $addObservationUnits,
            removeObservationUnits: $removeObservationUnits,
          ) {
            accessionNumber,
            acquisitionDate,
            breedingMethodDbId,
            commonCropName,
            countryOfOriginCode,
            defaultDisplayName,
            documentationURL,
            germplasmGenus,
            germplasmName,
            germplasmPUI,
            germplasmPreprocessing,
            germplasmSpecies,
            germplasmSubtaxa,
            instituteCode,
            instituteName,
            pedigree,
            seedSource,
            seedSourceDescription,
            speciesAuthority,
            subtaxaAuthority,
            xref,
            germplasmDbId,
            biologicalStatusOfAccessionCode,
            breedingMethod{ breedingMethodDbId },
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
   * @param {Object} variables Object with values needed to delete the Germplasm item. 
   */
  deleteItem(url, variables) {
    var query = 
      `mutation
        deleteGermplasm(
          $germplasmDbId:ID! 
        ) {
          deleteGermplasm(
            germplasmDbId:$germplasmDbId
        ) }`

    /**
     * Debug
     */
    console.log("deleteItem.query: gql:\n", query);
    console.log("deleteItem.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * getBreedingMethodConnection
   * 
   * Get breedingMethods connection (cursor based) records associated to the given germplasm record
   * through association 'BreedingMethod', from GraphQL Server.
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
  getBreedingMethodConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    var query = 
      `{ readOneGermplasm(germplasmDbId: "${itemId}") { 
        breedingMethod{ 
          abbreviation,
          breedingMethodDbId,
          breedingMethodName,
          description,
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
   * getAssociatedBreedingMethodConnection
   * 
   * Get the breedingMethod-ids associated (by cursor based connection) to the given germplasm record 
   * through association 'BreedingMethod', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedBreedingMethodConnection(url, itemId) {
    var query = 
    `{ readOneGermplasm( germplasmDbId: "${itemId}" ){ 
      breedingMethod{ breedingMethodDbId } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },
  /**
   * getObservationsConnection
   * 
   * Get observations connection (cursor based) records associated to the given germplasm record
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
      `query readOneGermplasm($pagination: paginationCursorInput) {
        readOneGermplasm(germplasmDbId: "${itemId}") { 
          observationsConnection( ${s}, pagination: $pagination ) { 
            ${qbody},
          },
          countFilteredObservations( ${s} ) 
      } }` :      
      `query readOneGermplasm($pagination: paginationCursorInput) {
        readOneGermplasm(germplasmDbId: "${itemId}") { 
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
   * Get the observation-ids associated (by cursor based connection) to the given germplasm record 
   * through association 'Observations', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedObservationsConnection(url, itemId) {
    var query = 
      `{ readOneGermplasm( germplasmDbId: "${itemId}" ){ 
        observationsConnection{ edges { node { observationDbId } } } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },
  /**
   * getObservationUnitsConnection
   * 
   * Get observationUnits connection (cursor based) records associated to the given germplasm record
   * through association 'ObservationUnits', from GraphQL Server.
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
  getObservationUnitsConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    //search
    var s = getSearchArgument('observationUnit', searchText, ops); 

    var qbody = `
          pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
          },
          edges {
            node {
              germplasmDbId,
              locationDbId,
              observationLevel,
              observationUnitName,
              observationUnitPUI,
              plantNumber,
              plotNumber,
              programDbId,
              studyDbId,
              trialDbId,
              observationUnitDbId,
            }
          }`

    var query = (s) ?
      `query readOneGermplasm($pagination: paginationCursorInput) {
        readOneGermplasm(germplasmDbId: "${itemId}") { 
          observationUnitsConnection( ${s}, pagination: $pagination ) { 
            ${qbody},
          },
          countFilteredObservationUnits( ${s} ) 
      } }` :      
      `query readOneGermplasm($pagination: paginationCursorInput) {
        readOneGermplasm(germplasmDbId: "${itemId}") { 
          observationUnitsConnection( pagination: $pagination ) { 
            ${qbody},
          },
          countFilteredObservationUnits 
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
   * getAssociatedObservationUnitsConnection
   * 
   * Get the observationUnit-ids associated (by cursor based connection) to the given germplasm record 
   * through association 'ObservationUnits', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedObservationUnitsConnection(url, itemId) {
    var query = 
      `{ readOneGermplasm( germplasmDbId: "${itemId}" ){ 
        observationUnitsConnection{ edges { node { observationUnitDbId } } } } }`;
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