module.exports = `
  type comment{
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
    value: String

    """
    @original-field
    
    """
    assay_comments_fk: String

    """
    @original-field
    
    """
    ontology_annotation_comments_fk: String

    """
    @original-field
    
    """
    data_comments_fk: String

    """
    @original-field
    
    """
    process_comments_fk: String

    """
    @original-field
    
    """
    ontology_source_reference_comments_fk: String

    """
    @original-field
    
    """
    person_comments_fk: String

    """
    @original-field
    
    """
    publication_comments_fk: String

    """
    @original-field
    
    """
    investigation_comments_fk: String

    """
    @original-field
    
    """
    factor_comments_fk: String

    """
    @original-field
    
    """
    study_comments_fk: String

    """
    @original-field
    
    """
    protocol_comments_fk: String

    """
    @original-field
    
    """
    protocol_parameter_comments_fk: String

    """
    @original-field
    
    """
    material_comments_fk: String

    """
    @original-field
    
    """
    source_comments_fk: String

    """
    @original-field
    
    """
    material_attribute_value_comments_fk: String

    """
    @original-field
    
    """
    factor_value_comments_fk: String

    """
    @original-field
    
    """
    process_parameter_value_comments_fk: String

    """
    @original-field
    
    """
    sample_comments_fk: String

    """
    @original-field
    
    """
    component_comments_fk: String

    ontology_annotation_comments(search: searchOntology_annotationInput): ontology_annotation
  assay_comments(search: searchAssayInput): assay
  data_comments(search: searchDataInput): data
  process_comments(search: searchProcessInput): process
  ontology_source_reference_comments(search: searchOntology_source_referenceInput): ontology_source_reference
  publication_comments(search: searchPublicationInput): publication
  person_comments(search: searchPersonInput): person
  investigation_comments(search: searchInvestigationInput): investigation
  factor_comments(search: searchFactorInput): factor
  study_comments(search: searchStudyInput): study
  protocol_comments(search: searchProtocolInput): protocol
  protocol_parameter_comments(search: searchProtocol_parameterInput): protocol_parameter
  material_comments(search: searchMaterialInput): material
  source_comments(search: searchSourceInput): source
  material_attribute_value_comments(search: searchMaterial_attribute_valueInput): material_attribute_value
  factor_value_comments(search: searchFactor_valueInput): factor_value
  process_parameter_value_comments(search: searchProcess_parameter_valueInput): process_parameter_value
  sample_comments(search: searchSampleInput): sample
  component_comments(search: searchComponentInput): component
    
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type CommentConnection{
  edges: [CommentEdge]
  comments: [comment]
  pageInfo: pageInfo!
}

type CommentEdge{
  cursor: String!
  node: comment!
}

  enum commentField {
    id
    name
    value
    assay_comments_fk
    ontology_annotation_comments_fk
    data_comments_fk
    process_comments_fk
    ontology_source_reference_comments_fk
    person_comments_fk
    publication_comments_fk
    investigation_comments_fk
    factor_comments_fk
    study_comments_fk
    protocol_comments_fk
    protocol_parameter_comments_fk
    material_comments_fk
    source_comments_fk
    material_attribute_value_comments_fk
    factor_value_comments_fk
    process_parameter_value_comments_fk
    sample_comments_fk
    component_comments_fk
  }
  
  input searchCommentInput {
    field: commentField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchCommentInput]
  }

  input orderCommentInput{
    field: commentField
    order: Order
  }

  input bulkAssociationCommentWithOntology_annotation_comments_fkInput{
    id: ID!
    ontology_annotation_comments_fk: ID!
  }  input bulkAssociationCommentWithAssay_comments_fkInput{
    id: ID!
    assay_comments_fk: ID!
  }  input bulkAssociationCommentWithData_comments_fkInput{
    id: ID!
    data_comments_fk: ID!
  }  input bulkAssociationCommentWithProcess_comments_fkInput{
    id: ID!
    process_comments_fk: ID!
  }  input bulkAssociationCommentWithOntology_source_reference_comments_fkInput{
    id: ID!
    ontology_source_reference_comments_fk: ID!
  }  input bulkAssociationCommentWithPublication_comments_fkInput{
    id: ID!
    publication_comments_fk: ID!
  }  input bulkAssociationCommentWithPerson_comments_fkInput{
    id: ID!
    person_comments_fk: ID!
  }  input bulkAssociationCommentWithInvestigation_comments_fkInput{
    id: ID!
    investigation_comments_fk: ID!
  }  input bulkAssociationCommentWithFactor_comments_fkInput{
    id: ID!
    factor_comments_fk: ID!
  }  input bulkAssociationCommentWithStudy_comments_fkInput{
    id: ID!
    study_comments_fk: ID!
  }  input bulkAssociationCommentWithProtocol_comments_fkInput{
    id: ID!
    protocol_comments_fk: ID!
  }  input bulkAssociationCommentWithProtocol_parameter_comments_fkInput{
    id: ID!
    protocol_parameter_comments_fk: ID!
  }  input bulkAssociationCommentWithMaterial_comments_fkInput{
    id: ID!
    material_comments_fk: ID!
  }  input bulkAssociationCommentWithSource_comments_fkInput{
    id: ID!
    source_comments_fk: ID!
  }  input bulkAssociationCommentWithMaterial_attribute_value_comments_fkInput{
    id: ID!
    material_attribute_value_comments_fk: ID!
  }  input bulkAssociationCommentWithFactor_value_comments_fkInput{
    id: ID!
    factor_value_comments_fk: ID!
  }  input bulkAssociationCommentWithProcess_parameter_value_comments_fkInput{
    id: ID!
    process_parameter_value_comments_fk: ID!
  }  input bulkAssociationCommentWithSample_comments_fkInput{
    id: ID!
    sample_comments_fk: ID!
  }  input bulkAssociationCommentWithComponent_comments_fkInput{
    id: ID!
    component_comments_fk: ID!
  }

  type Query {
    comments(search: searchCommentInput, order: [ orderCommentInput ], pagination: paginationInput! ): [comment]
    readOneComment(id: ID!): comment
    countComments(search: searchCommentInput ): Int
    csvTableTemplateComment: [String]
    commentsConnection(search:searchCommentInput, order: [ orderCommentInput ], pagination: paginationCursorInput! ): CommentConnection
    validateCommentForCreation(id: ID!, name: String, value: String , addOntology_annotation_comments:ID, addAssay_comments:ID, addData_comments:ID, addProcess_comments:ID, addOntology_source_reference_comments:ID, addPublication_comments:ID, addPerson_comments:ID, addInvestigation_comments:ID, addFactor_comments:ID, addStudy_comments:ID, addProtocol_comments:ID, addProtocol_parameter_comments:ID, addMaterial_comments:ID, addSource_comments:ID, addMaterial_attribute_value_comments:ID, addFactor_value_comments:ID, addProcess_parameter_value_comments:ID, addSample_comments:ID, addComponent_comments:ID   , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateCommentForUpdating(id: ID!, name: String, value: String , addOntology_annotation_comments:ID, removeOntology_annotation_comments:ID , addAssay_comments:ID, removeAssay_comments:ID , addData_comments:ID, removeData_comments:ID , addProcess_comments:ID, removeProcess_comments:ID , addOntology_source_reference_comments:ID, removeOntology_source_reference_comments:ID , addPublication_comments:ID, removePublication_comments:ID , addPerson_comments:ID, removePerson_comments:ID , addInvestigation_comments:ID, removeInvestigation_comments:ID , addFactor_comments:ID, removeFactor_comments:ID , addStudy_comments:ID, removeStudy_comments:ID , addProtocol_comments:ID, removeProtocol_comments:ID , addProtocol_parameter_comments:ID, removeProtocol_parameter_comments:ID , addMaterial_comments:ID, removeMaterial_comments:ID , addSource_comments:ID, removeSource_comments:ID , addMaterial_attribute_value_comments:ID, removeMaterial_attribute_value_comments:ID , addFactor_value_comments:ID, removeFactor_value_comments:ID , addProcess_parameter_value_comments:ID, removeProcess_parameter_value_comments:ID , addSample_comments:ID, removeSample_comments:ID , addComponent_comments:ID, removeComponent_comments:ID    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateCommentForDeletion(id: ID!): Boolean!
    validateCommentAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addComment(id: ID!, name: String, value: String , addOntology_annotation_comments:ID, addAssay_comments:ID, addData_comments:ID, addProcess_comments:ID, addOntology_source_reference_comments:ID, addPublication_comments:ID, addPerson_comments:ID, addInvestigation_comments:ID, addFactor_comments:ID, addStudy_comments:ID, addProtocol_comments:ID, addProtocol_parameter_comments:ID, addMaterial_comments:ID, addSource_comments:ID, addMaterial_attribute_value_comments:ID, addFactor_value_comments:ID, addProcess_parameter_value_comments:ID, addSample_comments:ID, addComponent_comments:ID   , skipAssociationsExistenceChecks:Boolean = false): comment!
    updateComment(id: ID!, name: String, value: String , addOntology_annotation_comments:ID, removeOntology_annotation_comments:ID , addAssay_comments:ID, removeAssay_comments:ID , addData_comments:ID, removeData_comments:ID , addProcess_comments:ID, removeProcess_comments:ID , addOntology_source_reference_comments:ID, removeOntology_source_reference_comments:ID , addPublication_comments:ID, removePublication_comments:ID , addPerson_comments:ID, removePerson_comments:ID , addInvestigation_comments:ID, removeInvestigation_comments:ID , addFactor_comments:ID, removeFactor_comments:ID , addStudy_comments:ID, removeStudy_comments:ID , addProtocol_comments:ID, removeProtocol_comments:ID , addProtocol_parameter_comments:ID, removeProtocol_parameter_comments:ID , addMaterial_comments:ID, removeMaterial_comments:ID , addSource_comments:ID, removeSource_comments:ID , addMaterial_attribute_value_comments:ID, removeMaterial_attribute_value_comments:ID , addFactor_value_comments:ID, removeFactor_value_comments:ID , addProcess_parameter_value_comments:ID, removeProcess_parameter_value_comments:ID , addSample_comments:ID, removeSample_comments:ID , addComponent_comments:ID, removeComponent_comments:ID    , skipAssociationsExistenceChecks:Boolean = false): comment!
    deleteComment(id: ID!): String!
    bulkAddCommentCsv: String!
    bulkAssociateCommentWithOntology_annotation_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithOntology_annotation_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithOntology_annotation_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithOntology_annotation_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithAssay_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithAssay_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithAssay_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithAssay_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithData_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithData_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithData_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithData_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithProcess_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithProcess_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithProcess_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithProcess_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithOntology_source_reference_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithOntology_source_reference_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithOntology_source_reference_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithOntology_source_reference_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithPublication_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithPublication_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithPublication_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithPublication_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithPerson_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithPerson_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithPerson_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithPerson_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithInvestigation_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithInvestigation_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithInvestigation_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithInvestigation_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithFactor_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithFactor_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithFactor_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithFactor_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithStudy_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithStudy_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithStudy_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithStudy_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithProtocol_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithProtocol_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithProtocol_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithProtocol_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithProtocol_parameter_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithProtocol_parameter_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithProtocol_parameter_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithProtocol_parameter_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithMaterial_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithMaterial_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithMaterial_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithMaterial_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithSource_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithSource_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithSource_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithSource_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithMaterial_attribute_value_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithMaterial_attribute_value_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithMaterial_attribute_value_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithMaterial_attribute_value_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithFactor_value_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithFactor_value_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithFactor_value_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithFactor_value_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithProcess_parameter_value_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithProcess_parameter_value_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithProcess_parameter_value_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithProcess_parameter_value_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithSample_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithSample_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithSample_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithSample_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCommentWithComponent_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithComponent_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCommentWithComponent_comments_fk(bulkAssociationInput: [bulkAssociationCommentWithComponent_comments_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;