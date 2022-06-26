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
    path: '/teacher',
    name: '教师管理',
    icon: 'crown',
    access: 'canAdmin',
    //component: './Teacher',
    routes: [
      {
        path: '/teacher/list',
        name: '所有教师',
        icon: 'smile',
        component: './Teacher'
      },
      {
        path: '/teacher/add',
        name: '添加教师',
        icon: 'smile',
        component: './Teacher/AddTeacher'
      },
      {
        path: '/teacher/edit/:id',
        name: '编辑教师信息',
        icon: 'smile',
        component: './Teacher/EditTeacher',
        hideInMenu: true
      },
      {
        component: './404'
      }
    ]
  },
  {
    name: '院系管理',
    icon: 'table',
    path: '/department',
    component: './Department',
    access: 'canAdmin'
  },
  {
    name: '科研管理',
    icon: 'table',
    path: '/research',
    component: './Research',
    access: 'canAdmin'
  },
  {
    name: '奖惩管理',
    icon: 'table',
    path: '/archive',
    component: './Archive',
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
