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
    email: String

    """
    @original-field
    
    """
    role: String

    """
    @original-field
    
    """
    affiliation: String

    """
    @original-field
    
    """
    investigation_ids: [String]

    """
    @original-field
    
    """
    study_ids: [String]

      
    """
    @search-request
    """
    investigationsFilter(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationInput!): [investigation]


    """
    @search-request
    """
    investigationsConnection(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationCursorInput!): InvestigationConnection

    """
    @count-request
    """
    countFilteredInvestigations(search: searchInvestigationInput) : Int
  
    """
    @search-request
    """
    studiesFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    studiesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudies(search: searchStudyInput) : Int
  
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
    email
    role
    affiliation
    investigation_ids
    study_ids
  }
  
  input searchPersonInput {
    field: personField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
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
    vueTablePerson : VueTablePerson
    csvTableTemplatePerson: [String]
    peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput! ): PersonConnection
  }

  type Mutation {
    addPerson(id: ID!, name: String, email: String, role: String, affiliation: String   , addInvestigations:[ID], addStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): person!
    updatePerson(id: ID!, name: String, email: String, role: String, affiliation: String   , addInvestigations:[ID], removeInvestigations:[ID] , addStudies:[ID], removeStudies:[ID]  , skipAssociationsExistenceChecks:Boolean = false): person!
    deletePerson(id: ID!): String!
    bulkAddPersonCsv: String!
      }
`;