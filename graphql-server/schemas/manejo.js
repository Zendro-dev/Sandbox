module.exports = `
  type manejo{
    """
    @original-field
    """
    manejo_id: ID
    """
    @original-field
    
    """
    TipoManejo: String

    """
    @original-field
    
    """
    TipoAgroecosistema: String

    """
    @original-field
    
    """
    DescripcionAgroecosistema: String

    """
    @original-field
    
    """
    SindromeDomesticacion: String

    """
    @original-field
    
    """
    TenenciaTierra: String

    """
    @original-field
    
    """
    TipoMaterialProduccion: String

    """
    @original-field
    
    """
    OrigenMaterial: String

    """
    @original-field
    
    """
    DestinoProduccion: String

    """
    @original-field
    
    """
    MesSiembra: String

    """
    @original-field
    
    """
    MesFloracion: String

    """
    @original-field
    
    """
    MesFructificacion: String

    """
    @original-field
    
    """
    MesCosecha: String

    """
    @original-field
    
    """
    SistemaCultivo: String

    """
    @original-field
    
    """
    CultivosAsociados: String

    """
    @original-field
    
    """
    UnidadesSuperficieProduccion: String

    """
    @original-field
    
    """
    SuperficieProduccion: Float

    """
    @original-field
    
    """
    UnidadesRendimiento: String

    """
    @original-field
    
    """
    Rendimiento: Float

    """
    @original-field
    
    """
    TipoRiego: String

    """
    @original-field
    
    """
    CaracteristicaResistenciaTolerancia: String

    """
    @original-field
    
    """
    CaracteristicaSusceptible: String

    """
    @original-field
    
    """
    registro_id: String

    registro_siagro(search: searchRegistro_siagroInput): registro_siagro
    
    }
type ManejoConnection{
  edges: [ManejoEdge]
  manejos: [manejo]
  pageInfo: pageInfo!
}

type ManejoEdge{
  cursor: String!
  node: manejo!
}

  type VueTableManejo{
    data : [manejo]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum manejoField {
    manejo_id
    TipoManejo
    TipoAgroecosistema
    DescripcionAgroecosistema
    SindromeDomesticacion
    TenenciaTierra
    TipoMaterialProduccion
    OrigenMaterial
    DestinoProduccion
    MesSiembra
    MesFloracion
    MesFructificacion
    MesCosecha
    SistemaCultivo
    CultivosAsociados
    UnidadesSuperficieProduccion
    SuperficieProduccion
    UnidadesRendimiento
    Rendimiento
    TipoRiego
    CaracteristicaResistenciaTolerancia
    CaracteristicaSusceptible
    registro_id
  }
  input searchManejoInput {
    field: manejoField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchManejoInput]
  }

  input orderManejoInput{
    field: manejoField
    order: Order
  }

  input bulkAssociationManejoWithRegistro_idInput{
    manejo_id: ID!
    registro_id: ID!
  }

  type Query {
    manejos(search: searchManejoInput, order: [ orderManejoInput ], pagination: paginationInput! ): [manejo]
    readOneManejo(manejo_id: ID!): manejo
    countManejos(search: searchManejoInput ): Int
    vueTableManejo : VueTableManejo
    csvTableTemplateManejo: [String]
    manejosConnection(search:searchManejoInput, order: [ orderManejoInput ], pagination: paginationCursorInput! ): ManejoConnection
  }

  type Mutation {
    addManejo(manejo_id: ID!, TipoManejo: String, TipoAgroecosistema: String, DescripcionAgroecosistema: String, SindromeDomesticacion: String, TenenciaTierra: String, TipoMaterialProduccion: String, OrigenMaterial: String, DestinoProduccion: String, MesSiembra: String, MesFloracion: String, MesFructificacion: String, MesCosecha: String, SistemaCultivo: String, CultivosAsociados: String, UnidadesSuperficieProduccion: String, SuperficieProduccion: Float, UnidadesRendimiento: String, Rendimiento: Float, TipoRiego: String, CaracteristicaResistenciaTolerancia: String, CaracteristicaSusceptible: String , addRegistro_siagro:ID   , skipAssociationsExistenceChecks:Boolean = false): manejo!
    updateManejo(manejo_id: ID!, TipoManejo: String, TipoAgroecosistema: String, DescripcionAgroecosistema: String, SindromeDomesticacion: String, TenenciaTierra: String, TipoMaterialProduccion: String, OrigenMaterial: String, DestinoProduccion: String, MesSiembra: String, MesFloracion: String, MesFructificacion: String, MesCosecha: String, SistemaCultivo: String, CultivosAsociados: String, UnidadesSuperficieProduccion: String, SuperficieProduccion: Float, UnidadesRendimiento: String, Rendimiento: Float, TipoRiego: String, CaracteristicaResistenciaTolerancia: String, CaracteristicaSusceptible: String , addRegistro_siagro:ID, removeRegistro_siagro:ID    , skipAssociationsExistenceChecks:Boolean = false): manejo!
    deleteManejo(manejo_id: ID!): String!
    bulkAddManejoCsv: String!
    bulkAssociateManejoWithRegistro_id(bulkAssociationInput: [bulkAssociationManejoWithRegistro_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateManejoWithRegistro_id(bulkAssociationInput: [bulkAssociationManejoWithRegistro_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;