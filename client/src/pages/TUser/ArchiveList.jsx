import { archive } from '@/services/archive'
import { currentUser as queryCurrentUser } from '@/services/user'
import { ProTable } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import { Icon, Input } from '@arco-design/web-react'
import { Menu } from 'antd'
import dayjs from 'dayjs'
import React, { useRef, useState } from 'react'
const TextArea = Input.TextArea

const IconFont = Icon.addFromIconFontCn({
  src: '//at.alicdn.com/t/font_180975_26f1p759rvn.js'
})
const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
)
const ArchiveList = () => {
  const actionRef = useRef()
  const addArchiveModalRef = useRef()
  const editArchiveModalRef = useRef()
  const [archives, setArchive] = useState([])
  const request = async (params, soter, filter) => {
    const msg = await queryCurrentUser()
    console.log(msg.data)
    params.teacher_id = msg.data.id
    if (soter.obtain_date) {
      params.sort = soter.obtain_date
    }
    console.log('nihO', params)
    const result = await archive(params)
    let d = result.data.archive

    for (let i = 0; i < d.length; i++) {
      d[i].index = i + 1
      d[i].obtain_date = dayjs(d[i].obtain_date).format('YYYY-MM-DD')
    }
    // setData(d)
    setArchive(d)
    return {
      total: d.length,
      data: d,
      success: true
    }
  }
  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      hideInSearch: true,
      hideInSetting: true
    },
    {
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: '奖惩名称',
      dataIndex: 'title',
      copyable: true,
      ellipsis: true,
      tip: '名称过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项'
          }
        ]
      }
    },
    {
      title: '人员',
      dataIndex: 'teacher_name',
      ellipsis: true
    },
    {
      title: '人员工号',
      dataIndex: 'teacher_id',

      ellipsis: true
    },

    {
      title: '时间',
      key: 'obtain_date',
      dataIndex: 'obtain_date',
      valueType: 'date',
      sorter: (a, b) => a.obtain_date - b.obtain_date,
      hideInSearch: true,
      onFilter: true
    },
    {
      title: '说明',
      key: 'detail',
      dataIndex: 'detail',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '时间范围',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1]
          }
        }
      }
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
      valueEnum: {
        0: { text: '奖励', status: 'Success' },
        1: { text: '惩罚', status: 'Error' }
      }
    }
  ]

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={request}
        editable={{
          type: 'multiple'
        }}
        search={false}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value)
          }
        }}
        rowKey="id"
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return Object.assign(Object.assign({}, values), {
                created_at: [values.startTime, values.endTime]
              })
            }
            return values
          }
        }}
        options={{
          fullScreen: true
        }}
        pagination={{
          pageSize: 10,
          onChange: (page) => console.log(page)
        }}
        dateFormatter="string"
        headerTitle="所有科研项目"
      />
    </PageContainer>
  )
}
export default ArchiveList
