module.exports = `
  type cat{
    """
    @original-field
    """
    cat_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    person_id: String

    """
    @original-field
    
    """
    house_id: String

    person(search: searchPersonInput): person
  house(search: searchHouseInput): house
    
    """
    @search-request
    """
    toysFilter(search: searchToyInput, order: [ orderToyInput ], pagination: paginationInput!): [toy]


    """
    @search-request
    """
    toysConnection(search: searchToyInput, order: [ orderToyInput ], pagination: paginationCursorInput!): ToyConnection

    """
    @count-request
    """
    countFilteredToys(search: searchToyInput) : Int
  
    }
type CatConnection{
  edges: [CatEdge]
  pageInfo: pageCassandraInfo!
}

type CatEdge{
  cursor: String!
  node: cat!
}

  type VueTableCat{
    data : [cat]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum catField {
    cat_id
    name
    person_id
    house_id
  }
  input searchCatInput {
    field: catField
    value: typeValue
    operator: CassandraOperator
    search: [searchCatInput]
  }

  input orderCatInput{
    field: catField
    order: Order
  }
  type Query {
    readOneCat(cat_id: ID!): cat
    countCats(search: searchCatInput ): Int
    vueTableCat : VueTableCat    csvTableTemplateCat: [String]

    catsConnection(search:searchCatInput, pagination: paginationCursorCassandraInput! ): CatConnection
  }
    type Mutation {
    addCat(cat_id: ID!, name: String , addPerson:ID, addHouse:ID  , addToys:[ID] , skipAssociationsExistenceChecks:Boolean = true): cat!
    updateCat(cat_id: ID!, name: String , addPerson:ID, removePerson:ID , addHouse:ID, removeHouse:ID   , addToys:[ID], removeToys:[ID]  , skipAssociationsExistenceChecks:Boolean = true): cat!
  deleteCat(cat_id: ID!): String!
  # bulkAddCatCsv: String!
  }

`;