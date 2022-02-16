module.exports = `
  type ontology_annotation{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    annotationValue: String

    """
    @original-field
    
    """
    termSource: String

    """
    @original-field
    
    """
    termAccession: String

    """
    @original-field
    
    """
    assay_unitCategories_fk: [String]

    """
    @original-field
    
    """
    study_studyDesignDescriptors_fk: [String]

    """
    @original-field
    
    """
    study_unitCategories_fk: [String]

    """
    @original-field
    
    """
    person_roles_fk: [String]

      
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
    assay_measurementTypeFilter(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput!): [assay]


    """
    @search-request
    """
    assay_measurementTypeConnection(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput!): AssayConnection

    """
    @count-request
    """
    countFilteredAssay_measurementType(search: searchAssayInput) : Int
  
    """
    @search-request
    """
    assay_unitCategoriesFilter(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput!): [assay]


    """
    @search-request
    """
    assay_unitCategoriesConnection(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput!): AssayConnection

    """
    @count-request
    """
    countFilteredAssay_unitCategories(search: searchAssayInput) : Int
  
    """
    @search-request
    """
    publication_statusFilter(search: searchPublicationInput, order: [ orderPublicationInput ], pagination: paginationInput!): [publication]


    """
    @search-request
    """
    publication_statusConnection(search: searchPublicationInput, order: [ orderPublicationInput ], pagination: paginationCursorInput!): PublicationConnection

    """
    @count-request
    """
    countFilteredPublication_status(search: searchPublicationInput) : Int
  
    """
    @search-request
    """
    person_rolesFilter(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput!): [person]


    """
    @search-request
    """
    person_rolesConnection(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput!): PersonConnection

    """
    @count-request
    """
    countFilteredPerson_roles(search: searchPersonInput) : Int
  
    """
    @search-request
    """
    study_studyDesignDescriptorsFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_studyDesignDescriptorsConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_studyDesignDescriptors(search: searchStudyInput) : Int
  
    """
    @search-request
    """
    factor_factorTypeFilter(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationInput!): [factor]


    """
    @search-request
    """
    factor_factorTypeConnection(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationCursorInput!): FactorConnection

    """
    @count-request
    """
    countFilteredFactor_factorType(search: searchFactorInput) : Int
  
    """
    @search-request
    """
    study_unitCategoriesFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_unitCategoriesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_unitCategories(search: searchStudyInput) : Int
  
    """
    @search-request
    """
    protocol_protocolTypeFilter(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationInput!): [protocol]


    """
    @search-request
    """
    protocol_protocolTypeConnection(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationCursorInput!): ProtocolConnection

    """
    @count-request
    """
    countFilteredProtocol_protocolType(search: searchProtocolInput) : Int
  
    """
    @search-request
    """
    protocol_parameter_parameterNameFilter(search: searchProtocol_parameterInput, order: [ orderProtocol_parameterInput ], pagination: paginationInput!): [protocol_parameter]


    """
    @search-request
    """
    protocol_parameter_parameterNameConnection(search: searchProtocol_parameterInput, order: [ orderProtocol_parameterInput ], pagination: paginationCursorInput!): Protocol_parameterConnection

    """
    @count-request
    """
    countFilteredProtocol_parameter_parameterName(search: searchProtocol_parameterInput) : Int
  
    """
    @search-request
    """
    material_attribute_characteristicTypeFilter(search: searchMaterial_attributeInput, order: [ orderMaterial_attributeInput ], pagination: paginationInput!): [material_attribute]


    """
    @search-request
    """
    material_attribute_characteristicTypeConnection(search: searchMaterial_attributeInput, order: [ orderMaterial_attributeInput ], pagination: paginationCursorInput!): Material_attributeConnection

    """
    @count-request
    """
    countFilteredMaterial_attribute_characteristicType(search: searchMaterial_attributeInput) : Int
  
    """
    @search-request
    """
    material_attribute_value_unitFilter(search: searchMaterial_attribute_valueInput, order: [ orderMaterial_attribute_valueInput ], pagination: paginationInput!): [material_attribute_value]


    """
    @search-request
    """
    material_attribute_value_unitConnection(search: searchMaterial_attribute_valueInput, order: [ orderMaterial_attribute_valueInput ], pagination: paginationCursorInput!): Material_attribute_valueConnection

    """
    @count-request
    """
    countFilteredMaterial_attribute_value_unit(search: searchMaterial_attribute_valueInput) : Int
  
    """
    @search-request
    """
    factor_value_unitFilter(search: searchFactor_valueInput, order: [ orderFactor_valueInput ], pagination: paginationInput!): [factor_value]


    """
    @search-request
    """
    factor_value_unitConnection(search: searchFactor_valueInput, order: [ orderFactor_valueInput ], pagination: paginationCursorInput!): Factor_valueConnection

    """
    @count-request
    """
    countFilteredFactor_value_unit(search: searchFactor_valueInput) : Int
  
    """
    @search-request
    """
    process_parameter_value_unitFilter(search: searchProcess_parameter_valueInput, order: [ orderProcess_parameter_valueInput ], pagination: paginationInput!): [process_parameter_value]


    """
    @search-request
    """
    process_parameter_value_unitConnection(search: searchProcess_parameter_valueInput, order: [ orderProcess_parameter_valueInput ], pagination: paginationCursorInput!): Process_parameter_valueConnection

    """
    @count-request
    """
    countFilteredProcess_parameter_value_unit(search: searchProcess_parameter_valueInput) : Int
  
    """
    @search-request
    """
    assay_technologyTypeFilter(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput!): [assay]


    """
    @search-request
    """
    assay_technologyTypeConnection(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput!): AssayConnection

    """
    @count-request
    """
    countFilteredAssay_technologyType(search: searchAssayInput) : Int
  
    """
    @search-request
    """
    component_componentTypeFilter(search: searchComponentInput, order: [ orderComponentInput ], pagination: paginationInput!): [component]


    """
    @search-request
    """
    component_componentTypeConnection(search: searchComponentInput, order: [ orderComponentInput ], pagination: paginationCursorInput!): ComponentConnection

    """
    @count-request
    """
    countFilteredComponent_componentType(search: searchComponentInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type Ontology_annotationConnection{
  edges: [Ontology_annotationEdge]
  ontology_annotations: [ontology_annotation]
  pageInfo: pageInfo!
}

type Ontology_annotationEdge{
  cursor: String!
  node: ontology_annotation!
}

  enum ontology_annotationField {
    id
    annotationValue
    termSource
    termAccession
    assay_unitCategories_fk
    study_studyDesignDescriptors_fk
    study_unitCategories_fk
    person_roles_fk
  }
  
  input searchOntology_annotationInput {
    field: ontology_annotationField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchOntology_annotationInput]
  }

  input orderOntology_annotationInput{
    field: ontology_annotationField
    order: Order
  }



  type Query {
    ontology_annotations(search: searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationInput! ): [ontology_annotation]
    readOneOntology_annotation(id: ID!): ontology_annotation
    countOntology_annotations(search: searchOntology_annotationInput ): Int
    csvTableTemplateOntology_annotation: [String]
    ontology_annotationsConnection(search:searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationCursorInput! ): Ontology_annotationConnection
    validateOntology_annotationForCreation(id: ID!, annotationValue: String, termSource: String, termAccession: String   , addComments:[ID], addAssay_measurementType:[ID], addAssay_unitCategories:[ID], addPublication_status:[ID], addPerson_roles:[ID], addStudy_studyDesignDescriptors:[ID], addFactor_factorType:[ID], addStudy_unitCategories:[ID], addProtocol_protocolType:[ID], addProtocol_parameter_parameterName:[ID], addMaterial_attribute_characteristicType:[ID], addMaterial_attribute_value_unit:[ID], addFactor_value_unit:[ID], addProcess_parameter_value_unit:[ID], addAssay_technologyType:[ID], addComponent_componentType:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateOntology_annotationForUpdating(id: ID!, annotationValue: String, termSource: String, termAccession: String   , addComments:[ID], removeComments:[ID] , addAssay_measurementType:[ID], removeAssay_measurementType:[ID] , addAssay_unitCategories:[ID], removeAssay_unitCategories:[ID] , addPublication_status:[ID], removePublication_status:[ID] , addPerson_roles:[ID], removePerson_roles:[ID] , addStudy_studyDesignDescriptors:[ID], removeStudy_studyDesignDescriptors:[ID] , addFactor_factorType:[ID], removeFactor_factorType:[ID] , addStudy_unitCategories:[ID], removeStudy_unitCategories:[ID] , addProtocol_protocolType:[ID], removeProtocol_protocolType:[ID] , addProtocol_parameter_parameterName:[ID], removeProtocol_parameter_parameterName:[ID] , addMaterial_attribute_characteristicType:[ID], removeMaterial_attribute_characteristicType:[ID] , addMaterial_attribute_value_unit:[ID], removeMaterial_attribute_value_unit:[ID] , addFactor_value_unit:[ID], removeFactor_value_unit:[ID] , addProcess_parameter_value_unit:[ID], removeProcess_parameter_value_unit:[ID] , addAssay_technologyType:[ID], removeAssay_technologyType:[ID] , addComponent_componentType:[ID], removeComponent_componentType:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateOntology_annotationForDeletion(id: ID!): Boolean!
    validateOntology_annotationAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addOntology_annotation(id: ID!, annotationValue: String, termSource: String, termAccession: String   , addComments:[ID], addAssay_measurementType:[ID], addAssay_unitCategories:[ID], addPublication_status:[ID], addPerson_roles:[ID], addStudy_studyDesignDescriptors:[ID], addFactor_factorType:[ID], addStudy_unitCategories:[ID], addProtocol_protocolType:[ID], addProtocol_parameter_parameterName:[ID], addMaterial_attribute_characteristicType:[ID], addMaterial_attribute_value_unit:[ID], addFactor_value_unit:[ID], addProcess_parameter_value_unit:[ID], addAssay_technologyType:[ID], addComponent_componentType:[ID] , skipAssociationsExistenceChecks:Boolean = false): ontology_annotation!
    updateOntology_annotation(id: ID!, annotationValue: String, termSource: String, termAccession: String   , addComments:[ID], removeComments:[ID] , addAssay_measurementType:[ID], removeAssay_measurementType:[ID] , addAssay_unitCategories:[ID], removeAssay_unitCategories:[ID] , addPublication_status:[ID], removePublication_status:[ID] , addPerson_roles:[ID], removePerson_roles:[ID] , addStudy_studyDesignDescriptors:[ID], removeStudy_studyDesignDescriptors:[ID] , addFactor_factorType:[ID], removeFactor_factorType:[ID] , addStudy_unitCategories:[ID], removeStudy_unitCategories:[ID] , addProtocol_protocolType:[ID], removeProtocol_protocolType:[ID] , addProtocol_parameter_parameterName:[ID], removeProtocol_parameter_parameterName:[ID] , addMaterial_attribute_characteristicType:[ID], removeMaterial_attribute_characteristicType:[ID] , addMaterial_attribute_value_unit:[ID], removeMaterial_attribute_value_unit:[ID] , addFactor_value_unit:[ID], removeFactor_value_unit:[ID] , addProcess_parameter_value_unit:[ID], removeProcess_parameter_value_unit:[ID] , addAssay_technologyType:[ID], removeAssay_technologyType:[ID] , addComponent_componentType:[ID], removeComponent_componentType:[ID]  , skipAssociationsExistenceChecks:Boolean = false): ontology_annotation!
    deleteOntology_annotation(id: ID!): String!
    bulkAddOntology_annotationCsv: String!
      }
`;