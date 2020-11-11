module.exports = `
  type material{
    """
    @original-field
    """
    material_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    type: String

    """
    @original-field
    
    """
    study_ids: [String]

    """
    @original-field
    
    """
    assay_ids: [String]

    """
    @original-field
    
    """
    ontologyAnnotation_ids: [String]

    """
    @original-field
    
    """
    sourceSet_ids: [String]

    """
    @original-field
    
    """
    element_ids: [String]

    """
    @original-field
    
    """
    fileAttachment_ids: [String]

      
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
    assayResultsFilter(search: searchAssayResultInput, order: [ orderAssayResultInput ], pagination: paginationInput!): [assayResult]


    """
    @search-request
    """
    assayResultsConnection(search: searchAssayResultInput, order: [ orderAssayResultInput ], pagination: paginationCursorInput!): AssayResultConnection

    """
    @count-request
    """
    countFilteredAssayResults(search: searchAssayResultInput) : Int
  
    """
    @search-request
    """
    ontologyAnnotationFilter(search: searchOntologyAnnotationInput, order: [ orderOntologyAnnotationInput ], pagination: paginationInput!): [ontologyAnnotation]


    """
    @search-request
    """
    ontologyAnnotationConnection(search: searchOntologyAnnotationInput, order: [ orderOntologyAnnotationInput ], pagination: paginationCursorInput!): OntologyAnnotationConnection

    """
    @count-request
    """
    countFilteredOntologyAnnotation(search: searchOntologyAnnotationInput) : Int
  
    """
    @search-request
    """
    sourceSetsFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    sourceSetsConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredSourceSets(search: searchMaterialInput) : Int
  
    """
    @search-request
    """
    elementsFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    elementsConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredElements(search: searchMaterialInput) : Int
  
    """
    @search-request
    """
    fileAttachmentsFilter(search: searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationInput!): [fileAttachment]


    """
    @search-request
    """
    fileAttachmentsConnection(search: searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationCursorInput!): FileAttachmentConnection

    """
    @count-request
    """
    countFilteredFileAttachments(search: searchFileAttachmentInput) : Int
  
    }
type MaterialConnection{
  edges: [MaterialEdge]
  pageInfo: pageInfo!
}

type MaterialEdge{
  cursor: String!
  node: material!
}

  type VueTableMaterial{
    data : [material]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum materialField {
    material_id
    name
    description
    type
    study_ids
    assay_ids
    ontologyAnnotation_ids
    sourceSet_ids
    element_ids
    fileAttachment_ids
  }
  input searchMaterialInput {
    field: materialField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchMaterialInput]
  }

  input orderMaterialInput{
    field: materialField
    order: Order
  }



  type Query {
    materials(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput! ): [material]
    readOneMaterial(material_id: ID!): material
    countMaterials(search: searchMaterialInput ): Int
    vueTableMaterial : VueTableMaterial    csvTableTemplateMaterial: [String]
    materialsConnection(search:searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput! ): MaterialConnection
  }

  type Mutation {
    addMaterial(material_id: ID!, name: String, description: String, type: String, sourceSet_ids: [String], element_ids: [String]   , addStudies:[ID], addAssays:[ID], addAssayResults:[ID], addOntologyAnnotation:[ID], addSourceSets:[ID], addElements:[ID], addFileAttachments:[ID] , skipAssociationsExistenceChecks:Boolean = false): material!
    updateMaterial(material_id: ID!, name: String, description: String, type: String, sourceSet_ids: [String], element_ids: [String]   , addStudies:[ID], removeStudies:[ID] , addAssays:[ID], removeAssays:[ID] , addAssayResults:[ID], removeAssayResults:[ID] , addOntologyAnnotation:[ID], removeOntologyAnnotation:[ID] , addSourceSets:[ID], removeSourceSets:[ID] , addElements:[ID], removeElements:[ID] , addFileAttachments:[ID], removeFileAttachments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): material!
    deleteMaterial(material_id: ID!): String!
    bulkAddMaterialCsv: String!
      }
`;