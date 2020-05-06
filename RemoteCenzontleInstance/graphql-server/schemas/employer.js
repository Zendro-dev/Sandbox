module.exports = `
  type Employer{
    """
    @original-field
    """
    id: ID

    """
    @original-field
    
    """
    employer: String

      
    """
    @search-request
    """
    employeesFilter(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput): [Person]


    """
    @search-request
    """
    employeesConnection(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput): PersonConnection

    """
    @count-request
    """
    countFilteredEmployees(search: searchPersonInput) : Int
  }

type EmployerConnection{
  edges: [EmployerEdge]
  pageInfo: pageInfo!
}

type EmployerEdge{
  cursor: String!
  node: Employer!
}

  type VueTableEmployer{
    data : [Employer]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum EmployerField {
    id
    employer
  }

  input searchEmployerInput {
    field: EmployerField
    value: typeValue
    operator: Operator
    search: [searchEmployerInput]
  }

  input orderEmployerInput{
    field: EmployerField
    order: Order
  }

  type Query {
    employers(search: searchEmployerInput, order: [ orderEmployerInput ], pagination: paginationInput ): [Employer]
    readOneEmployer(id: ID!): Employer
    countEmployers(search: searchEmployerInput ): Int
    vueTableEmployer : VueTableEmployer    csvTableTemplateEmployer: [String]

    employersConnection(search:searchEmployerInput, order: [ orderEmployerInput ], pagination: paginationCursorInput ): EmployerConnection
  }

    type Mutation {
    addEmployer( employer: String  , addEmployees:[ID] ): Employer!
    updateEmployer(id: ID!, employer: String  , addEmployees:[ID], removeEmployees:[ID] ): Employer!
  deleteEmployer(id: ID!): String!
  bulkAddEmployerCsv: [Employer] }

`;