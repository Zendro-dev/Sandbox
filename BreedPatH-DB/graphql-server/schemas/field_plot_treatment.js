module.exports = `
  type field_plot_treatment{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    start_date: String

    """
    @original-field
    
    """
    end_date: String

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
    chemical: String

    """
    @original-field
    
    """
    pesticide_type: String

    """
    @original-field
    
    """
    field_plot_id: Int

    field_plot(search: searchField_plotInput): field_plot
    
    }
type Field_plot_treatmentConnection{
  edges: [Field_plot_treatmentEdge]
  pageInfo: pageInfo!
}

type Field_plot_treatmentEdge{
  cursor: String!
  node: field_plot_treatment!
}

  type VueTableField_plot_treatment{
    data : [field_plot_treatment]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum field_plot_treatmentField {
    id
    start_date
    end_date
    name
    description
    chemical
    pesticide_type
    field_plot_id
  }
  input searchField_plot_treatmentInput {
    field: field_plot_treatmentField
    value: typeValue
    operator: Operator
    search: [searchField_plot_treatmentInput]
  }

  input orderField_plot_treatmentInput{
    field: field_plot_treatmentField
    order: Order
  }
  type Query {
    field_plot_treatments(search: searchField_plot_treatmentInput, order: [ orderField_plot_treatmentInput ], pagination: paginationInput ): [field_plot_treatment]
    readOneField_plot_treatment(id: ID!): field_plot_treatment
    countField_plot_treatments(search: searchField_plot_treatmentInput ): Int
    vueTableField_plot_treatment : VueTableField_plot_treatment    csvTableTemplateField_plot_treatment: [String]

    field_plot_treatmentsConnection(search:searchField_plot_treatmentInput, order: [ orderField_plot_treatmentInput ], pagination: paginationCursorInput ): Field_plot_treatmentConnection
  }
    type Mutation {
    addField_plot_treatment( start_date: String, end_date: String, name: String, description: String, chemical: String, pesticide_type: String , addField_plot:ID   , skipAssociationsExistenceChecks:Boolean = false): field_plot_treatment!
    updateField_plot_treatment(id: ID!, start_date: String, end_date: String, name: String, description: String, chemical: String, pesticide_type: String , addField_plot:ID, removeField_plot:ID    , skipAssociationsExistenceChecks:Boolean = false): field_plot_treatment!
  deleteField_plot_treatment(id: ID!): String!
  bulkAddField_plot_treatmentCsv: String! }

`;