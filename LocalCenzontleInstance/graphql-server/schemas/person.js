module.exports = `
  type Person{
    """
    @original-field
    """
    internalPersonId: ID

    """
    @original-field
    
    """
    firstName: String

    """
    @original-field
    
    """
    lastName: String

    """
    @original-field
    
    """
    email: String

    """
    @original-field
    
    """
    companyId: Int

      
    """
    @search-request
    """
    worksFilter(search: searchBookInput, order: [ orderBookInput ], pagination: paginationInput): [Book]


    """
    @search-request
    """
    worksConnection(search: searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput): BookConnection

    """
    @count-request
    """
    countFilteredWorks(search: searchBookInput) : Int
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
    internalPersonId
    firstName
    lastName
    email
    companyId
  }

  input searchPersonInput {
    field: PersonField
    value: typeValue
    operator: Operator
    excludeAdapterNames: [String]
    search: [searchPersonInput]
  }

  input orderPersonInput{
    field: PersonField
    order: Order
  }

  type Query {
    people(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput ): [Person]
    readOnePerson(internalPersonId: ID!): Person
    countPeople(search: searchPersonInput ): Int
    vueTablePerson : VueTablePerson    csvTableTemplatePerson: [String]

    peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput ): PersonConnection
  }

    type Mutation {
    addPerson(internalPersonId: ID!, firstName: String, lastName: String, email: String, companyId: Int  , addWorks:[ID] ): Person!
    updatePerson(internalPersonId: ID!, firstName: String, lastName: String, email: String, companyId: Int  , addWorks:[ID], removeWorks:[ID] ): Person!
  deletePerson(internalPersonId: ID!): String!
  bulkAddPersonCsv: [Person] }

`;