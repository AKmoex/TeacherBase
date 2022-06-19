import { department as getAllDepartment } from '@/services/department'
import { teacher } from '@/services/teacher'
import { DownOutlined } from '@ant-design/icons'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Space } from '@arco-design/web-react'
import { Select as AntdSelect } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import AddTeacherModal from './components/AddTeacherModal'
const Teacher = () => {
  const [data, setData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [columnsStateMap, setColumnsStateMap] = useState({
    tea_term_date: {
      show: false
    },
    tea_entry_date: {
      show: false
    },
    tea_ethnicity: {
      show: false
    },
    tea_birthday: {
      show: false
    },
    tea_political: {
      show: false
    },
    tea_gender: {
      show: false
    },
    tea_address: {
      show: false
    }
  })
  const [department, setDepartment] = useState({})
  useEffect(async () => {
    const res = await getAllDepartment({ keyword: '%' })
    const d = {}
    d['全部'] = {
      text: '全部'
    }
    console.log(res.data.department)
    const temp = res.data.department.map((item, index) => {
      const text = item.dep_name
      d[item.dep_name] = { text }
    })
    setDepartment(d)
  }, [])
  const addTeacherModalRef = useRef()

  const request = async (params, soter, filter) => {
    console.log(params)
    if (params.tea_title && params.tea_title.length > 0) {
      let ttt = params.tea_title.join(',')
      params.tea_title = ttt
    }
    const result = await teacher(params)
    let d = result.data.teacher
    for (let i = 0; i < d.length; i++) {
      console.log(d[i])
      if (d[i].tea_term_date == null) {
        d[i].tea_status = '在职'
      } else {
        d[i].tea_status = '已离职'
      }
      if (d[i].tea_gender == 1) {
        d[i].tea_gender = '男'
      } else if (d[i].tea_gender == 2) {
        d[i].tea_gender = '女'
      } else {
        d[i].tea_gender = null
      }
    }
    setData(d)
    return {
      total: d.length,
      data: d,
      success: true
    }
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys)
  }
  const MySelect = (props) => {
    const { state } = props
    const [innerOptions, setOptions] = useState([])
    useEffect(() => {
      setOptions([
        {
          label: '教授',
          value: '教授'
        },
        {
          label: '副教授',
          value: '副教授'
        },
        {
          label: '院士',
          value: '院士'
        },
        {
          label: '特任研究院',
          value: '特任研究院'
        },
        {
          label: '特任教授',
          value: '特任教授'
        },
        {
          label: '助理教授',
          value: '助理教授'
        },
        {
          label: '讲师',
          value: '讲师'
        }
      ])
    }, [JSON.stringify(state)])

    return (
      <AntdSelect
        mode="multiple"
        options={innerOptions}
        value={props.value}
        onChange={props.onChange}
      />
    )
  }
  const columns = [
    {
      title: '工号',
      dataIndex: 'tea_id'
      //render: (_) => <a>{_}</a>
    },
    {
      title: '姓名',
      dataIndex: 'tea_name'
      //render: (_) => <a>{_}</a>
    },
    {
      title: '性别',
      dataIndex: 'tea_gender',
      //render: (_) => <a>{_}</a>
      valueType: 'radio',
      //initialValue: '全部',
      valueEnum: {
        全部: { text: '全部' },
        男: { text: '男' },
        女: { text: '女' }
      }
    },
    {
      title: '手机号码',
      dataIndex: 'tea_phone'
    },
    {
      title: '邮箱',
      dataIndex: 'tea_email',
      hideInSearch: true
    },
    {
      title: '出生日期',
      dataIndex: 'tea_birthday',
      hideInSearch: true
    },
    {
      title: '照片',
      dataIndex: 'tea_photo',
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: '所属院系',
      dataIndex: 'tea_department_name',
      valueType: 'select',
      valueEnum: department
    },
    {
      title: '民族',
      dataIndex: 'tea_ethnicity',
      hideInSearch: true
    },
    {
      title: '政治面貌',
      dataIndex: 'tea_political',
      valueType: 'select',
      valueEnum: {
        全部: { text: '全部' },
        中共党员: { text: '中共党员' },
        中共预备党员: { text: '中共预备党员' },
        共青团员: { text: '共青团员' },
        无党派人士: { text: '无党派人士' },
        群众: { text: '群众' },
        其他: { text: '其他' }
      }
    },
    {
      title: '通讯地址',
      dataIndex: 'tea_address',
      hideInSearch: true
    },
    {
      title: '职称',
      dataIndex: 'tea_title',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return <MySelect {...rest} />
      }
    },
    {
      title: '状态',
      dataIndex: 'tea_status',
      //filters: true,
      valueEnum: {
        在职: { text: '在职', status: 'Success' },
        已离职: { text: '已离职', status: 'Error' }
      }
    },
    {
      title: '入职时间',
      key: 'tea_entry_date',
      dataIndex: 'tea_entry_date',
      valueType: 'date',
      hideInSearch: true,
      sorter: (a, b) => a.tea_entry_date - b.tea_entry_date
    },
    {
      title: '离职时间',
      key: 'tea_term_date',
      dataIndex: 'tea_term_date',
      valueType: 'date',
      hideInSearch: true,
      show: false,
      //hideInSetting: true,

      sorter: (a, b) => a.tea_term_date - b.tea_term_date
    },
    {
      title: '入职时间',
      key: 'dateRange',
      dataIndex: 'createdAtRange',
      valueType: 'dateRange',
      hideInTable: true,
      hideInSetting: true
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
      fixed: 'right',
      render: () => [
        <a key="link">链路</a>,
        <a key="link2">报警</a>,
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

  return (
    <PageContainer>
      <AddTeacherModal cRef={addTeacherModalRef} />
      <ProTable
        columns={columns}
        request={request}
        rowKey="tea_id"
        pagination={{
          showQuickJumper: true
        }}
        search={{
          //optionRender: false,
          collapsed: false
        }}
        options={{
          fullScreen: true
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: setColumnsStateMap
        }}
        rowSelection={rowSelection}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a>批量删除</a>
              <a>导出数据</a>
            </Space>
          )
        }}
        //dateFormatter="string"
        headerTitle="所有教师"
        toolBarRender={() => [
          <Button key="show">查看日志</Button>,
          <Button key="out">
            导出数据
            <DownOutlined />
          </Button>,
          <Button
            type="primary"
            onClick={() => addTeacherModalRef.current.setAddTeacherVisible(true)}
            key="primary"
          >
            添加教师
          </Button>
        ]}
      />
    </PageContainer>
  )
}
export default Teacher
