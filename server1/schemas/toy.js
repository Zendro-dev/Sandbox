module.exports = `
  type toy{
    """
    @original-field
    """
    toy_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    cat_id: String

    cat(search: searchCatInput): cat
    
    }
type ToyConnection{
  edges: [ToyEdge]
  pageInfo: pageInfo!
}

type ToyEdge{
  cursor: String!
  node: toy!
}

  type VueTableToy{
    data : [toy]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum toyField {
    toy_id
    name
    cat_id
  }
  input searchToyInput {
    field: toyField
    value: typeValue
    operator: Operator
    search: [searchToyInput]
  }

  input orderToyInput{
    field: toyField
    order: Order
  }

  input bulkAssociationToyWithCat_idInput{
    toy_id: ID!
    cat_id: ID!
  }

  type Query {
    toys(search: searchToyInput, order: [ orderToyInput ], pagination: paginationInput! ): [toy]
    readOneToy(toy_id: ID!): toy
    countToys(search: searchToyInput ): Int
    vueTableToy : VueTableToy    csvTableTemplateToy: [String]
    toysConnection(search:searchToyInput, order: [ orderToyInput ], pagination: paginationCursorInput! ): ToyConnection
  }

  type Mutation {
    addToy(toy_id: ID!, name: String , addCat:ID   , skipAssociationsExistenceChecks:Boolean = false): toy!
    updateToy(toy_id: ID!, name: String , addCat:ID, removeCat:ID    , skipAssociationsExistenceChecks:Boolean = false): toy!
    deleteToy(toy_id: ID!): String!
    bulkAddToyCsv: String!
    bulkAssociateToyWithCat_id(bulkAssociationInput: [bulkAssociationToyWithCat_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateToyWithCat_id(bulkAssociationInput: [bulkAssociationToyWithCat_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;