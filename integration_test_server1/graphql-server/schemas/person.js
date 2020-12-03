module.exports = `
  type person{
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
    age: Int

    """
    @original-field
    
    """
    email: String

    """
    @original-field
    
    """
    parents_id: [String]

    """
    @original-field
    
    """
    children_id: [String]

    """
    @original-field
    
    """
    friends_id: [String]

      
    """
    @search-request
    """
    friendsFilter(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput!): [person]


    """
    @search-request
    """
    friendsConnection(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput!): PersonConnection

    """
    @count-request
    """
    countFilteredFriends(search: searchPersonInput) : Int
  
    """
    @search-request
    """
    parentsFilter(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput!): [person]


    """
    @search-request
    """
    parentsConnection(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput!): PersonConnection

    """
    @count-request
    """
    countFilteredParents(search: searchPersonInput) : Int
  
    """
    @search-request
    """
    childrenFilter(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput!): [person]


    """
    @search-request
    """
    childrenConnection(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput!): PersonConnection

    """
    @count-request
    """
    countFilteredChildren(search: searchPersonInput) : Int
  
    }
type PersonConnection{
  edges: [PersonEdge]
  people: [person]
  pageInfo: pageInfo!
}

type PersonEdge{
  cursor: String!
  node: person!
}

  type VueTablePerson{
    data : [person]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum personField {
    id
    name
    age
    email
    parents_id
    children_id
    friends_id
  }
  input searchPersonInput {
    field: personField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchPersonInput]
  }

  input orderPersonInput{
    field: personField
    order: Order
  }



  type Query {
    people(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput! ): [person]
    readOnePerson(id: ID!): person
    countPeople(search: searchPersonInput ): Int
    vueTablePerson : VueTablePerson    csvTableTemplatePerson: [String]
    peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput! ): PersonConnection
  }

  type Mutation {
    addPerson(id: ID!, name: String, age: Int, email: String, parents_id: [String], children_id: [String], friends_id: [String]   , addFriends:[ID], addParents:[ID], addChildren:[ID] , skipAssociationsExistenceChecks:Boolean = false): person!
    updatePerson(id: ID!, name: String, age: Int, email: String, parents_id: [String], children_id: [String], friends_id: [String]   , addFriends:[ID], removeFriends:[ID] , addParents:[ID], removeParents:[ID] , addChildren:[ID], removeChildren:[ID]  , skipAssociationsExistenceChecks:Boolean = false): person!
    deletePerson(id: ID!): String!
    bulkAddPersonCsv: String!
      }
`;