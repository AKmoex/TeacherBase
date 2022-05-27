import { department } from '@/services/department'
import { ProList } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Modal } from '@arco-design/web-react'
import { Space, Tag } from 'antd'
import React, { useState } from 'react'
import { BiMap, BiPhone } from 'react-icons/bi'

const Department = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [createVisible, setCreateVisible] = React.useState(false)
  const [createLoading, setCreateLoading] = React.useState(false)

  const request = async (params, soter, filter) => {
    console.log(params)
    const result = await department()

    return {
      total: 200,
      data: result.data.department,
      success: true
    }
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys)
  }
  return (
    <PageContainer>
      <ProList
        options={{
          search: true
        }}
        size={'large'}
        split={true}
        rowSelection={rowSelection}
        toolBarRender={() => {
          return [
            <Button
              key="3"
              type="primary"
              onClick={() => {
                setCreateVisible(true)
              }}
            >
              创建
            </Button>
          ]
        }}
        search={{
          filterType: 'light'
        }}
        rowKey="name"
        headerTitle="所有部门"
        request={request}
        pagination={{
          pageSize: 5
        }}
        showActions="hover"
        metas={{
          title: {
            dataIndex: 'dep_name',
            title: '部门名称',
            render: (_, row) => {
              return (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Space size={0}>{row.dep_name}</Space>
                </div>
              )
            },
            search: false
          },
          avatar: {
            dataIndex: 'avatar',
            search: false
          },
          description: {
            dataIndex: 'dep_name',
            search: false,
            render: (_, row) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center' /* 垂直居中 */,
                    paddingTop: '10'
                  }}
                >
                  <Space size="large">
                    <div>
                      <Space size={'small'}>
                        <div>
                          <BiMap fontSize="19" />
                        </div>
                        <div>{row.dep_address}</div>
                      </Space>
                    </div>

                    <div style={{ marginLeft: '20' }}>
                      <Space size={'small'}>
                        <div>
                          <BiPhone fontSize="19" />
                        </div>
                        <div>{row.dep_phone}</div>
                      </Space>
                    </div>
                  </Space>
                </div>
              )
            }
          },

          subTitle: {
            dataIndex: 'dep_count',
            search: false,

            render: (_, row) => {
              return (
                <div>
                  <Tag color="blue" key={row.dep_count}>
                    在职教师人数：{row.dep_count} 人
                  </Tag>
                </div>
              )
            },
            search: false
          },
          actions: {
            render: (text, row) => [
              <a href={row.url} target="_blank" rel="noopener noreferrer" key="link">
                链路
              </a>,
              <a href={row.url} target="_blank" rel="noopener noreferrer" key="warning">
                报警
              </a>,
              <a href={row.url} target="_blank" rel="noopener noreferrer" key="view">
                查看
              </a>
            ],
            search: false
          }
        }}
      />
      <Modal
        title="Modal Title"
        visible={createVisible}
        footer={
          <>
            <Button
              onClick={() => {
                setCreateVisible(false)
              }}
            >
              Return
            </Button>
            <Button
              loading={createLoading}
              onClick={() => {
                setCreateLoading(true)
                setTimeout(() => {
                  setCreateLoading(false)
                  setCreateVisible(false)
                }, 1500)
              }}
              type="primary"
              style={{ marginLeft: 12 }}
            >
              Submit
            </Button>
          </>
        }
        onCancel={() => {
          setCreateVisible(false)
        }}
      >
        <p>Some content...</p>
        <p>Some content...</p>
        <p>Some content...</p>
        <p>Some content...</p>
        <p>Some content...</p>
      </Modal>
    </PageContainer>
  )
}
export default Department
