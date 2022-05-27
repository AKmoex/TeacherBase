import { createDepartment, department } from '@/services/department'
import { ProList } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, DatePicker, Form, Input, Modal, Notification } from '@arco-design/web-react'
import { Space, Tag } from 'antd'
import dayjs from 'dayjs'
import React, { useRef, useState } from 'react'
import { BiMap, BiPhone } from 'react-icons/bi'

const FormItem = Form.Item

const cascaderOptions = [
  {
    value: 'beijing',
    label: 'Beijing',
    children: [
      {
        value: 'beijingshi',
        label: 'Beijing',
        children: [
          {
            value: 'chaoyang',
            label: 'Chaoyang',
            children: [
              {
                value: 'datunli',
                label: 'Datunli'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 'shanghai',
    label: 'Shanghai',
    children: [
      {
        value: 'shanghaishi',
        label: 'Shanghai',
        children: [
          {
            value: 'huangpu',
            label: 'Huangpu'
          }
        ]
      }
    ]
  }
]

const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 17
  }
}
const noLabelLayout = {
  wrapperCol: {
    span: 17,
    offset: 7
  }
}

const Department = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [createVisible, setCreateVisible] = React.useState(false)
  const [createLoading, setCreateLoading] = React.useState(false)

  const formRef = useRef()
  //const [form] = Form.useForm()
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values)
  }

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
                    alignItems: 'center',
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
        style={{ paddingLeft: 20, paddingRight: 20 }}
        title="创建新的部门"
        visible={createVisible}
        footer={
          <>
            <Button
              onClick={() => {
                formRef.current.resetFields()
                setCreateVisible(false)
              }}
            >
              取消
            </Button>
            <Button
              loading={createLoading}
              onClick={async () => {
                try {
                  //setCreateLoading(true)
                  await formRef.current.validate()

                  const new_d = {
                    dep_address: formRef.current.getFieldsValue().create_address
                      ? ''
                      : formRef.current.getFieldsValue().create_address,
                    dep_name: formRef.current.getFieldsValue().create_name,
                    dep_phone:
                      formRef.current.getFieldsValue().create_phone === undefined
                        ? ''
                        : formRef.current.getFieldsValue().create_phone,
                    dep_date: formRef.current.getFieldsValue().create_date
                  }
                  setCreateLoading(true)
                  const result = await createDepartment(new_d)
                  setCreateLoading(false)
                  // console.log(result.data)
                  if (result.data.success) {
                    Notification.success({
                      title: 'Success',
                      content: result.data.message
                    })
                    setCreateVisible(false)
                  } else {
                    Notification.error({
                      title: 'Failed',
                      content: result.data.message
                    })
                  }

                  //setCreateLoading(true)
                  //Message.success('校验通过')
                } catch (e) {
                  //setCreateLoading(false)
                  //Message.error('校验失败')
                }
              }}
              type="primary"
              style={{ marginLeft: 12 }}
            >
              创建
            </Button>
          </>
        }
        onCancel={() => {
          formRef.current.resetFields()
          setCreateVisible(false)
        }}
      >
        <div style={{ maxWidth: 650 }}>
          <Form
            ref={formRef}
            {...formItemLayout}
            size={'large'}
            onValuesChange={onValuesChange}
            scrollToFirstError
            layout={'vertical'}
            initialValues={{
              create_date: date,
              create_phone: '',
              create_address: ''
            }}
          >
            <FormItem
              label="部门名称"
              field="create_name"
              rules={[{ required: true, message: '请输入部门名称' }]}
            >
              <Input placeholder="please enter department name" />
            </FormItem>
            <FormItem label="通讯地址" field="create_address">
              <Input placeholder="please enter department address" />
            </FormItem>
            <FormItem
              label="联系电话"
              field="create_phone"
              rules={[
                { required: false, message: '请输入联系电话' },
                {
                  match: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
                  message: '联系电话格式错误'
                }
              ]}
            >
              <Input placeholder="please enter department phone" />
            </FormItem>
            <FormItem label="成立时间" field="create_date" rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD" />
            </FormItem>
          </Form>
        </div>
      </Modal>
    </PageContainer>
  )
}
export default Department
