module.exports = `
  type registro_snib{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    procedenciaejemplar: String

    """
    @original-field
    
    """
    fechacolecta: String

    """
    @original-field
    
    """
    numcolecta: String

    """
    @original-field
    
    """
    ambiente: String

    """
    @original-field
    
    """
    colector: String

    """
    @original-field
    
    """
    coleccion: String

    """
    @original-field
    
    """
    numcatalogo: String

    """
    @original-field
    
    """
    proyecto: String

    """
    @original-field
    
    """
    formadecitar: String

    """
    @original-field
    
    """
    licenciauso: String

    """
    @original-field
    
    """
    urlproyecto: String

    """
    @original-field
    
    """
    urlejemplar: String

    """
    @original-field
    
    """
    version: String

    registro_siagro(search: searchRegistro_siagroInput): registro_siagro
    
    }
type Registro_snibConnection{
  edges: [Registro_snibEdge]
  registro_snibs: [registro_snib]
  pageInfo: pageInfo!
}

type Registro_snibEdge{
  cursor: String!
  node: registro_snib!
}

  type VueTableRegistro_snib{
    data : [registro_snib]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum registro_snibField {
    id
    procedenciaejemplar
    fechacolecta
    numcolecta
    ambiente
    colector
    coleccion
    numcatalogo
    proyecto
    formadecitar
    licenciauso
    urlproyecto
    urlejemplar
    version
  }
  input searchRegistro_snibInput {
    field: registro_snibField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchRegistro_snibInput]
  }

  input orderRegistro_snibInput{
    field: registro_snibField
    order: Order
  }



  type Query {
    registro_snibs(search: searchRegistro_snibInput, order: [ orderRegistro_snibInput ], pagination: paginationInput! ): [registro_snib]
    readOneRegistro_snib(id: ID!): registro_snib
    countRegistro_snibs(search: searchRegistro_snibInput ): Int
    vueTableRegistro_snib : VueTableRegistro_snib
    csvTableTemplateRegistro_snib: [String]
    registro_snibsConnection(search:searchRegistro_snibInput, order: [ orderRegistro_snibInput ], pagination: paginationCursorInput! ): Registro_snibConnection
  }

  type Mutation {
    addRegistro_snib(id: ID!, procedenciaejemplar: String, fechacolecta: String, numcolecta: String, ambiente: String, colector: String, coleccion: String, numcatalogo: String, proyecto: String, formadecitar: String, licenciauso: String, urlproyecto: String, urlejemplar: String, version: String , addRegistro_siagro:ID   , skipAssociationsExistenceChecks:Boolean = false): registro_snib!
    updateRegistro_snib(id: ID!, procedenciaejemplar: String, fechacolecta: String, numcolecta: String, ambiente: String, colector: String, coleccion: String, numcatalogo: String, proyecto: String, formadecitar: String, licenciauso: String, urlproyecto: String, urlejemplar: String, version: String , addRegistro_siagro:ID, removeRegistro_siagro:ID    , skipAssociationsExistenceChecks:Boolean = false): registro_snib!
    deleteRegistro_snib(id: ID!): String!
    bulkAddRegistro_snibCsv: String!
      }
`;