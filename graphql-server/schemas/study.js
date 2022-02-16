module.exports = `
  type study{
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
    publications_fk: [String]

    """
    @original-field
    
    """
    people_fk: [String]

    """
    @original-field
    
    """
    studyDesignDescriptors_fk: [String]

    """
    @original-field
    
    """
    protocols_fk: [String]

    """
    @original-field
    
    """
    materials_sources_fk: [String]

    """
    @original-field
    
    """
    materials_samples_fk: [String]

    """
    @original-field
    
    """
    materials_otherMaterials_fk: [String]

    """
    @original-field
    
    """
    processSequence_fk: [String]

    """
    @original-field
    
    """
    assays_fk: [String]

    """
    @original-field
    
    """
    factors_fk: [String]

    """
    @original-field
    
    """
    characteristicCategories_fk: [String]

    """
    @original-field
    
    """
    unitCategories_fk: [String]

    """
    @original-field
    
    """
    investigation_studies_fk: String

    investigation_studies(search: searchInvestigationInput): investigation
    
    """
    @search-request
    """
    materials_sourcesFilter(search: searchSourceInput, order: [ orderSourceInput ], pagination: paginationInput!): [source]


    """
    @search-request
    """
    materials_sourcesConnection(search: searchSourceInput, order: [ orderSourceInput ], pagination: paginationCursorInput!): SourceConnection

    """
    @count-request
    """
    countFilteredMaterials_sources(search: searchSourceInput) : Int
  
    """
    @search-request
    """
    materials_samplesFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput!): [sample]


    """
    @search-request
    """
    materials_samplesConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection

    """
    @count-request
    """
    countFilteredMaterials_samples(search: searchSampleInput) : Int
  
    """
    @search-request
    """
    materials_otherMaterialsFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    materials_otherMaterialsConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredMaterials_otherMaterials(search: searchMaterialInput) : Int
  
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
    studyDesignDescriptorsFilter(search: searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationInput!): [ontology_annotation]


    """
    @search-request
    """
    studyDesignDescriptorsConnection(search: searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationCursorInput!): Ontology_annotationConnection

    """
    @count-request
    """
    countFilteredStudyDesignDescriptors(search: searchOntology_annotationInput) : Int
  
    """
    @search-request
    """
    protocolsFilter(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationInput!): [protocol]


    """
    @search-request
    """
    protocolsConnection(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationCursorInput!): ProtocolConnection

    """
    @count-request
    """
    countFilteredProtocols(search: searchProtocolInput) : Int
  
    """
    @search-request
    """
    processSequenceFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    processSequenceConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcessSequence(search: searchProcessInput) : Int
  
    """
    @search-request
    """
    assaysFilter(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput!): [assay]


    """
    @search-request
    """
    assaysConnection(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput!): AssayConnection

    """
    @count-request
    """
    countFilteredAssays(search: searchAssayInput) : Int
  
    """
    @search-request
    """
    factorsFilter(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationInput!): [factor]


    """
    @search-request
    """
    factorsConnection(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationCursorInput!): FactorConnection

    """
    @count-request
    """
    countFilteredFactors(search: searchFactorInput) : Int
  
    """
    @search-request
    """
    characteristicCategoriesFilter(search: searchMaterial_attributeInput, order: [ orderMaterial_attributeInput ], pagination: paginationInput!): [material_attribute]


    """
    @search-request
    """
    characteristicCategoriesConnection(search: searchMaterial_attributeInput, order: [ orderMaterial_attributeInput ], pagination: paginationCursorInput!): Material_attributeConnection

    """
    @count-request
    """
    countFilteredCharacteristicCategories(search: searchMaterial_attributeInput) : Int
  
    """
    @search-request
    """
    unitCategoriesFilter(search: searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationInput!): [ontology_annotation]


    """
    @search-request
    """
    unitCategoriesConnection(search: searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationCursorInput!): Ontology_annotationConnection

    """
    @count-request
    """
    countFilteredUnitCategories(search: searchOntology_annotationInput) : Int
  
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
type StudyConnection{
  edges: [StudyEdge]
  studies: [study]
  pageInfo: pageInfo!
}

type StudyEdge{
  cursor: String!
  node: study!
}

  enum studyField {
    id
    filename
    identifier
    title
    description
    submissionDate
    publicReleaseDate
    publications_fk
    people_fk
    studyDesignDescriptors_fk
    protocols_fk
    materials_sources_fk
    materials_samples_fk
    materials_otherMaterials_fk
    processSequence_fk
    assays_fk
    factors_fk
    characteristicCategories_fk
    unitCategories_fk
    investigation_studies_fk
  }
  
  input searchStudyInput {
    field: studyField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchStudyInput]
  }

  input orderStudyInput{
    field: studyField
    order: Order
  }

  input bulkAssociationStudyWithInvestigation_studies_fkInput{
    id: ID!
    investigation_studies_fk: ID!
  }

  type Query {
    studies(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput! ): [study]
    readOneStudy(id: ID!): study
    countStudies(search: searchStudyInput ): Int
    csvTableTemplateStudy: [String]
    studiesConnection(search:searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput! ): StudyConnection
    validateStudyForCreation(id: ID!, filename: String, identifier: String, title: String, description: String, submissionDate: DateTime, publicReleaseDate: DateTime, processSequence_fk: [String], assays_fk: [String] , addInvestigation_studies:ID  , addMaterials_sources:[ID], addMaterials_samples:[ID], addMaterials_otherMaterials:[ID], addPublications:[ID], addPeople:[ID], addStudyDesignDescriptors:[ID], addProtocols:[ID], addProcessSequence:[ID], addAssays:[ID], addFactors:[ID], addCharacteristicCategories:[ID], addUnitCategories:[ID], addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateStudyForUpdating(id: ID!, filename: String, identifier: String, title: String, description: String, submissionDate: DateTime, publicReleaseDate: DateTime, processSequence_fk: [String], assays_fk: [String] , addInvestigation_studies:ID, removeInvestigation_studies:ID   , addMaterials_sources:[ID], removeMaterials_sources:[ID] , addMaterials_samples:[ID], removeMaterials_samples:[ID] , addMaterials_otherMaterials:[ID], removeMaterials_otherMaterials:[ID] , addPublications:[ID], removePublications:[ID] , addPeople:[ID], removePeople:[ID] , addStudyDesignDescriptors:[ID], removeStudyDesignDescriptors:[ID] , addProtocols:[ID], removeProtocols:[ID] , addProcessSequence:[ID], removeProcessSequence:[ID] , addAssays:[ID], removeAssays:[ID] , addFactors:[ID], removeFactors:[ID] , addCharacteristicCategories:[ID], removeCharacteristicCategories:[ID] , addUnitCategories:[ID], removeUnitCategories:[ID] , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateStudyForDeletion(id: ID!): Boolean!
    validateStudyAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addStudy(id: ID!, filename: String, identifier: String, title: String, description: String, submissionDate: DateTime, publicReleaseDate: DateTime, processSequence_fk: [String], assays_fk: [String] , addInvestigation_studies:ID  , addMaterials_sources:[ID], addMaterials_samples:[ID], addMaterials_otherMaterials:[ID], addPublications:[ID], addPeople:[ID], addStudyDesignDescriptors:[ID], addProtocols:[ID], addProcessSequence:[ID], addAssays:[ID], addFactors:[ID], addCharacteristicCategories:[ID], addUnitCategories:[ID], addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): study!
    updateStudy(id: ID!, filename: String, identifier: String, title: String, description: String, submissionDate: DateTime, publicReleaseDate: DateTime, processSequence_fk: [String], assays_fk: [String] , addInvestigation_studies:ID, removeInvestigation_studies:ID   , addMaterials_sources:[ID], removeMaterials_sources:[ID] , addMaterials_samples:[ID], removeMaterials_samples:[ID] , addMaterials_otherMaterials:[ID], removeMaterials_otherMaterials:[ID] , addPublications:[ID], removePublications:[ID] , addPeople:[ID], removePeople:[ID] , addStudyDesignDescriptors:[ID], removeStudyDesignDescriptors:[ID] , addProtocols:[ID], removeProtocols:[ID] , addProcessSequence:[ID], removeProcessSequence:[ID] , addAssays:[ID], removeAssays:[ID] , addFactors:[ID], removeFactors:[ID] , addCharacteristicCategories:[ID], removeCharacteristicCategories:[ID] , addUnitCategories:[ID], removeUnitCategories:[ID] , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): study!
    deleteStudy(id: ID!): String!
    bulkAddStudyCsv: String!
    bulkAssociateStudyWithInvestigation_studies_fk(bulkAssociationInput: [bulkAssociationStudyWithInvestigation_studies_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateStudyWithInvestigation_studies_fk(bulkAssociationInput: [bulkAssociationStudyWithInvestigation_studies_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;