module.exports = `
  type microbiome_asv{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    asv_id: String

    """
    @original-field
    
    """
    compartment: String

    """
    @original-field
    
    """
    count: Int

    """
    @original-field
    
    """
    version: Int

    """
    @original-field
    
    """
    primer_kingdom: String

    """
    @original-field
    
    """
    reference_gene: String

    """
    @original-field
    
    """
    reference_sequence: String

    """
    @original-field
    
    """
    sample_id: Int

    """
    @original-field
    
    """
    taxon_id: Int

    sample(search: searchSampleInput): sample
  taxon(search: searchTaxonInput): taxon
    
    }
type Microbiome_asvConnection{
  edges: [Microbiome_asvEdge]
  pageInfo: pageInfo!
}

type Microbiome_asvEdge{
  cursor: String!
  node: microbiome_asv!
}

  type VueTableMicrobiome_asv{
    data : [microbiome_asv]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum microbiome_asvField {
    id
    asv_id
    compartment
    count
    version
    primer_kingdom
    reference_gene
    reference_sequence
    sample_id
    taxon_id
  }
  input searchMicrobiome_asvInput {
    field: microbiome_asvField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchMicrobiome_asvInput]
  }

  input orderMicrobiome_asvInput{
    field: microbiome_asvField
    order: Order
  }

  input bulkAssociationMicrobiome_asvWithSample_idInput{
    id: ID!
    sample_id: ID!
  }  input bulkAssociationMicrobiome_asvWithTaxon_idInput{
    id: ID!
    taxon_id: ID!
  }

  type Query {
    microbiome_asvs(search: searchMicrobiome_asvInput, order: [ orderMicrobiome_asvInput ], pagination: paginationInput! ): [microbiome_asv]
    readOneMicrobiome_asv(id: ID!): microbiome_asv
    countMicrobiome_asvs(search: searchMicrobiome_asvInput ): Int
    vueTableMicrobiome_asv : VueTableMicrobiome_asv    csvTableTemplateMicrobiome_asv: [String]
    microbiome_asvsConnection(search:searchMicrobiome_asvInput, order: [ orderMicrobiome_asvInput ], pagination: paginationCursorInput! ): Microbiome_asvConnection
  }

  type Mutation {
    addMicrobiome_asv( asv_id: String, compartment: String, count: Int, version: Int, primer_kingdom: String, reference_gene: String, reference_sequence: String , addSample:ID, addTaxon:ID   , skipAssociationsExistenceChecks:Boolean = false): microbiome_asv!
    updateMicrobiome_asv(id: ID!, asv_id: String, compartment: String, count: Int, version: Int, primer_kingdom: String, reference_gene: String, reference_sequence: String , addSample:ID, removeSample:ID , addTaxon:ID, removeTaxon:ID    , skipAssociationsExistenceChecks:Boolean = false): microbiome_asv!
    deleteMicrobiome_asv(id: ID!): String!
    bulkAddMicrobiome_asvCsv: String!
    bulkAssociateMicrobiome_asvWithSample_id(bulkAssociationInput: [bulkAssociationMicrobiome_asvWithSample_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateMicrobiome_asvWithSample_id(bulkAssociationInput: [bulkAssociationMicrobiome_asvWithSample_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateMicrobiome_asvWithTaxon_id(bulkAssociationInput: [bulkAssociationMicrobiome_asvWithTaxon_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateMicrobiome_asvWithTaxon_id(bulkAssociationInput: [bulkAssociationMicrobiome_asvWithTaxon_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;