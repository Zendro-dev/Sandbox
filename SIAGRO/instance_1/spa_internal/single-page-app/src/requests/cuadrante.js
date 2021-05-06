import { requestGraphql } from '../utils'
import getAttributes from './requests.attributes'

export default {
  
  tableTemplate(url) {
    let query = `query {csvTableTemplateCuadrante}`

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
    var s = getSearchArgument('cuadrante', searchText, ops);
    
    var query = '';

    //if has search
    if (s !== null) {
      query = `{ countCuadrantes(${s}) }`;
    }
    else {
      query = `{ countCuadrantes }`;
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
    var s = getSearchArgument('cuadrante', searchText, ops);

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
              cuadrante_id,
              produccion_valor,
              produccion_etiqueta,
              autoconsumo_valor,
              autoconsumo_etiqueta,
              compra_valor,
              compra_etiqueta,
              venta_valor,
              venta_etiqueta,
              nombre_comun_grupo_enfoque,
              grupo_enfoque_id,
              taxon_id,
              tipo_planta_id,
              grupo_enfoque{ grupo_id },
              informacion_taxonomica{ id },
              tipo_planta{ tipo_planta_id },
            }
          }`

    //if has search
    if (s !== null) {
      //if has order
      if (o != null) {
        
        query =
          `query cuadrantesConnection($pagination: paginationCursorInput)
            { cuadrantesConnection( ${s}, ${o}, pagination: $pagination ) {
              ${qbody}
            }}`
      }
      else {

        query =
          `query cuadrantesConnection($pagination: paginationCursorInput)
            { cuadrantesConnection( ${s}, pagination: $pagination ) {
              ${qbody}
            }}`
      }
    }
    else {
      //if has order
      if (o != null) {
        
        query =
          `query cuadrantesConnection($pagination: paginationCursorInput)
          { cuadrantesConnection( ${o}, pagination: $pagination ) {
            ${qbody}
          }}`
      }
      else {
        
        query =
          `query cuadrantesConnection($pagination: paginationCursorInput)
          { cuadrantesConnection( pagination: $pagination ) {
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
   * Add new Cuadrante item on GraphQL Server.
   * 
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Cuadrante item. 
   */
  createItem(url, variables) {
    var query = 
      `mutation
        addCuadrante(
          $cuadrante_id:ID!,
          $produccion_valor:Int,
          $produccion_etiqueta:String,
          $autoconsumo_valor:Int,
          $autoconsumo_etiqueta:String,
          $compra_valor:Int,
          $compra_etiqueta:String,
          $venta_valor:Int,
          $venta_etiqueta:String,
          $nombre_comun_grupo_enfoque:String,
          $addGrupo_enfoque: ID,
          $addInformacion_taxonomica: ID,
          $addTipo_planta: ID,
          ) { addCuadrante(
            cuadrante_id:$cuadrante_id,
            produccion_valor:$produccion_valor,
            produccion_etiqueta:$produccion_etiqueta,
            autoconsumo_valor:$autoconsumo_valor,
            autoconsumo_etiqueta:$autoconsumo_etiqueta,
            compra_valor:$compra_valor,
            compra_etiqueta:$compra_etiqueta,
            venta_valor:$venta_valor,
            venta_etiqueta:$venta_etiqueta,
            nombre_comun_grupo_enfoque:$nombre_comun_grupo_enfoque,
            addGrupo_enfoque: $addGrupo_enfoque,
            addInformacion_taxonomica: $addInformacion_taxonomica,
            addTipo_planta: $addTipo_planta,
          ) {
            cuadrante_id,
            produccion_valor,
            produccion_etiqueta,
            autoconsumo_valor,
            autoconsumo_etiqueta,
            compra_valor,
            compra_etiqueta,
            venta_valor,
            venta_etiqueta,
            nombre_comun_grupo_enfoque,
            grupo_enfoque_id,
            taxon_id,
            tipo_planta_id,
            grupo_enfoque{ grupo_id },
            informacion_taxonomica{ id },
            tipo_planta{ tipo_planta_id },
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
   * Update Cuadrante item on GraphQL Server.
   * 
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Cuadrante item.  
   */
  updateItem(url, variables) {
    var query = 
      `mutation
        updateCuadrante(
          $cuadrante_id:ID!
          $produccion_valor:Int,
          $produccion_etiqueta:String,
          $autoconsumo_valor:Int,
          $autoconsumo_etiqueta:String,
          $compra_valor:Int,
          $compra_etiqueta:String,
          $venta_valor:Int,
          $venta_etiqueta:String,
          $nombre_comun_grupo_enfoque:String,
          $addGrupo_enfoque: ID,
          $removeGrupo_enfoque: ID,
          $addInformacion_taxonomica: ID,
          $removeInformacion_taxonomica: ID,
          $addTipo_planta: ID,
          $removeTipo_planta: ID,
          ) { updateCuadrante(
            cuadrante_id: $cuadrante_id
            produccion_valor: $produccion_valor,
            produccion_etiqueta: $produccion_etiqueta,
            autoconsumo_valor: $autoconsumo_valor,
            autoconsumo_etiqueta: $autoconsumo_etiqueta,
            compra_valor: $compra_valor,
            compra_etiqueta: $compra_etiqueta,
            venta_valor: $venta_valor,
            venta_etiqueta: $venta_etiqueta,
            nombre_comun_grupo_enfoque: $nombre_comun_grupo_enfoque,
            addGrupo_enfoque: $addGrupo_enfoque,
            removeGrupo_enfoque: $removeGrupo_enfoque,
            addInformacion_taxonomica: $addInformacion_taxonomica,
            removeInformacion_taxonomica: $removeInformacion_taxonomica,
            addTipo_planta: $addTipo_planta,
            removeTipo_planta: $removeTipo_planta,
          ) {
            cuadrante_id,
            produccion_valor,
            produccion_etiqueta,
            autoconsumo_valor,
            autoconsumo_etiqueta,
            compra_valor,
            compra_etiqueta,
            venta_valor,
            venta_etiqueta,
            nombre_comun_grupo_enfoque,
            grupo_enfoque_id,
            taxon_id,
            tipo_planta_id,
            grupo_enfoque{ grupo_id },
            informacion_taxonomica{ id },
            tipo_planta{ tipo_planta_id },
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
   * @param {Object} variables Object with values needed to delete the Cuadrante item. 
   */
  deleteItem(url, variables) {
    var query = 
      `mutation
        deleteCuadrante(
          $cuadrante_id:ID! 
        ) {
          deleteCuadrante(
            cuadrante_id:$cuadrante_id
        ) }`

    /**
     * Debug
     */
    console.log("deleteItem.query: gql:\n", query);
    console.log("deleteItem.variables: gql:\n", variables);

    return requestGraphql({ url, query, variables });
  },

  /**
   * getGrupo_enfoqueConnection
   * 
   * Get grupo_enfoques connection (cursor based) records associated to the given cuadrante record
   * through association 'Grupo_enfoque', from GraphQL Server.
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
  getGrupo_enfoqueConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    var query = 
      `{ readOneCuadrante(cuadrante_id: "${itemId}") { 
        grupo_enfoque{ 
          grupo_id,
          tipo_grupo,
          numero_participantes,
          fecha,
          lista_especies,
          sitio_id,
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
   * getAssociatedGrupo_enfoqueConnection
   * 
   * Get the grupo_enfoque-ids associated (by cursor based connection) to the given cuadrante record 
   * through association 'Grupo_enfoque', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedGrupo_enfoqueConnection(url, itemId) {
    var query = 
    `{ readOneCuadrante( cuadrante_id: "${itemId}" ){ 
      grupo_enfoque{ grupo_id } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },
  /**
   * getInformacion_taxonomicaConnection
   * 
   * Get taxons connection (cursor based) records associated to the given cuadrante record
   * through association 'Informacion_taxonomica', from GraphQL Server.
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
  getInformacion_taxonomicaConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    var query = 
      `{ readOneCuadrante(cuadrante_id: "${itemId}") { 
        informacion_taxonomica{ 
          id,
          taxon,
          categoria,
          estatus,
          nombreAutoridad,
          citaNomenclatural,
          fuente,
          ambiente,
          grupoSNIB,
          categoriaResidencia,
          nom,
          cites,
          iucn,
          prioritarias,
          endemismo,
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
   * getAssociatedInformacion_taxonomicaConnection
   * 
   * Get the taxon-ids associated (by cursor based connection) to the given cuadrante record 
   * through association 'Informacion_taxonomica', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedInformacion_taxonomicaConnection(url, itemId) {
    var query = 
    `{ readOneCuadrante( cuadrante_id: "${itemId}" ){ 
      informacion_taxonomica{ id } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },
  /**
   * getTipo_plantaConnection
   * 
   * Get tipo_planta connection (cursor based) records associated to the given cuadrante record
   * through association 'Tipo_planta', from GraphQL Server.
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
  getTipo_plantaConnection(url, itemId, label, sublabel, searchText, variables, ops) {
    var query = 
      `{ readOneCuadrante(cuadrante_id: "${itemId}") { 
        tipo_planta{ 
          tipo_planta_id,
          tipo_planta,
          foto_produccion,
          foto_autoconsumo,
          foto_venta,
          foto_compra,
          justificacion_produccion_cuadrante1,
          justificacion_produccion_cuadrante2,
          justificacion_produccion_cuadrante3,
          justificacion_produccion_cuadrante4,
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
   * getAssociatedTipo_plantaConnection
   * 
   * Get the tipo_planta-ids associated (by cursor based connection) to the given cuadrante record 
   * through association 'Tipo_planta', from GraphQL Server.
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   */
  getAssociatedTipo_plantaConnection(url, itemId) {
    var query = 
    `{ readOneCuadrante( cuadrante_id: "${itemId}" ){ 
      tipo_planta{ tipo_planta_id } } }`;
    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    return requestGraphql({ url, query });
  },

/**
   * getItemsAttribute
   * 
   * Get all items from GraphQL Server using a cursor-based-connection. Get only the indicated 
   * attribute. No search, order or pagination are specified in this function, so 
   * all items will be retrieved without a particular order or search filter.
   * 
   * @param {String} url GraphQL Server url
   * @param {String} attribute Name of the attribute to be retrieved.
   */
  getItemsAttribute(url, attribute) {
    let query =
      `query
          { cuadrantesConnection {
            edges {
              node {
                ${attribute}
              }
            }
          }}`;
    /**
     * Debug
     */
    console.log("getItemsAttribute.query: gql:\n", query);
    
    return requestGraphql({ url, query });

  },
}//end: export default

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

              //in
              onlyOrs += `{field:${vkeys[k]}, value:{type: "Array", value:"${va.join()}"}, operator:in},`

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

              //notIn
              ands += `{field:${vkeys[k]}, value:{type: "Array", value:"${va.join()}"}, operator:notIn},`

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

              //in
              onlyOrs += `{field:${vkeys[k]}, value:{type: "Array", value:"${va.join()}"}, operator:in},`

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

              //notIn
              ands += `{field:${vkeys[k]}, value:{type: "Array", value:"${va.join()}"}, operator:notIn},`

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