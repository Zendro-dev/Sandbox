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

unique_parrot(search: searchParrotInput): parrot
  """
  @search-request
  """
  dogsConnection(search: searchDogInput, order: [ orderDogInput ], pagination: paginationCursorInput): DogConnection
  """
  @count-request
  """
  countFilteredDogs(search: searchDogInput) : Int

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
}

input searchPersonInput {
  field: personField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchPersonInput]
}

input orderPersonInput{
  field: personField
  order: Order
}


type Query {
  readOnePerson(person_id: ID!): person
  countPeople(search: searchPersonInput ): Int
  vueTablePerson : VueTablePerson  csvTableTemplatePerson: [String]
  peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput ): PersonConnection
}

  type Mutation {
    addPerson(person_id: ID!, name: String , addUnique_parrot:ID  , addDogs:[ID] , skipAssociationsExistenceChecks:Boolean = false): person!
    updatePerson(person_id: ID!, name: String , addUnique_parrot:ID, removeUnique_parrot:ID   , addDogs:[ID], removeDogs:[ID]  , skipAssociationsExistenceChecks:Boolean = false): person!
    deletePerson(person_id: ID!): String!
    bulkAddPersonCsv: String
    }

`;