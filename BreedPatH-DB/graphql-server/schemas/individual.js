module.exports = `
  type individual{
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
    genotype_id: Int

    """
    @original-field
    
    """
    individual_id: Int

    genotype(search: searchGenotypeInput): genotype
  mother_to(search: searchGenotypeInput): genotype
  father_to(search: searchGenotypeInput): genotype
    
    """
    @search-request
    """
    marker_data_snpsFilter(search: searchMarker_dataInput, order: [ orderMarker_dataInput ], pagination: paginationInput): [marker_data]


    """
    @search-request
    """
    marker_data_snpsConnection(search: searchMarker_dataInput, order: [ orderMarker_dataInput ], pagination: paginationCursorInput): Marker_dataConnection

    """
    @count-request
    """
    countFilteredMarker_data_snps(search: searchMarker_dataInput) : Int
  
    """
    @search-request
    """
    samplesFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput): [sample]


    """
    @search-request
    """
    samplesConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput): SampleConnection

    """
    @count-request
    """
    countFilteredSamples(search: searchSampleInput) : Int
  
    }
type IndividualConnection{
  edges: [IndividualEdge]
  pageInfo: pageInfo!
}

type IndividualEdge{
  cursor: String!
  node: individual!
}

  type VueTableIndividual{
    data : [individual]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum individualField {
    id
    name
    description
    genotype_id
    individual_id
  }
  input searchIndividualInput {
    field: individualField
    value: typeValue
    operator: Operator
    search: [searchIndividualInput]
  }

  input orderIndividualInput{
    field: individualField
    order: Order
  }
  type Query {
    individuals(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationInput ): [individual]
    readOneIndividual(id: ID!): individual
    countIndividuals(search: searchIndividualInput ): Int
    vueTableIndividual : VueTableIndividual    csvTableTemplateIndividual: [String]

    individualsConnection(search:searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationCursorInput ): IndividualConnection
  }
    type Mutation {
    addIndividual( name: String, description: String, individual_id: Int , addGenotype:ID, addMother_to:ID, addFather_to:ID  , addMarker_data_snps:[ID], addSamples:[ID] , skipAssociationsExistenceChecks:Boolean = false): individual!
    updateIndividual(id: ID!, name: String, description: String, individual_id: Int , addGenotype:ID, removeGenotype:ID , addMother_to:ID, removeMother_to:ID , addFather_to:ID, removeFather_to:ID   , addMarker_data_snps:[ID], removeMarker_data_snps:[ID] , addSamples:[ID], removeSamples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): individual!
  deleteIndividual(id: ID!): String!
  bulkAddIndividualCsv: String! }

`;