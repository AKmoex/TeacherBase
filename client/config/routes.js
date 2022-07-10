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
    name: '工作后台',
    icon: 'Dashboard',
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
    path: '/tuser',
    name: '个人设置',
    icon: 'crown',

    //component: './Teacher',
    routes: [
      {
        path: '/tuser/edit/',
        name: '个人信息',
        icon: 'smile',
        component: './TUser/EditTeacher'
      },
      {
        path: '/tuser/archive',
        name: '个人奖惩',
        icon: 'smile',
        component: './TUser/ArchiveList'
      },
      {
        path: '/tuser/research',
        name: '个人科研',
        icon: 'smile',
        component: './TUser/ResearchList'
      },

      {
        component: './404'
      }
    ]
  },
  {
    name: '院系管理',
    icon: 'Cluster',
    path: '/department',
    component: './Department',
    access: 'canAdmin'
  },
  {
    name: '科研管理',
    icon: 'Audit',
    path: '/research',
    component: './Research',
    access: 'canAdmin'
  },
  {
    name: '奖惩管理',
    icon: 'Calculator',
    path: '/archive',
    component: './Archive',
    access: 'canAdmin'
  },
  {
    name: '备份恢复',
    icon: 'CloudServer',
    path: '/backup',
    component: './Backup',
    access: 'canAdmin'
  },
  {
    name: '定时备份',
    icon: 'CloudServer',
    path: '/schedule',
    component: './Schedule',
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
