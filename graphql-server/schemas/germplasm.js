module.exports = `
  type germplasm{
    """
    @original-field
    """
    germplasmDbId: ID
    """
    @original-field
    
    """
    accessionNumber: String

    """
    @original-field
    
    """
    acquisitionDate: Date

    """
    @original-field
    
    """
    breedingMethodDbId: String

    """
    @original-field
    
    """
    commonCropName: String

    """
    @original-field
    
    """
    countryOfOriginCode: String

    """
    @original-field
    
    """
    defaultDisplayName: String

    """
    @original-field
    
    """
    documentationURL: String

    """
    @original-field
    
    """
    germplasmGenus: String

    """
    @original-field
    
    """
    germplasmName: String

    """
    @original-field
    
    """
    germplasmPUI: String

    """
    @original-field
    
    """
    germplasmPreprocessing: String

    """
    @original-field
    
    """
    germplasmSpecies: String

    """
    @original-field
    
    """
    germplasmSubtaxa: String

    """
    @original-field
    
    """
    instituteCode: String

    """
    @original-field
    
    """
    instituteName: String

    """
    @original-field
    
    """
    pedigree: String

    """
    @original-field
    
    """
    seedSource: String

    """
    @original-field
    
    """
    seedSourceDescription: String

    """
    @original-field
    
    """
    speciesAuthority: String

    """
    @original-field
    
    """
    subtaxaAuthority: String

    """
    @original-field
    
    """
    xref: String

    """
    @original-field
    
    """
    biologicalStatusOfAccessionCode: String

    breedingMethod(search: searchBreedingMethodInput): breedingMethod
    
    """
    @search-request
    """
    observationUnitsFilter(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationInput!): [observationUnit]


    """
    @search-request
    """
    observationUnitsConnection(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput!): ObservationUnitConnection

    """
    @count-request
    """
    countFilteredObservationUnits(search: searchObservationUnitInput) : Int
  
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
  
    }
type GermplasmConnection{
  edges: [GermplasmEdge]
  pageInfo: pageInfo!
}

type GermplasmEdge{
  cursor: String!
  node: germplasm!
}

  type VueTableGermplasm{
    data : [germplasm]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum germplasmField {
    germplasmDbId
    accessionNumber
    acquisitionDate
    breedingMethodDbId
    commonCropName
    countryOfOriginCode
    defaultDisplayName
    documentationURL
    germplasmGenus
    germplasmName
    germplasmPUI
    germplasmPreprocessing
    germplasmSpecies
    germplasmSubtaxa
    instituteCode
    instituteName
    pedigree
    seedSource
    seedSourceDescription
    speciesAuthority
    subtaxaAuthority
    xref
    biologicalStatusOfAccessionCode
  }
  input searchGermplasmInput {
    field: germplasmField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchGermplasmInput]
  }

  input orderGermplasmInput{
    field: germplasmField
    order: Order
  }

  input bulkAssociationGermplasmWithBreedingMethodDbIdInput{
    germplasmDbId: ID!
    breedingMethodDbId: ID!
  }

  type Query {
    germplasms(search: searchGermplasmInput, order: [ orderGermplasmInput ], pagination: paginationInput! ): [germplasm]
    readOneGermplasm(germplasmDbId: ID!): germplasm
    countGermplasms(search: searchGermplasmInput ): Int
    vueTableGermplasm : VueTableGermplasm    csvTableTemplateGermplasm: [String]
    germplasmsConnection(search:searchGermplasmInput, order: [ orderGermplasmInput ], pagination: paginationCursorInput! ): GermplasmConnection
  }

  type Mutation {
    addGermplasm(germplasmDbId: ID!, accessionNumber: String, acquisitionDate: Date, commonCropName: String, countryOfOriginCode: String, defaultDisplayName: String, documentationURL: String, germplasmGenus: String, germplasmName: String, germplasmPUI: String, germplasmPreprocessing: String, germplasmSpecies: String, germplasmSubtaxa: String, instituteCode: String, instituteName: String, pedigree: String, seedSource: String, seedSourceDescription: String, speciesAuthority: String, subtaxaAuthority: String, xref: String, biologicalStatusOfAccessionCode: String , addBreedingMethod:ID  , addObservationUnits:[ID], addObservations:[ID] , skipAssociationsExistenceChecks:Boolean = false): germplasm!
    updateGermplasm(germplasmDbId: ID!, accessionNumber: String, acquisitionDate: Date, commonCropName: String, countryOfOriginCode: String, defaultDisplayName: String, documentationURL: String, germplasmGenus: String, germplasmName: String, germplasmPUI: String, germplasmPreprocessing: String, germplasmSpecies: String, germplasmSubtaxa: String, instituteCode: String, instituteName: String, pedigree: String, seedSource: String, seedSourceDescription: String, speciesAuthority: String, subtaxaAuthority: String, xref: String, biologicalStatusOfAccessionCode: String , addBreedingMethod:ID, removeBreedingMethod:ID   , addObservationUnits:[ID], removeObservationUnits:[ID] , addObservations:[ID], removeObservations:[ID]  , skipAssociationsExistenceChecks:Boolean = false): germplasm!
    deleteGermplasm(germplasmDbId: ID!): String!
    bulkAddGermplasmCsv: String!
    bulkAssociateGermplasmWithBreedingMethodDbId(bulkAssociationInput: [bulkAssociationGermplasmWithBreedingMethodDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateGermplasmWithBreedingMethodDbId(bulkAssociationInput: [bulkAssociationGermplasmWithBreedingMethodDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;