
export default () => ({
  models: [
    {
      id: 0,
      name: 'cuadrante',
      title: 'Cuadrante',
      url: '/main/model/cuadrante',
    },
    {
      id: 1,
      name: 'grupo_enfoque',
      title: 'Grupo_enfoque',
      url: '/main/model/grupo_enfoque',
    },
    {
      id: 2,
      name: 'sitio',
      title: 'Sitio',
      url: '/main/model/sitio',
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
  ]
})