module.exports = `
  type breeding_pool{
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
    @search-request
    """
    genotypesFilter(search: searchGenotypeInput, order: [ orderGenotypeInput ], pagination: paginationInput): [genotype]


    """
    @search-request
    """
    genotypesConnection(search: searchGenotypeInput, order: [ orderGenotypeInput ], pagination: paginationCursorInput): GenotypeConnection

    """
    @count-request
    """
    countFilteredGenotypes(search: searchGenotypeInput) : Int
  
    }
type Breeding_poolConnection{
  edges: [Breeding_poolEdge]
  pageInfo: pageInfo!
}

type Breeding_poolEdge{
  cursor: String!
  node: breeding_pool!
}

  type VueTableBreeding_pool{
    data : [breeding_pool]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum breeding_poolField {
    id
    name
    description
  }
  input searchBreeding_poolInput {
    field: breeding_poolField
    value: typeValue
    operator: Operator
    search: [searchBreeding_poolInput]
  }

  input orderBreeding_poolInput{
    field: breeding_poolField
    order: Order
  }
  type Query {
    breeding_pools(search: searchBreeding_poolInput, order: [ orderBreeding_poolInput ], pagination: paginationInput ): [breeding_pool]
    readOneBreeding_pool(id: ID!): breeding_pool
    countBreeding_pools(search: searchBreeding_poolInput ): Int
    vueTableBreeding_pool : VueTableBreeding_pool    csvTableTemplateBreeding_pool: [String]

    breeding_poolsConnection(search:searchBreeding_poolInput, order: [ orderBreeding_poolInput ], pagination: paginationCursorInput ): Breeding_poolConnection
  }
    type Mutation {
    addBreeding_pool( name: String, description: String   , addGenotypes:[ID] , skipAssociationsExistenceChecks:Boolean = false): breeding_pool!
    updateBreeding_pool(id: ID!, name: String, description: String   , addGenotypes:[ID], removeGenotypes:[ID]  , skipAssociationsExistenceChecks:Boolean = false): breeding_pool!
  deleteBreeding_pool(id: ID!): String!
  bulkAddBreeding_poolCsv: String! }

`;