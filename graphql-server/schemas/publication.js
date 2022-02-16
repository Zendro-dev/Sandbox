module.exports = `
  type publication{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    pubMedID: String

    """
    @original-field
    
    """
    doi: String

    """
    @original-field
    
    """
    authorList: String

    """
    @original-field
    
    """
    title: String

    """
    @original-field
    
    """
    status_fk: String

    """
    @original-field
    
    """
    study_publications_fk: [String]

    """
    @original-field
    
    """
    investigation_publications_fk: String

    status(search: searchOntology_annotationInput): ontology_annotation
  investigation_publications(search: searchInvestigationInput): investigation
    
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
    study_publicationsFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_publicationsConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_publications(search: searchStudyInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type PublicationConnection{
  edges: [PublicationEdge]
  publications: [publication]
  pageInfo: pageInfo!
}

type PublicationEdge{
  cursor: String!
  node: publication!
}

  enum publicationField {
    id
    pubMedID
    doi
    authorList
    title
    status_fk
    study_publications_fk
    investigation_publications_fk
  }
  
  input searchPublicationInput {
    field: publicationField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchPublicationInput]
  }

  input orderPublicationInput{
    field: publicationField
    order: Order
  }

  input bulkAssociationPublicationWithStatus_fkInput{
    id: ID!
    status_fk: ID!
  }  input bulkAssociationPublicationWithInvestigation_publications_fkInput{
    id: ID!
    investigation_publications_fk: ID!
  }

  type Query {
    publications(search: searchPublicationInput, order: [ orderPublicationInput ], pagination: paginationInput! ): [publication]
    readOnePublication(id: ID!): publication
    countPublications(search: searchPublicationInput ): Int
    csvTableTemplatePublication: [String]
    publicationsConnection(search:searchPublicationInput, order: [ orderPublicationInput ], pagination: paginationCursorInput! ): PublicationConnection
    validatePublicationForCreation(id: ID!, pubMedID: String, doi: String, authorList: String, title: String , addStatus:ID, addInvestigation_publications:ID  , addComments:[ID], addStudy_publications:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validatePublicationForUpdating(id: ID!, pubMedID: String, doi: String, authorList: String, title: String , addStatus:ID, removeStatus:ID , addInvestigation_publications:ID, removeInvestigation_publications:ID   , addComments:[ID], removeComments:[ID] , addStudy_publications:[ID], removeStudy_publications:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validatePublicationForDeletion(id: ID!): Boolean!
    validatePublicationAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addPublication(id: ID!, pubMedID: String, doi: String, authorList: String, title: String , addStatus:ID, addInvestigation_publications:ID  , addComments:[ID], addStudy_publications:[ID] , skipAssociationsExistenceChecks:Boolean = false): publication!
    updatePublication(id: ID!, pubMedID: String, doi: String, authorList: String, title: String , addStatus:ID, removeStatus:ID , addInvestigation_publications:ID, removeInvestigation_publications:ID   , addComments:[ID], removeComments:[ID] , addStudy_publications:[ID], removeStudy_publications:[ID]  , skipAssociationsExistenceChecks:Boolean = false): publication!
    deletePublication(id: ID!): String!
    bulkAddPublicationCsv: String!
    bulkAssociatePublicationWithStatus_fk(bulkAssociationInput: [bulkAssociationPublicationWithStatus_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociatePublicationWithStatus_fk(bulkAssociationInput: [bulkAssociationPublicationWithStatus_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociatePublicationWithInvestigation_publications_fk(bulkAssociationInput: [bulkAssociationPublicationWithInvestigation_publications_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociatePublicationWithInvestigation_publications_fk(bulkAssociationInput: [bulkAssociationPublicationWithInvestigation_publications_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;