module.exports = `
  type house{
    """
    @original-field
    """
    house_id: ID
    """
    @original-field
    
    """
    address: String

    """
    @original-field
    
    """
    rooms: Int

      
    """
    @search-request
    """
    catsFilter(search: searchCatInput, order: [ orderCatInput ], pagination: paginationInput!): [cat]


    """
    @search-request
    """
    catsConnection(search: searchCatInput, order: [ orderCatInput ], pagination: paginationCursorInput!): CatConnection

    """
    @count-request
    """
    countFilteredCats(search: searchCatInput) : Int
  
    }
type HouseConnection{
  edges: [HouseEdge]
  pageInfo: pageCassandraInfo!
}

type HouseEdge{
  cursor: String!
  node: house!
}

  type VueTableHouse{
    data : [house]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum houseField {
    house_id
    address
    rooms
  }
  input searchHouseInput {
    field: houseField
    value: typeValue
    operator: CassandraOperator
    search: [searchHouseInput]
  }

  input orderHouseInput{
    field: houseField
    order: Order
  }
  type Query {
    readOneHouse(house_id: ID!): house
    countHouses(search: searchHouseInput ): Int
    vueTableHouse : VueTableHouse    csvTableTemplateHouse: [String]

    housesConnection(search:searchHouseInput, pagination: paginationCursorCassandraInput! ): HouseConnection
  }
    type Mutation {
    addHouse(house_id: ID!, address: String, rooms: Int   , addCats:[ID] , skipAssociationsExistenceChecks:Boolean = true): house!
    updateHouse(house_id: ID!, address: String, rooms: Int   , addCats:[ID], removeCats:[ID]  , skipAssociationsExistenceChecks:Boolean = true): house!
  deleteHouse(house_id: ID!): String!
  # bulkAddHouseCsv: String!
  }

`;