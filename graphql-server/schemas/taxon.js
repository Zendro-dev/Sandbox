module.exports = `
  type taxon{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    Genero: String

    """
    @original-field
    
    """
    EpitetoEspecifico: String

    """
    @original-field
    
    """
    EpitetoSubespecie: String

    """
    @original-field
    
    """
    EpitetoVariedad: String

    """
    @original-field
    
    """
    EpitetoForma: String

    """
    @original-field
    
    """
    EpitetoRaza: String

    """
    @original-field
    
    """
    EpitetoCultivar: String

      
    """
    @search-request
    """
    registro_siagroFilter(search: searchRegistro_siagroInput, order: [ orderRegistro_siagroInput ], pagination: paginationInput!): [registro_siagro]


    """
    @search-request
    """
    registro_siagroConnection(search: searchRegistro_siagroInput, order: [ orderRegistro_siagroInput ], pagination: paginationCursorInput!): Registro_siagroConnection

    """
    @count-request
    """
    countFilteredRegistro_siagro(search: searchRegistro_siagroInput) : Int
  
    }
type TaxonConnection{
  edges: [TaxonEdge]
  taxons: [taxon]
  pageInfo: pageInfo!
}

type TaxonEdge{
  cursor: String!
  node: taxon!
}

  type VueTableTaxon{
    data : [taxon]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum taxonField {
    id
    Genero
    EpitetoEspecifico
    EpitetoSubespecie
    EpitetoVariedad
    EpitetoForma
    EpitetoRaza
    EpitetoCultivar
  }
  input searchTaxonInput {
    field: taxonField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchTaxonInput]
  }

  input orderTaxonInput{
    field: taxonField
    order: Order
  }



  type Query {
    taxons(search: searchTaxonInput, order: [ orderTaxonInput ], pagination: paginationInput! ): [taxon]
    readOneTaxon(id: ID!): taxon
    countTaxons(search: searchTaxonInput ): Int
    vueTableTaxon : VueTableTaxon
    csvTableTemplateTaxon: [String]
    taxonsConnection(search:searchTaxonInput, order: [ orderTaxonInput ], pagination: paginationCursorInput! ): TaxonConnection
  }

  type Mutation {
    addTaxon(id: ID!, Genero: String, EpitetoEspecifico: String, EpitetoSubespecie: String, EpitetoVariedad: String, EpitetoForma: String, EpitetoRaza: String, EpitetoCultivar: String   , addRegistro_siagro:[ID] , skipAssociationsExistenceChecks:Boolean = false): taxon!
    updateTaxon(id: ID!, Genero: String, EpitetoEspecifico: String, EpitetoSubespecie: String, EpitetoVariedad: String, EpitetoForma: String, EpitetoRaza: String, EpitetoCultivar: String   , addRegistro_siagro:[ID], removeRegistro_siagro:[ID]  , skipAssociationsExistenceChecks:Boolean = false): taxon!
    deleteTaxon(id: ID!): String!
    bulkAddTaxonCsv: String!
      }
`;