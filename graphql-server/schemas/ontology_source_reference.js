module.exports = `
  type ontology_source_reference{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    file: String

    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    version: String

    """
    @original-field
    
    """
    investigation_ontologySourceReferences_fk: String

    investigation_ontologySourceReferences(search: searchInvestigationInput): investigation
    
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
type Ontology_source_referenceConnection{
  edges: [Ontology_source_referenceEdge]
  ontology_source_references: [ontology_source_reference]
  pageInfo: pageInfo!
}

type Ontology_source_referenceEdge{
  cursor: String!
  node: ontology_source_reference!
}

  enum ontology_source_referenceField {
    id
    description
    file
    name
    version
    investigation_ontologySourceReferences_fk
  }
  
  input searchOntology_source_referenceInput {
    field: ontology_source_referenceField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchOntology_source_referenceInput]
  }

  input orderOntology_source_referenceInput{
    field: ontology_source_referenceField
    order: Order
  }

  input bulkAssociationOntology_source_referenceWithInvestigation_ontologySourceReferences_fkInput{
    id: ID!
    investigation_ontologySourceReferences_fk: ID!
  }

  type Query {
    ontology_source_references(search: searchOntology_source_referenceInput, order: [ orderOntology_source_referenceInput ], pagination: paginationInput! ): [ontology_source_reference]
    readOneOntology_source_reference(id: ID!): ontology_source_reference
    countOntology_source_references(search: searchOntology_source_referenceInput ): Int
    csvTableTemplateOntology_source_reference: [String]
    ontology_source_referencesConnection(search:searchOntology_source_referenceInput, order: [ orderOntology_source_referenceInput ], pagination: paginationCursorInput! ): Ontology_source_referenceConnection
    validateOntology_source_referenceForCreation(id: ID!, description: String, file: String, name: String, version: String , addInvestigation_ontologySourceReferences:ID  , addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateOntology_source_referenceForUpdating(id: ID!, description: String, file: String, name: String, version: String , addInvestigation_ontologySourceReferences:ID, removeInvestigation_ontologySourceReferences:ID   , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateOntology_source_referenceForDeletion(id: ID!): Boolean!
    validateOntology_source_referenceAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addOntology_source_reference(id: ID!, description: String, file: String, name: String, version: String , addInvestigation_ontologySourceReferences:ID  , addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): ontology_source_reference!
    updateOntology_source_reference(id: ID!, description: String, file: String, name: String, version: String , addInvestigation_ontologySourceReferences:ID, removeInvestigation_ontologySourceReferences:ID   , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): ontology_source_reference!
    deleteOntology_source_reference(id: ID!): String!
    bulkAddOntology_source_referenceCsv: String!
    bulkAssociateOntology_source_referenceWithInvestigation_ontologySourceReferences_fk(bulkAssociationInput: [bulkAssociationOntology_source_referenceWithInvestigation_ontologySourceReferences_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateOntology_source_referenceWithInvestigation_ontologySourceReferences_fk(bulkAssociationInput: [bulkAssociationOntology_source_referenceWithInvestigation_ontologySourceReferences_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;