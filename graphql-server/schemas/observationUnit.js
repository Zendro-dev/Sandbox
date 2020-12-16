module.exports = `
  type observationUnit{
    """
    @original-field
    """
    observationUnitDbId: ID
    """
    @original-field
    
    """
    observationLevel: String

    """
    @original-field
    
    """
    observationUnitName: String

    """
    @original-field
    
    """
    observationUnitPUI: String

    """
    @original-field
    
    """
    plantNumber: String

    """
    @original-field
    
    """
    plotNumber: String

    """
    @original-field
    
    """
    programDbId: String

    """
    @original-field
    
    """
    studyDbId: String

    """
    @original-field
    
    """
    trialDbId: String

    """
    @original-field
    
    """
    germplasmDbId: String

    """
    @original-field
    
    """
    locationDbId: String

    """
    @original-field
    
    """
    eventDbIds: [String]

    observationUnitPosition(search: searchObservationUnitPositionInput): observationUnitPosition
  germplasm(search: searchGermplasmInput): germplasm
  location(search: searchLocationInput): location
  program(search: searchProgramInput): program
  study(search: searchStudyInput): study
  trial(search: searchTrialInput): trial
    
    """
    @search-request
    """
    observationTreatmentsFilter(search: searchObservationTreatmentInput, order: [ orderObservationTreatmentInput ], pagination: paginationInput!): [observationTreatment]


    """
    @search-request
    """
    observationTreatmentsConnection(search: searchObservationTreatmentInput, order: [ orderObservationTreatmentInput ], pagination: paginationCursorInput!): ObservationTreatmentConnection

    """
    @count-request
    """
    countFilteredObservationTreatments(search: searchObservationTreatmentInput) : Int
  
    """
    @search-request
    """
    observationsFilter(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationInput!): [observation]


    """
    @search-request
    """
    observationsConnection(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput!): ObservationConnection

    """
    @count-request
    """
    countFilteredObservations(search: searchObservationInput) : Int
  
    """
    @search-request
    """
    imagesFilter(search: searchImageInput, order: [ orderImageInput ], pagination: paginationInput!): [image]


    """
    @search-request
    """
    imagesConnection(search: searchImageInput, order: [ orderImageInput ], pagination: paginationCursorInput!): ImageConnection

    """
    @count-request
    """
    countFilteredImages(search: searchImageInput) : Int
  
    """
    @search-request
    """
    eventsFilter(search: searchEventInput, order: [ orderEventInput ], pagination: paginationInput!): [event]


    """
    @search-request
    """
    eventsConnection(search: searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput!): EventConnection

    """
    @count-request
    """
    countFilteredEvents(search: searchEventInput) : Int
  
    }
type ObservationUnitConnection{
  edges: [ObservationUnitEdge]
  pageInfo: pageInfo!
}

type ObservationUnitEdge{
  cursor: String!
  node: observationUnit!
}

  type VueTableObservationUnit{
    data : [observationUnit]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum observationUnitField {
    observationUnitDbId
    observationLevel
    observationUnitName
    observationUnitPUI
    plantNumber
    plotNumber
    programDbId
    studyDbId
    trialDbId
    germplasmDbId
    locationDbId
    eventDbIds
  }
  input searchObservationUnitInput {
    field: observationUnitField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchObservationUnitInput]
  }

  input orderObservationUnitInput{
    field: observationUnitField
    order: Order
  }

  input bulkAssociationObservationUnitWithGermplasmDbIdInput{
    observationUnitDbId: ID!
    germplasmDbId: ID!
  }  input bulkAssociationObservationUnitWithLocationDbIdInput{
    observationUnitDbId: ID!
    locationDbId: ID!
  }  input bulkAssociationObservationUnitWithProgramDbIdInput{
    observationUnitDbId: ID!
    programDbId: ID!
  }  input bulkAssociationObservationUnitWithStudyDbIdInput{
    observationUnitDbId: ID!
    studyDbId: ID!
  }  input bulkAssociationObservationUnitWithTrialDbIdInput{
    observationUnitDbId: ID!
    trialDbId: ID!
  }

  type Query {
    observationUnits(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationInput! ): [observationUnit]
    readOneObservationUnit(observationUnitDbId: ID!): observationUnit
    countObservationUnits(search: searchObservationUnitInput ): Int
    vueTableObservationUnit : VueTableObservationUnit    csvTableTemplateObservationUnit: [String]
    observationUnitsConnection(search:searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput! ): ObservationUnitConnection
  }

  type Mutation {
    addObservationUnit(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String, plotNumber: String , addObservationUnitPosition:ID, addGermplasm:ID, addLocation:ID, addProgram:ID, addStudy:ID, addTrial:ID  , addObservationTreatments:[ID], addObservations:[ID], addImages:[ID], addEvents:[ID] , skipAssociationsExistenceChecks:Boolean = false): observationUnit!
    updateObservationUnit(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String, plotNumber: String , addObservationUnitPosition:ID, removeObservationUnitPosition:ID , addGermplasm:ID, removeGermplasm:ID , addLocation:ID, removeLocation:ID , addProgram:ID, removeProgram:ID , addStudy:ID, removeStudy:ID , addTrial:ID, removeTrial:ID   , addObservationTreatments:[ID], removeObservationTreatments:[ID] , addObservations:[ID], removeObservations:[ID] , addImages:[ID], removeImages:[ID] , addEvents:[ID], removeEvents:[ID]  , skipAssociationsExistenceChecks:Boolean = false): observationUnit!
    deleteObservationUnit(observationUnitDbId: ID!): String!
    bulkAddObservationUnitCsv: String!
    bulkAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithGermplasmDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithGermplasmDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateObservationUnitWithLocationDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithLocationDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitWithLocationDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithLocationDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateObservationUnitWithProgramDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithProgramDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitWithProgramDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithProgramDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateObservationUnitWithStudyDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithStudyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitWithStudyDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithStudyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateObservationUnitWithTrialDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithTrialDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitWithTrialDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithTrialDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;