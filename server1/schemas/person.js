module.exports = `
  type person{
    """
    @original-field
    """
    person_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    age: Int

      
    """
    @search-request
    """
    dogsFilter(search: searchDogInput, order: [ orderDogInput ], pagination: paginationInput!): [dog]


    """
    @search-request
    """
    dogsConnection(search: searchDogInput, order: [ orderDogInput ], pagination: paginationCursorInput!): DogConnection

    """
    @count-request
    """
    countFilteredDogs(search: searchDogInput) : Int
  
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
type PersonConnection{
  edges: [PersonEdge]
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
    person_id
    name
    age
  }
  input searchPersonInput {
    field: personField
    value: typeValue
    operator: Operator
    search: [searchPersonInput]
  }

  input orderPersonInput{
    field: personField
    order: Order
  }



  type Query {
    people(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput! ): [person]
    readOnePerson(person_id: ID!): person
    countPeople(search: searchPersonInput ): Int
    vueTablePerson : VueTablePerson    csvTableTemplatePerson: [String]
    peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput! ): PersonConnection
  }

  type Mutation {
    addPerson(person_id: ID!, name: String, age: Int   , addDogs:[ID], addCats:[ID] , skipAssociationsExistenceChecks:Boolean = false): person!
    updatePerson(person_id: ID!, name: String, age: Int   , addDogs:[ID], removeDogs:[ID] , addCats:[ID], removeCats:[ID]  , skipAssociationsExistenceChecks:Boolean = false): person!
    deletePerson(person_id: ID!): String!
    bulkAddPersonCsv: String!
      }
`;