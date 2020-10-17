module.exports = `
  type cultivar{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    genotype: String

    """
    @original-field
    
    """
    taxon_id: Int

    taxon(search: searchTaxonInput): taxon
    
    """
    @search-request
    """
    individualsFilter(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationInput!): [individual]


    """
    @search-request
    """
    individualsConnection(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationCursorInput!): IndividualConnection

    """
    @count-request
    """
    countFilteredIndividuals(search: searchIndividualInput) : Int
  
    }
type CultivarConnection{
  edges: [CultivarEdge]
  pageInfo: pageInfo!
}

type CultivarEdge{
  cursor: String!
  node: cultivar!
}

  type VueTableCultivar{
    data : [cultivar]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum cultivarField {
    id
    description
    genotype
    taxon_id
  }
  input searchCultivarInput {
    field: cultivarField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchCultivarInput]
  }

  input orderCultivarInput{
    field: cultivarField
    order: Order
  }

  input bulkAssociationCultivarWithTaxon_idInput{
    id: ID!
    taxon_id: ID!
  }

  type Query {
    cultivars(search: searchCultivarInput, order: [ orderCultivarInput ], pagination: paginationInput! ): [cultivar]
    readOneCultivar(id: ID!): cultivar
    countCultivars(search: searchCultivarInput ): Int
    vueTableCultivar : VueTableCultivar    csvTableTemplateCultivar: [String]
    cultivarsConnection(search:searchCultivarInput, order: [ orderCultivarInput ], pagination: paginationCursorInput! ): CultivarConnection
  }

  type Mutation {
    addCultivar( description: String, genotype: String , addTaxon:ID  , addIndividuals:[ID] , skipAssociationsExistenceChecks:Boolean = false): cultivar!
    updateCultivar(id: ID!, description: String, genotype: String , addTaxon:ID, removeTaxon:ID   , addIndividuals:[ID], removeIndividuals:[ID]  , skipAssociationsExistenceChecks:Boolean = false): cultivar!
    deleteCultivar(id: ID!): String!
    bulkAddCultivarCsv: String!
    bulkAssociateCultivarWithTaxon_id(bulkAssociationInput: [bulkAssociationCultivarWithTaxon_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCultivarWithTaxon_id(bulkAssociationInput: [bulkAssociationCultivarWithTaxon_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;