
export default () => ({
  models: [
    {
      id: 0,
      name: 'plant_variant',
      title: 'Plant_variant',
      url: '/main/model/plant_variant',
    },
    {
      id: 1,
      name: 'tomato_Measurement',
      title: 'Tomato_Measurement',
      url: '/main/model/tomato_Measurement',
    },
  ],
  adminModels: [
    {
      id: 2,
      name: 'role',
      title: 'Role',
      url: '/main/admin/role',
    },
    {
      id: 3,
      name: 'role_to_user',
      title: 'Role_to_user',
      url: '/main/admin/role_to_user',
    },
    {
      id: 4,
      name: 'user',
      title: 'User',
      url: '/main/admin/user',
    },
  ]
})