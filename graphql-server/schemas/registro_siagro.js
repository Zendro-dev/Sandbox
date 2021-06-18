module.exports = `
  type registro_siagro{
    """
    @original-field
    """
    siagro_id: ID
    """
    @original-field
    
    """
    IndividuosCopias: Int

    """
    @original-field
    
    """
    TipoPreparacion: String

    """
    @original-field
    
    """
    FuenteColectaObservacion: String

    """
    @original-field
    
    """
    Habitat: String

    """
    @original-field
    
    """
    EstatusEcologico: String

    """
    @original-field
    
    """
    PlantaManejada: String

    """
    @original-field
    
    """
    MaterialColectado: String

    """
    @original-field
    
    """
    FormaVida: String

    """
    @original-field
    
    """
    FormaCrecimiento: String

    """
    @original-field
    
    """
    Sexo: String

    """
    @original-field
    
    """
    Fenologia: String

    """
    @original-field
    
    """
    AlturaEjemplar: Float

    """
    @original-field
    
    """
    Abundancia: String

    """
    @original-field
    
    """
    OtrasObservacionesEjemplar: String

    """
    @original-field
    
    """
    Uso: String

    """
    @original-field
    
    """
    ParteUtilizada: String

    """
    @original-field
    
    """
    LenguaNombreComun: String

    """
    @original-field
    
    """
    NombreComun: String

    """
    @original-field
    
    """
    InstitucionRespaldaObservacion: String

    """
    @original-field
    
    """
    TipoVegetacion: String

    """
    @original-field
    
    """
    AutorizacionInformacion: String

    """
    @original-field
    
    """
    donante_id: Int

    """
    @original-field
    
    """
    proyecto_id: String

    """
    @original-field
    
    """
    snib_id: String

    proyecto(search: searchProyectoInput): proyecto
  manejo(search: searchManejoInput): manejo
  sitio(search: searchSitioInput): sitio
  taxon(search: searchTaxonInput): taxon
  donante(search: searchDonanteInput): donante
  determinacion(search: searchDeterminacionInput): determinacion
  registro_snib(search: searchRegistro_snibInput): registro_snib
    
    }
type Registro_siagroConnection{
  edges: [Registro_siagroEdge]
  registro_siagros: [registro_siagro]
  pageInfo: pageInfo!
}

type Registro_siagroEdge{
  cursor: String!
  node: registro_siagro!
}

  type VueTableRegistro_siagro{
    data : [registro_siagro]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum registro_siagroField {
    siagro_id
    IndividuosCopias
    TipoPreparacion
    FuenteColectaObservacion
    Habitat
    EstatusEcologico
    PlantaManejada
    MaterialColectado
    FormaVida
    FormaCrecimiento
    Sexo
    Fenologia
    AlturaEjemplar
    Abundancia
    OtrasObservacionesEjemplar
    Uso
    ParteUtilizada
    LenguaNombreComun
    NombreComun
    InstitucionRespaldaObservacion
    TipoVegetacion
    AutorizacionInformacion
    donante_id
    proyecto_id
    snib_id
  }
  input searchRegistro_siagroInput {
    field: registro_siagroField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchRegistro_siagroInput]
  }

  input orderRegistro_siagroInput{
    field: registro_siagroField
    order: Order
  }

  input bulkAssociationRegistro_siagroWithProyecto_idInput{
    siagro_id: ID!
    proyecto_id: ID!
  }  input bulkAssociationRegistro_siagroWithSnib_idInput{
    siagro_id: ID!
    snib_id: ID!
  }  input bulkAssociationRegistro_siagroWithSnib_idInput{
    siagro_id: ID!
    snib_id: ID!
  }  input bulkAssociationRegistro_siagroWithDonante_idInput{
    siagro_id: ID!
    donante_id: ID!
  }  input bulkAssociationRegistro_siagroWithSnib_idInput{
    siagro_id: ID!
    snib_id: ID!
  }  input bulkAssociationRegistro_siagroWithSnib_idInput{
    siagro_id: ID!
    snib_id: ID!
  }

  type Query {
    registro_siagros(search: searchRegistro_siagroInput, order: [ orderRegistro_siagroInput ], pagination: paginationInput! ): [registro_siagro]
    readOneRegistro_siagro(siagro_id: ID!): registro_siagro
    countRegistro_siagros(search: searchRegistro_siagroInput ): Int
    vueTableRegistro_siagro : VueTableRegistro_siagro
    csvTableTemplateRegistro_siagro: [String]
    registro_siagrosConnection(search:searchRegistro_siagroInput, order: [ orderRegistro_siagroInput ], pagination: paginationCursorInput! ): Registro_siagroConnection
  }

  type Mutation {
    addRegistro_siagro(siagro_id: ID!, IndividuosCopias: Int, TipoPreparacion: String, FuenteColectaObservacion: String, Habitat: String, EstatusEcologico: String, PlantaManejada: String, MaterialColectado: String, FormaVida: String, FormaCrecimiento: String, Sexo: String, Fenologia: String, AlturaEjemplar: Float, Abundancia: String, OtrasObservacionesEjemplar: String, Uso: String, ParteUtilizada: String, LenguaNombreComun: String, NombreComun: String, InstitucionRespaldaObservacion: String, TipoVegetacion: String, AutorizacionInformacion: String , addProyecto:ID, addManejo:ID, addSitio:ID, addTaxon:ID, addDonante:ID, addDeterminacion:ID, addRegistro_snib:ID   , skipAssociationsExistenceChecks:Boolean = false): registro_siagro!
    updateRegistro_siagro(siagro_id: ID!, IndividuosCopias: Int, TipoPreparacion: String, FuenteColectaObservacion: String, Habitat: String, EstatusEcologico: String, PlantaManejada: String, MaterialColectado: String, FormaVida: String, FormaCrecimiento: String, Sexo: String, Fenologia: String, AlturaEjemplar: Float, Abundancia: String, OtrasObservacionesEjemplar: String, Uso: String, ParteUtilizada: String, LenguaNombreComun: String, NombreComun: String, InstitucionRespaldaObservacion: String, TipoVegetacion: String, AutorizacionInformacion: String , addProyecto:ID, removeProyecto:ID , addManejo:ID, removeManejo:ID , addSitio:ID, removeSitio:ID , addTaxon:ID, removeTaxon:ID , addDonante:ID, removeDonante:ID , addDeterminacion:ID, removeDeterminacion:ID , addRegistro_snib:ID, removeRegistro_snib:ID    , skipAssociationsExistenceChecks:Boolean = false): registro_siagro!
    deleteRegistro_siagro(siagro_id: ID!): String!
    bulkAddRegistro_siagroCsv: String!
    bulkAssociateRegistro_siagroWithProyecto_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithProyecto_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateRegistro_siagroWithProyecto_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithProyecto_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithSnib_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithSnib_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithSnib_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithSnib_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateRegistro_siagroWithDonante_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithDonante_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateRegistro_siagroWithDonante_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithDonante_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithSnib_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithSnib_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithSnib_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput: [bulkAssociationRegistro_siagroWithSnib_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;