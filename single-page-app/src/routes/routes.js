
export default () => ({
  models: [
    {
      id: 0,
      name: 'imageAttachment',
      title: 'ImageAttachment',
      url: '/main/model/imageAttachment',
    },
    {
      id: 1,
      name: 'person',
      title: 'Person',
      url: '/main/model/person',
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