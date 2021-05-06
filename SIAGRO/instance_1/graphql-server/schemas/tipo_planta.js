module.exports = `
  type tipo_planta{
    """
    @original-field
    """
    tipo_planta_id: ID
    """
    @original-field
    
    """
    tipo_planta: String

    """
    @original-field
    
    """
    foto_produccion: String

    """
    @original-field
    
    """
    foto_autoconsumo: String

    """
    @original-field
    
    """
    foto_venta: String

    """
    @original-field
    
    """
    foto_compra: String

    """
    @original-field
    
    """
    justificacion_produccion_cuadrante1: String

    """
    @original-field
    
    """
    justificacion_produccion_cuadrante2: String

    """
    @original-field
    
    """
    justificacion_produccion_cuadrante3: String

    """
    @original-field
    
    """
    justificacion_produccion_cuadrante4: String

      
    """
    @search-request
    """
    cuadrantesFilter(search: searchCuadranteInput, order: [ orderCuadranteInput ], pagination: paginationInput): [cuadrante]


    """
    @search-request
    """
    cuadrantesConnection(search: searchCuadranteInput, order: [ orderCuadranteInput ], pagination: paginationCursorInput): CuadranteConnection

    """
    @count-request
    """
    countFilteredCuadrantes(search: searchCuadranteInput) : Int
  
    }
type Tipo_plantaConnection{
  edges: [Tipo_plantaEdge]
  pageInfo: pageInfo!
}

type Tipo_plantaEdge{
  cursor: String!
  node: tipo_planta!
}

  type VueTableTipo_planta{
    data : [tipo_planta]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum tipo_plantaField {
    tipo_planta_id
    tipo_planta
    foto_produccion
    foto_autoconsumo
    foto_venta
    foto_compra
    justificacion_produccion_cuadrante1
    justificacion_produccion_cuadrante2
    justificacion_produccion_cuadrante3
    justificacion_produccion_cuadrante4
  }
  input searchTipo_plantaInput {
    field: tipo_plantaField
    value: typeValue
    operator: Operator
    search: [searchTipo_plantaInput]
  }

  input orderTipo_plantaInput{
    field: tipo_plantaField
    order: Order
  }



  type Query {
    tipo_planta(search: searchTipo_plantaInput, order: [ orderTipo_plantaInput ], pagination: paginationInput ): [tipo_planta]
    readOneTipo_planta(tipo_planta_id: ID!): tipo_planta
    countTipo_planta(search: searchTipo_plantaInput ): Int
    vueTableTipo_planta : VueTableTipo_planta    csvTableTemplateTipo_planta: [String]
    tipo_plantaConnection(search:searchTipo_plantaInput, order: [ orderTipo_plantaInput ], pagination: paginationCursorInput ): Tipo_plantaConnection
  }

  type Mutation {
    addTipo_planta(tipo_planta_id: ID!, tipo_planta: String, foto_produccion: String, foto_autoconsumo: String, foto_venta: String, foto_compra: String, justificacion_produccion_cuadrante1: String, justificacion_produccion_cuadrante2: String, justificacion_produccion_cuadrante3: String, justificacion_produccion_cuadrante4: String   , addCuadrantes:[ID] , skipAssociationsExistenceChecks:Boolean = false): tipo_planta!
    updateTipo_planta(tipo_planta_id: ID!, tipo_planta: String, foto_produccion: String, foto_autoconsumo: String, foto_venta: String, foto_compra: String, justificacion_produccion_cuadrante1: String, justificacion_produccion_cuadrante2: String, justificacion_produccion_cuadrante3: String, justificacion_produccion_cuadrante4: String   , addCuadrantes:[ID], removeCuadrantes:[ID]  , skipAssociationsExistenceChecks:Boolean = false): tipo_planta!
    deleteTipo_planta(tipo_planta_id: ID!): String!
    bulkAddTipo_plantaCsv: String!
      }
`;