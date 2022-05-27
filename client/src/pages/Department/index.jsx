import { department } from '@/services/department'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'

const Department = () => {
  const request = async (params, soter, filter) => {
    const result = await department()
    return {
      total: 200,
      data: result.data.department,
      success: true
    }
  }

  return (
    <PageContainer>
      <ProTable
        columns={[
          {
            title: '院系名称',
            key: 'dep_name',
            dataIndex: 'dep_name',
            valueType: 'string'
          },
          {
            title: '成立时间',
            key: 'dep_date',
            dataIndex: 'dep_date',
            valueType: 'dateTime'
          },
          {
            title: '人数',
            key: 'dep_count',
            dataIndex: 'dep_count',
            valueType: 'digit'
          },
          {
            title: '联系电话',
            key: 'dep_phone',
            dataIndex: 'dep_phone',
            valueType: 'string'
          },
          {
            title: '通讯地址',
            key: 'dep_address',
            dataIndex: 'dep_address',
            valueType: 'string'
          },

          {
            title: '操作',
            key: 'option',
            width: 120,
            valueType: 'option',
            render: (_, row, index, action) => [
              <a
                key="a"
                onClick={() => {
                  action === null || action === void 0 ? void 0 : action.startEditable(row.key)
                }}
              >
                编辑
              </a>
            ]
          }
        ]}
        request={request}
        rowKey="key"
        headerTitle="所有部门"
      />
    </PageContainer>
  )
}
export default Department
