module.exports = `
  type marker_data{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    marker_name: String

    """
    @original-field
    
    """
    nucleotide: String

    """
    @original-field
    
    """
    individual_id: Int

    individual(search: searchIndividualInput): individual
    
    }
type Marker_dataConnection{
  edges: [Marker_dataEdge]
  pageInfo: pageInfo!
}

type Marker_dataEdge{
  cursor: String!
  node: marker_data!
}

  type VueTableMarker_data{
    data : [marker_data]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum marker_dataField {
    id
    marker_name
    nucleotide
    individual_id
  }
  input searchMarker_dataInput {
    field: marker_dataField
    value: typeValue
    operator: Operator
    search: [searchMarker_dataInput]
  }

  input orderMarker_dataInput{
    field: marker_dataField
    order: Order
  }
  type Query {
    marker_data(search: searchMarker_dataInput, order: [ orderMarker_dataInput ], pagination: paginationInput ): [marker_data]
    readOneMarker_data(id: ID!): marker_data
    countMarker_data(search: searchMarker_dataInput ): Int
    vueTableMarker_data : VueTableMarker_data    csvTableTemplateMarker_data: [String]

    marker_dataConnection(search:searchMarker_dataInput, order: [ orderMarker_dataInput ], pagination: paginationCursorInput ): Marker_dataConnection
  }
    type Mutation {
    addMarker_data( marker_name: String, nucleotide: String , addIndividual:ID   , skipAssociationsExistenceChecks:Boolean = false): marker_data!
    updateMarker_data(id: ID!, marker_name: String, nucleotide: String , addIndividual:ID, removeIndividual:ID    , skipAssociationsExistenceChecks:Boolean = false): marker_data!
  deleteMarker_data(id: ID!): String!
  bulkAddMarker_dataCsv: String! }

`;