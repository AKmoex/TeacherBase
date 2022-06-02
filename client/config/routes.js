export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login'
      },
      {
        component: './404'
      }
    ]
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome'
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome'
      },
      {
        component: './404'
      }
    ]
  },
  {
    path: '/teacher',
    name: 'list.teacher-list',
    icon: 'crown',
    access: 'canAdmin',
    //component: './Teacher',
    routes: [
      {
        path: '/teacher/list',
        name: 'list.teacher-list',
        icon: 'smile',
        component: './Teacher'
      },
      {
        path: '/teacher/add',
        name: 'list.teacher-add',
        icon: 'smile',
        component: './Teacher/AddTeacher'
      },
      {
        component: './404'
      }
    ]
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList'
  },
  {
    name: 'list.department',
    icon: 'table',
    path: '/department',
    component: './Department',
    access: 'canAdmin'
  },

  {
    path: '/',
    redirect: '/welcome'
  },
  {
    component: './404'
  }
]
