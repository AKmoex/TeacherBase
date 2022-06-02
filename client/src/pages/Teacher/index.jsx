import { teacher } from '@/services/teacher'
import { DownOutlined } from '@ant-design/icons'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import { Button } from '@arco-design/web-react'
import React, { useState } from 'react'

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error'
}

const tableListDataSource = []
const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某']
for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    containers: Math.floor(Math.random() * 20),
    creator: creators[Math.floor(Math.random() * creators.length)],
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    createdAt: Date.now() - Math.floor(Math.random() * 100000),
    memo: i % 2 === 1 ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴' : '简短备注文案'
  })
}
const columns = [
  {
    title: '姓名',
    dataIndex: 'tea_name'
    //render: (_) => <a>{_}</a>
  },
  {
    title: '所属院系',
    dataIndex: 'tea_department'
  },
  {
    title: '邮箱',
    dataIndex: 'tea_email'
  },
  {
    title: '手机号码',
    dataIndex: 'tea_phone'
  },
  {
    title: '通讯地址',
    dataIndex: 'tea_address',
    hideInSearch: true
  },
  {
    title: '职称',
    dataIndex: 'tea_position'
  },
  {
    title: '入职时间',
    key: 'tea_entry_date',
    dataIndex: 'tea_entry_date',
    valueType: 'date',
    sorter: (a, b) => a.entry_date - b.entry_date
  },
  // {
  //   title: '容器数量',
  //   dataIndex: 'containers',
  //   align: 'right',
  //   sorter: (a, b) => a.containers - b.containers
  // },

  // {
  //   title: '状态',
  //   width: 80,
  //   dataIndex: 'status',
  //   initialValue: 'all',
  //   valueEnum: {
  //     all: { text: '全部', status: 'Default' },
  //     close: { text: '关闭', status: 'Default' },
  //     running: { text: '运行中', status: 'Processing' },
  //     online: { text: '已上线', status: 'Success' },
  //     error: { text: '异常', status: 'Error' }
  //   }
  // },
  // {
  //   title: '备注',
  //   dataIndex: 'memo',
  //   ellipsis: true,
  //   copyable: true
  // },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: () => [
      <a key="link">链路</a>,
      <a key="link2">报警</a>,
      <a key="link3">监控</a>,
      <TableDropdown
        key="actionGroup"
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' }
        ]}
      />
    ]
  }
]
const Teacher = () => {
  const [data, setData] = useState([])
  const request = async (params, soter, filter) => {
    const result = await teacher(params)
    setData(result.data.teacher)
    return {
      total: result.data.teacher.length,
      data: result.data.teacher,
      success: true
    }
  }
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={request}
        rowKey="key"
        pagination={{
          showQuickJumper: true
        }}
        search={{
          optionRender: false,
          collapsed: false
        }}
        dateFormatter="string"
        headerTitle="所有教师"
        toolBarRender={() => [
          <Button key="show">查看日志</Button>,
          <Button key="out">
            导出数据
            <DownOutlined />
          </Button>,
          <Button type="primary" key="primary">
            创建应用
          </Button>
        ]}
      />
    </PageContainer>
  )
}
export default Teacher
