module.exports = `
  type taxon{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    taxonomic_level: String

    """
    @original-field
    
    """
    taxon_id: Int

    parent(search: searchTaxonInput): taxon
    
    """
    @search-request
    """
    microbiome_asvsFilter(search: searchMicrobiome_asvInput, order: [ orderMicrobiome_asvInput ], pagination: paginationInput!): [microbiome_asv]


    """
    @search-request
    """
    microbiome_asvsConnection(search: searchMicrobiome_asvInput, order: [ orderMicrobiome_asvInput ], pagination: paginationCursorInput!): Microbiome_asvConnection

    """
    @count-request
    """
    countFilteredMicrobiome_asvs(search: searchMicrobiome_asvInput) : Int
  
    """
    @search-request
    """
    cultivarsFilter(search: searchCultivarInput, order: [ orderCultivarInput ], pagination: paginationInput!): [cultivar]


    """
    @search-request
    """
    cultivarsConnection(search: searchCultivarInput, order: [ orderCultivarInput ], pagination: paginationCursorInput!): CultivarConnection

    """
    @count-request
    """
    countFilteredCultivars(search: searchCultivarInput) : Int
  
    }
type TaxonConnection{
  edges: [TaxonEdge]
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
    name
    taxonomic_level
    taxon_id
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

  input bulkAssociationTaxonWithTaxon_idInput{
    id: ID!
    taxon_id: ID!
  }

  type Query {
    taxons(search: searchTaxonInput, order: [ orderTaxonInput ], pagination: paginationInput! ): [taxon]
    readOneTaxon(id: ID!): taxon
    countTaxons(search: searchTaxonInput ): Int
    vueTableTaxon : VueTableTaxon    csvTableTemplateTaxon: [String]
    taxonsConnection(search:searchTaxonInput, order: [ orderTaxonInput ], pagination: paginationCursorInput! ): TaxonConnection
  }

  type Mutation {
    addTaxon( name: String, taxonomic_level: String, taxon_id: Int , addParent:ID  , addMicrobiome_asvs:[ID], addCultivars:[ID] , skipAssociationsExistenceChecks:Boolean = false): taxon!
    updateTaxon(id: ID!, name: String, taxonomic_level: String, taxon_id: Int , addParent:ID, removeParent:ID   , addMicrobiome_asvs:[ID], removeMicrobiome_asvs:[ID] , addCultivars:[ID], removeCultivars:[ID]  , skipAssociationsExistenceChecks:Boolean = false): taxon!
    deleteTaxon(id: ID!): String!
    bulkAddTaxonCsv: String!
    bulkAssociateTaxonWithTaxon_id(bulkAssociationInput: [bulkAssociationTaxonWithTaxon_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateTaxonWithTaxon_id(bulkAssociationInput: [bulkAssociationTaxonWithTaxon_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;