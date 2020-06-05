module.exports = `
  type sitio{
    """
    @original-field
    """
    sitio_id: ID
    """
    @original-field
    
    """
    pais: String

    """
    @original-field
    
    """
    estado: String

    """
    @original-field
    
    """
    municipio: String

    """
    @original-field
    
    """
    localidad: String

      
    """
    @search-request
    """
    grupo_enfoqueFilter(search: searchGrupo_enfoqueInput, order: [ orderGrupo_enfoqueInput ], pagination: paginationInput): [grupo_enfoque]


    """
    @search-request
    """
    grupo_enfoqueConnection(search: searchGrupo_enfoqueInput, order: [ orderGrupo_enfoqueInput ], pagination: paginationCursorInput): Grupo_enfoqueConnection

    """
    @count-request
    """
    countFilteredGrupo_enfoque(search: searchGrupo_enfoqueInput) : Int
  
    }
type SitioConnection{
  edges: [SitioEdge]
  pageInfo: pageInfo!
}

type SitioEdge{
  cursor: String!
  node: sitio!
}

  type VueTableSitio{
    data : [sitio]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum sitioField {
    sitio_id
    pais
    estado
    municipio
    localidad
  }
  input searchSitioInput {
    field: sitioField
    value: typeValue
    operator: Operator
    search: [searchSitioInput]
  }

  input orderSitioInput{
    field: sitioField
    order: Order
  }
  type Query {
    sitios(search: searchSitioInput, order: [ orderSitioInput ], pagination: paginationInput ): [sitio]
    readOneSitio(sitio_id: ID!): sitio
    countSitios(search: searchSitioInput ): Int
    vueTableSitio : VueTableSitio    csvTableTemplateSitio: [String]

    sitiosConnection(search:searchSitioInput, order: [ orderSitioInput ], pagination: paginationCursorInput ): SitioConnection
  }
    type Mutation {
    addSitio(sitio_id: ID!, pais: String, estado: String, municipio: String, localidad: String   , addGrupo_enfoque:[ID] , skipAssociationsExistenceChecks:Boolean = false): sitio!
    updateSitio(sitio_id: ID!, pais: String, estado: String, municipio: String, localidad: String   , addGrupo_enfoque:[ID], removeGrupo_enfoque:[ID]  , skipAssociationsExistenceChecks:Boolean = false): sitio!
  deleteSitio(sitio_id: ID!): String!
  bulkAddSitioCsv: [sitio] }

`;