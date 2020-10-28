module.exports = `
  type Person{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

      
    }
type PersonConnection{
  edges: [PersonEdge]
  pageInfo: pageInfo!
}

type PersonEdge{
  cursor: String!
  node: Person!
}

  type VueTablePerson{
    data : [Person]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum PersonField {
    id
    name
  }
  input searchPersonInput {
    field: PersonField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchPersonInput]
  }

  input orderPersonInput{
    field: PersonField
    order: Order
  }



  type Query {
    people(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput! ): [Person]
    readOnePerson(id: ID!): Person
    countPeople(search: searchPersonInput ): Int
    vueTablePerson : VueTablePerson    csvTableTemplatePerson: [String]
    peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput! ): PersonConnection
  }

  type Mutation {
    addPerson( name: String    , skipAssociationsExistenceChecks:Boolean = false): Person!
    updatePerson(id: ID!, name: String    , skipAssociationsExistenceChecks:Boolean = false): Person!
    deletePerson(id: ID!): String!
    bulkAddPersonCsv: String!
      }
`;