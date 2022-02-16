module.exports = `
  type investigation{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    filename: String

    """
    @original-field
    
    """
    identifier: String

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
    submissionDate: DateTime

    """
    @original-field
    
    """
    publicReleaseDate: DateTime

    """
    @original-field
    
    """
    people_fk: [String]

      
    """
    @search-request
    """
    ontologySourceReferencesFilter(search: searchOntology_source_referenceInput, order: [ orderOntology_source_referenceInput ], pagination: paginationInput!): [ontology_source_reference]


    """
    @search-request
    """
    ontologySourceReferencesConnection(search: searchOntology_source_referenceInput, order: [ orderOntology_source_referenceInput ], pagination: paginationCursorInput!): Ontology_source_referenceConnection

    """
    @count-request
    """
    countFilteredOntologySourceReferences(search: searchOntology_source_referenceInput) : Int
  
    """
    @search-request
    """
    publicationsFilter(search: searchPublicationInput, order: [ orderPublicationInput ], pagination: paginationInput!): [publication]


    """
    @search-request
    """
    publicationsConnection(search: searchPublicationInput, order: [ orderPublicationInput ], pagination: paginationCursorInput!): PublicationConnection

    """
    @count-request
    """
    countFilteredPublications(search: searchPublicationInput) : Int
  
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
    filename
    identifier
    title
    description
    submissionDate
    publicReleaseDate
    people_fk
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
    validateInvestigationForCreation(id: ID!, filename: String, identifier: String, title: String, description: String, submissionDate: DateTime, publicReleaseDate: DateTime   , addOntologySourceReferences:[ID], addPublications:[ID], addPeople:[ID], addStudies:[ID], addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateInvestigationForUpdating(id: ID!, filename: String, identifier: String, title: String, description: String, submissionDate: DateTime, publicReleaseDate: DateTime   , addOntologySourceReferences:[ID], removeOntologySourceReferences:[ID] , addPublications:[ID], removePublications:[ID] , addPeople:[ID], removePeople:[ID] , addStudies:[ID], removeStudies:[ID] , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateInvestigationForDeletion(id: ID!): Boolean!
    validateInvestigationAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addInvestigation(id: ID!, filename: String, identifier: String, title: String, description: String, submissionDate: DateTime, publicReleaseDate: DateTime   , addOntologySourceReferences:[ID], addPublications:[ID], addPeople:[ID], addStudies:[ID], addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): investigation!
    updateInvestigation(id: ID!, filename: String, identifier: String, title: String, description: String, submissionDate: DateTime, publicReleaseDate: DateTime   , addOntologySourceReferences:[ID], removeOntologySourceReferences:[ID] , addPublications:[ID], removePublications:[ID] , addPeople:[ID], removePeople:[ID] , addStudies:[ID], removeStudies:[ID] , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): investigation!
    deleteInvestigation(id: ID!): String!
    bulkAddInvestigationCsv: String!
      }
`;