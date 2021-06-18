module.exports = `
  type sitio{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    paismapa: String

    """
    @original-field
    
    """
    estadomapa: String

    """
    @original-field
    
    """
    claveestadomapa: String

    """
    @original-field
    
    """
    clavemunicipiomapa: String

    """
    @original-field
    
    """
    municipiomapa: String

    """
    @original-field
    
    """
    localidad: String

    """
    @original-field
    
    """
    latitud: Float

    """
    @original-field
    
    """
    longitud: Float

    """
    @original-field
    
    """
    datum: String

    registro_siagro(search: searchRegistro_siagroInput): registro_siagro
    
    }
type SitioConnection{
  edges: [SitioEdge]
  sitios: [sitio]
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
    id
    paismapa
    estadomapa
    claveestadomapa
    clavemunicipiomapa
    municipiomapa
    localidad
    latitud
    longitud
    datum
  }
  input searchSitioInput {
    field: sitioField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchSitioInput]
  }

  input orderSitioInput{
    field: sitioField
    order: Order
  }



  type Query {
    sitios(search: searchSitioInput, order: [ orderSitioInput ], pagination: paginationInput! ): [sitio]
    readOneSitio(id: ID!): sitio
    countSitios(search: searchSitioInput ): Int
    vueTableSitio : VueTableSitio
    csvTableTemplateSitio: [String]
    sitiosConnection(search:searchSitioInput, order: [ orderSitioInput ], pagination: paginationCursorInput! ): SitioConnection
  }

  type Mutation {
    addSitio(id: ID!, paismapa: String, estadomapa: String, claveestadomapa: String, clavemunicipiomapa: String, municipiomapa: String, localidad: String, latitud: Float, longitud: Float, datum: String , addRegistro_siagro:ID   , skipAssociationsExistenceChecks:Boolean = false): sitio!
    updateSitio(id: ID!, paismapa: String, estadomapa: String, claveestadomapa: String, clavemunicipiomapa: String, municipiomapa: String, localidad: String, latitud: Float, longitud: Float, datum: String , addRegistro_siagro:ID, removeRegistro_siagro:ID    , skipAssociationsExistenceChecks:Boolean = false): sitio!
    deleteSitio(id: ID!): String!
    bulkAddSitioCsv: String!
      }
`;