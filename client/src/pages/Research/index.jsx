import { research } from '@/services/research'
import { DownOutlined } from '@ant-design/icons'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import { Button } from '@arco-design/web-react'
import { Menu } from 'antd'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import AddResearchModal from './components/AddResearchModal'
const columns = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48
  },
  {
    title: '项目名称',
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
    title: '申报人',
    dataIndex: 'teacher_name',
    ellipsis: true
  },
  {
    title: '申报人工号',
    dataIndex: 'teacher_id',
    ellipsis: true
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error'
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true
      },
      processing: {
        text: '解决中',
        status: 'Processing'
      }
    }
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
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          var _a
          ;(_a = action === null || action === void 0 ? void 0 : action.startEditable) === null ||
          _a === void 0
            ? void 0
            : _a.call(action, record.id)
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => (action === null || action === void 0 ? void 0 : action.reload())}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' }
        ]}
      />
    ]
  }
]
const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
)
const Research = () => {
  const actionRef = useRef()
  const addResearchModalRef = useRef()
  const [researchs, setResearchs] = useState([])
  const request = async (params, soter, filter) => {
    if (soter.obtain_date) {
      params.sort = soter.obtain_date
    }
    console.log('nihO', params)
    const result = await research(params)
    let d = result.data.research

    for (let i = 0; i < d.length; i++) {
      d[i].index = i + 1
      d[i].obtain_date = dayjs(d[i].obtain_date).format('YYYY-MM-DD')
    }
    // setData(d)
    setResearchs(d)
    return {
      total: d.length,
      data: d,
      success: true
    }
  }
  const tableReload = () => {
    actionRef.current.reload()
  }
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
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value)
          }
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto'
        }}
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
        toolBarRender={() => [
          <Button key="show">
            你好
            {/* <a href={`/teacher/edit/1`} target="_blank" /> */}
          </Button>,
          <Button key="out">
            导出数据
            <DownOutlined />
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => addResearchModalRef.current.setAddResearchVisible(true)}
          >
            新增项目
          </Button>
        ]}
      />
      <AddResearchModal ref={addResearchModalRef} tableReload={tableReload} />
    </PageContainer>
  )
}
export default Research
