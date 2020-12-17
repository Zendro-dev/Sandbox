
export default () => ({
  models: [
    {
      id: 0,
      name: 'caracteristica_cuantitativa',
      title: 'Caracteristica_cuantitativa',
      url: '/main/model/caracteristica_cuantitativa',
    },
    {
      id: 1,
      name: 'metodo',
      title: 'Metodo',
      url: '/main/model/metodo',
    },
    {
      id: 2,
      name: 'referencia',
      title: 'Referencia',
      url: '/main/model/referencia',
    },
    {
      id: 3,
      name: 'taxon',
      title: 'Taxon',
      url: '/main/model/taxon',
    },
  ],
  adminModels: [
    {
      id: 4,
      name: 'role',
      title: 'Role',
      url: '/main/admin/role',
    },
    {
      id: 5,
      name: 'role_to_user',
      title: 'Role_to_user',
      url: '/main/admin/role_to_user',
    },
    {
      id: 6,
      name: 'user',
      title: 'User',
      url: '/main/admin/user',
    },
  ],
})