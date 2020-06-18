module.exports = `
  type genotype{
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
    description: String

    """
    @original-field
    
    """
    pedigree_type: String

    """
    @original-field
    
    """
    mother_id: Int

    """
    @original-field
    
    """
    father_id: Int

    """
    @original-field
    
    """
    breeding_pool_id: Int

    mother(search: searchIndividualInput): individual
  father(search: searchIndividualInput): individual
  individual(search: searchIndividualInput): individual
  breeding_pool(search: searchBreeding_poolInput): breeding_pool
    
    """
    @search-request
    """
    field_plotFilter(search: searchField_plotInput, order: [ orderField_plotInput ], pagination: paginationInput): [field_plot]


    """
    @search-request
    """
    field_plotConnection(search: searchField_plotInput, order: [ orderField_plotInput ], pagination: paginationCursorInput): Field_plotConnection

    """
    @count-request
    """
    countFilteredField_plot(search: searchField_plotInput) : Int
  
    }
type GenotypeConnection{
  edges: [GenotypeEdge]
  pageInfo: pageInfo!
}

type GenotypeEdge{
  cursor: String!
  node: genotype!
}

  type VueTableGenotype{
    data : [genotype]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum genotypeField {
    id
    name
    description
    pedigree_type
    mother_id
    father_id
    breeding_pool_id
  }
  input searchGenotypeInput {
    field: genotypeField
    value: typeValue
    operator: Operator
    search: [searchGenotypeInput]
  }

  input orderGenotypeInput{
    field: genotypeField
    order: Order
  }
  type Query {
    genotypes(search: searchGenotypeInput, order: [ orderGenotypeInput ], pagination: paginationInput ): [genotype]
    readOneGenotype(id: ID!): genotype
    countGenotypes(search: searchGenotypeInput ): Int
    vueTableGenotype : VueTableGenotype    csvTableTemplateGenotype: [String]

    genotypesConnection(search:searchGenotypeInput, order: [ orderGenotypeInput ], pagination: paginationCursorInput ): GenotypeConnection
  }
    type Mutation {
    addGenotype( name: String, description: String, pedigree_type: String , addMother:ID, addFather:ID, addIndividual:ID, addBreeding_pool:ID  , addField_plot:[ID] , skipAssociationsExistenceChecks:Boolean = false): genotype!
    updateGenotype(id: ID!, name: String, description: String, pedigree_type: String , addMother:ID, removeMother:ID , addFather:ID, removeFather:ID , addIndividual:ID, removeIndividual:ID , addBreeding_pool:ID, removeBreeding_pool:ID   , addField_plot:[ID], removeField_plot:[ID]  , skipAssociationsExistenceChecks:Boolean = false): genotype!
  deleteGenotype(id: ID!): String!
  bulkAddGenotypeCsv: String! }

`;