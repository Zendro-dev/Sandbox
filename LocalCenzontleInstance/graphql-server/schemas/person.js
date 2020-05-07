module.exports = `
  type Person{
    """
    @original-field
    """
    internalPId: ID

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
    @original-field
    
    """
    internalEId: Int

    employer(search: searchEmployerInput): Employer
    
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
    internalPId
    firstName
    lastName
    email
    companyId
    internalEId
  }

  input searchPersonInput {
    field: PersonField
    value: typeValue
    operator: Operator
    search: [searchPersonInput]
  }

  input orderPersonInput{
    field: PersonField
    order: Order
  }

  type Query {
    people(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput ): [Person]
    readOnePerson(internalPId: ID!): Person
    countPeople(search: searchPersonInput ): Int
    vueTablePerson : VueTablePerson    csvTableTemplatePerson: [String]

    peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput ): PersonConnection
  }

    type Mutation {
    addPerson(internalPId: ID!, firstName: String, lastName: String, email: String, companyId: Int , addEmployer:ID , addWorks:[ID] ): Person!
    updatePerson(internalPId: ID!, firstName: String, lastName: String, email: String, companyId: Int , addEmployer:ID, removeEmployer:ID  , addWorks:[ID], removeWorks:[ID] ): Person!
  deletePerson(internalPId: ID!): String!
  bulkAddPersonCsv: [Person] }

`;