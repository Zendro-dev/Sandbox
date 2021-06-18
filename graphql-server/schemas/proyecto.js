module.exports = `
  type proyecto{
    """
    @original-field
    """
    proyecto_id: ID
    """
    @original-field
    
    """
    NombreProyecto: String

    """
    @original-field
    
    """
    InstitucionProyecto: String

    """
    @original-field
    
    """
    FechaInicioProyecto: Date

    """
    @original-field
    
    """
    FechaFinProyecto: Date

      
    """
    @search-request
    """
    registro_siagroFilter(search: searchRegistro_siagroInput, order: [ orderRegistro_siagroInput ], pagination: paginationInput!): [registro_siagro]


    """
    @search-request
    """
    registro_siagroConnection(search: searchRegistro_siagroInput, order: [ orderRegistro_siagroInput ], pagination: paginationCursorInput!): Registro_siagroConnection

    """
    @count-request
    """
    countFilteredRegistro_siagro(search: searchRegistro_siagroInput) : Int
  
    }
type ProyectoConnection{
  edges: [ProyectoEdge]
  proyectos: [proyecto]
  pageInfo: pageInfo!
}

type ProyectoEdge{
  cursor: String!
  node: proyecto!
}

  type VueTableProyecto{
    data : [proyecto]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum proyectoField {
    proyecto_id
    NombreProyecto
    InstitucionProyecto
    FechaInicioProyecto
    FechaFinProyecto
  }
  input searchProyectoInput {
    field: proyectoField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchProyectoInput]
  }

  input orderProyectoInput{
    field: proyectoField
    order: Order
  }



  type Query {
    proyectos(search: searchProyectoInput, order: [ orderProyectoInput ], pagination: paginationInput! ): [proyecto]
    readOneProyecto(proyecto_id: ID!): proyecto
    countProyectos(search: searchProyectoInput ): Int
    vueTableProyecto : VueTableProyecto
    csvTableTemplateProyecto: [String]
    proyectosConnection(search:searchProyectoInput, order: [ orderProyectoInput ], pagination: paginationCursorInput! ): ProyectoConnection
  }

  type Mutation {
    addProyecto(proyecto_id: ID!, NombreProyecto: String, InstitucionProyecto: String, FechaInicioProyecto: Date, FechaFinProyecto: Date   , addRegistro_siagro:[ID] , skipAssociationsExistenceChecks:Boolean = false): proyecto!
    updateProyecto(proyecto_id: ID!, NombreProyecto: String, InstitucionProyecto: String, FechaInicioProyecto: Date, FechaFinProyecto: Date   , addRegistro_siagro:[ID], removeRegistro_siagro:[ID]  , skipAssociationsExistenceChecks:Boolean = false): proyecto!
    deleteProyecto(proyecto_id: ID!): String!
    bulkAddProyectoCsv: String!
      }
`;