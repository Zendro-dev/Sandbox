module.exports = `
  type Accession{
    """
    @original-field
    """
    accession_id: ID
    """
    @original-field
    
    """
    collectors_name: String

    """
    @original-field
    
    """
    collectors_initials: String

    """
    @original-field
    
    """
    sampling_date: Date

    """
    @original-field
    
    """
    locationId: String

    location(search: searchLocationInput): Location
    
    """
    @search-request
    """
    measurementsFilter(search: searchMeasurementInput, order: [ orderMeasurementInput ], pagination: paginationInput): [Measurement]


    """
    @search-request
    """
    measurementsConnection(search: searchMeasurementInput, order: [ orderMeasurementInput ], pagination: paginationCursorInput): MeasurementConnection

    """
    @count-request
    """
    countFilteredMeasurements(search: searchMeasurementInput) : Int
  
    }
type AccessionConnection{
  edges: [AccessionEdge]
  pageInfo: pageInfo!
}

type AccessionEdge{
  cursor: String!
  node: Accession!
}

  type VueTableAccession{
    data : [Accession]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum AccessionField {
    accession_id
    collectors_name
    collectors_initials
    sampling_date
    locationId
  }
  input searchAccessionInput {
    field: AccessionField
    value: typeValue
    operator: Operator
    search: [searchAccessionInput]
  }

  input orderAccessionInput{
    field: AccessionField
    order: Order
  }
  type Query {
    accessions(search: searchAccessionInput, order: [ orderAccessionInput ], pagination: paginationInput ): [Accession]
    readOneAccession(accession_id: ID!): Accession
    countAccessions(search: searchAccessionInput ): Int
    vueTableAccession : VueTableAccession    csvTableTemplateAccession: [String]

    accessionsConnection(search:searchAccessionInput, order: [ orderAccessionInput ], pagination: paginationCursorInput ): AccessionConnection
  }
    type Mutation {
    addAccession(accession_id: ID!, collectors_name: String, collectors_initials: String, sampling_date: Date , addLocation:ID  , addMeasurements:[ID] , skipAssociationsExistenceChecks:Boolean = false): Accession!
    updateAccession(accession_id: ID!, collectors_name: String, collectors_initials: String, sampling_date: Date , addLocation:ID, removeLocation:ID   , addMeasurements:[ID], removeMeasurements:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Accession!
  deleteAccession(accession_id: ID!): String!
  bulkAddAccessionCsv: String! }

`;