module.exports = `
  type person{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    lastName: String

    """
    @original-field
    
    """
    firstName: String

    """
    @original-field
    
    """
    midInitials: String

    """
    @original-field
    
    """
    email: String

    """
    @original-field
    
    """
    phone: String

    """
    @original-field
    
    """
    fax: String

    """
    @original-field
    
    """
    address: String

    """
    @original-field
    
    """
    affiliation: String

    """
    @original-field
    
    """
    roles_fk: [String]

    """
    @original-field
    
    """
    study_people_fk: [String]

    """
    @original-field
    
    """
    investigation_people_fk: [String]

      
    """
    @search-request
    """
    rolesFilter(search: searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationInput!): [ontology_annotation]


    """
    @search-request
    """
    rolesConnection(search: searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationCursorInput!): Ontology_annotationConnection

    """
    @count-request
    """
    countFilteredRoles(search: searchOntology_annotationInput) : Int
  
    """
    @search-request
    """
    commentsFilter(search: searchCommentInput, order: [ orderCommentInput ], pagination: paginationInput!): [comment]


    """
    @search-request
    """
    commentsConnection(search: searchCommentInput, order: [ orderCommentInput ], pagination: paginationCursorInput!): CommentConnection

    """
    @count-request
    """
    countFilteredComments(search: searchCommentInput) : Int
  
    """
    @search-request
    """
    investigation_peopleFilter(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationInput!): [investigation]


    """
    @search-request
    """
    investigation_peopleConnection(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationCursorInput!): InvestigationConnection

    """
    @count-request
    """
    countFilteredInvestigation_people(search: searchInvestigationInput) : Int
  
    """
    @search-request
    """
    study_peopleFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_peopleConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_people(search: searchStudyInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
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

  enum personField {
    id
    lastName
    firstName
    midInitials
    email
    phone
    fax
    address
    affiliation
    roles_fk
    study_people_fk
    investigation_people_fk
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
    csvTableTemplatePerson: [String]
    peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput! ): PersonConnection
    validatePersonForCreation(id: ID!, lastName: String, firstName: String, midInitials: String, email: String, phone: String, fax: String, address: String, affiliation: String   , addRoles:[ID], addComments:[ID], addInvestigation_people:[ID], addStudy_people:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validatePersonForUpdating(id: ID!, lastName: String, firstName: String, midInitials: String, email: String, phone: String, fax: String, address: String, affiliation: String   , addRoles:[ID], removeRoles:[ID] , addComments:[ID], removeComments:[ID] , addInvestigation_people:[ID], removeInvestigation_people:[ID] , addStudy_people:[ID], removeStudy_people:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validatePersonForDeletion(id: ID!): Boolean!
    validatePersonAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addPerson(id: ID!, lastName: String, firstName: String, midInitials: String, email: String, phone: String, fax: String, address: String, affiliation: String   , addRoles:[ID], addComments:[ID], addInvestigation_people:[ID], addStudy_people:[ID] , skipAssociationsExistenceChecks:Boolean = false): person!
    updatePerson(id: ID!, lastName: String, firstName: String, midInitials: String, email: String, phone: String, fax: String, address: String, affiliation: String   , addRoles:[ID], removeRoles:[ID] , addComments:[ID], removeComments:[ID] , addInvestigation_people:[ID], removeInvestigation_people:[ID] , addStudy_people:[ID], removeStudy_people:[ID]  , skipAssociationsExistenceChecks:Boolean = false): person!
    deletePerson(id: ID!): String!
    bulkAddPersonCsv: String!
      }
`;