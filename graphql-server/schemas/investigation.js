module.exports = `
  type investigation{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    title: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    startDate: Date

    """
    @original-field
    
    """
    endDate: Date

    """
    @original-field
    
    """
    license: String

    """
    @original-field
    
    """
    MIAPPE_version: String

    """
    @original-field
    
    """
    person_ids: [String]

      
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
  
    """
    @search-request
    """
    peopleFilter(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput!): [person]


    """
    @search-request
    """
    peopleConnection(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput!): PersonConnection

    """
    @count-request
    """
    countFilteredPeople(search: searchPersonInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type InvestigationConnection{
  edges: [InvestigationEdge]
  investigations: [investigation]
  pageInfo: pageInfo!
}

type InvestigationEdge{
  cursor: String!
  node: investigation!
}

  enum investigationField {
    id
    title
    description
    startDate
    endDate
    license
    MIAPPE_version
    person_ids
  }
  
  input searchInvestigationInput {
    field: investigationField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchInvestigationInput]
  }

  input orderInvestigationInput{
    field: investigationField
    order: Order
  }



  type Query {
    investigations(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationInput! ): [investigation]
    readOneInvestigation(id: ID!): investigation
    countInvestigations(search: searchInvestigationInput ): Int
    csvTableTemplateInvestigation: [String]
    investigationsConnection(search:searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationCursorInput! ): InvestigationConnection
    validateInvestigationForCreation(id: ID!, title: String, description: String, startDate: Date, endDate: Date, license: String, MIAPPE_version: String   , addStudies:[ID], addPeople:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateInvestigationForUpdating(id: ID!, title: String, description: String, startDate: Date, endDate: Date, license: String, MIAPPE_version: String   , addStudies:[ID], removeStudies:[ID] , addPeople:[ID], removePeople:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateInvestigationForDeletion(id: ID!): Boolean!
    validateInvestigationAfterReading(id: ID!): Boolean!
    """
    investigationsZendroDefinition would return the static Zendro data model definition
    """
    investigationsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addInvestigation(id: ID!, title: String, description: String, startDate: Date, endDate: Date, license: String, MIAPPE_version: String   , addStudies:[ID], addPeople:[ID] , skipAssociationsExistenceChecks:Boolean = false): investigation!
    updateInvestigation(id: ID!, title: String, description: String, startDate: Date, endDate: Date, license: String, MIAPPE_version: String   , addStudies:[ID], removeStudies:[ID] , addPeople:[ID], removePeople:[ID]  , skipAssociationsExistenceChecks:Boolean = false): investigation!
    deleteInvestigation(id: ID!): String!
      }
`;