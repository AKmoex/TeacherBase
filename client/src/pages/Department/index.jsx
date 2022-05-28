import {
  createDepartment,
  deleteDepartment,
  deleteDepartmentMultiple,
  department
} from '@/services/department'
import { ProList } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Notification,
  Popconfirm
} from '@arco-design/web-react'
import { Button as AButton, Space, Tag } from 'antd'
import dayjs from 'dayjs'
import { isNil } from 'lodash'
import React, { useRef, useState } from 'react'
import { BiMap, BiPhone } from 'react-icons/bi'
const ExportJsonExcel = require('js-export-excel')

const FormItem = Form.Item

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

const renderDescription = (row) => {
  if (isNil(row.dep_address) && isNil(row.dep_phone)) {
    return <></>
  } else if (isNil(row.dep_address)) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: '10'
        }}
      >
        <Space size="large">
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
  } else if (isNil(row.dep_phone)) {
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
        </Space>
      </div>
    )
  } else {
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
}
const Department = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [createVisible, setCreateVisible] = React.useState(false)
  const [createLoading, setCreateLoading] = React.useState(false)
  const [data, setData] = useState([])

  const formRef = useRef()
  const tableRef = useRef()

  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values)
  }

  const request = async (params, soter, filter) => {
    console.log(params)
    const result = await department(params)
    console.log(result.data.department)
    setData(result.data.department)
    return {
      total: result.data.department.length,
      data: result.data.department,
      success: true
    }
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys)
  }
  const excelDownload = () => {
    const downloadData = []
    if (selectedRowKeys.length == 0) {
      for (let i = 0; i < data.length; i++) {
        downloadData.push({
          部门名称: data[i].dep_name,
          通讯地址: data[i].dep_address,
          联系电话: data[i].dep_phone,
          成立时间: dayjs(data[i].dep_date).format('YYYY-MM-DD'),
          在职教师人数: data[i].dep_count
        })
      }
    } else {
      for (let i = 0; i < selectedRowKeys.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (selectedRowKeys[i] == data[j].dep_id) {
            downloadData.push({
              部门名称: data[j].dep_name,
              通讯地址: data[j].dep_address,
              联系电话: data[j].dep_phone,
              成立时间: dayjs(data[j].dep_date).format('YYYY-MM-DD'),
              在职教师人数: data[j].dep_count
            })
            break
          }
        }
      }
    }

    var option = {}

    option.fileName = '部门信息表'
    option.datas = [
      {
        sheetData: downloadData,
        sheetName: 'sheet',
        sheetFilter: ['部门名称', '通讯地址', '联系电话', '成立时间', '在职教师人数'],
        sheetHeader: ['部门名称', '通讯地址', '联系电话', '成立时间', '在职教师人数'],
        columnWidths: [13, 20, 8, 6, 3]
      }
    ]

    var toExcel = new ExportJsonExcel(option)
    toExcel.saveExcel()
    // toExcel.saveExcel()
  }
  return (
    <PageContainer>
      <ProList
        tableAlertRender={() => {
          return (
            <div>
              {selectedRowKeys.length > 0 ? (
                <div style={{ display: 'flex', justifyContent: 'flex-between' }}>
                  <div style={{ flex: 1 }}>已选择 {selectedRowKeys.length} 项</div>
                  <div>
                    <AButton
                      type="link"
                      onClick={async () => {
                        const result = await deleteDepartmentMultiple({
                          dep_ids: selectedRowKeys
                        })
                        if (result.data.success) {
                          Notification.success({
                            title: 'Success',
                            content: result.data.message
                          })
                          tableRef.current.reload()
                          setSelectedRowKeys([])
                        } else {
                          Notification.error({
                            title: 'Failed',
                            content: result.data.message
                          })
                        }
                      }}
                    >
                      批量删除
                    </AButton>
                  </div>
                </div>
              ) : null}
            </div>
          )
        }}
        actionRef={tableRef}
        options={{
          search: { allowClear: true },
          density: false,
          fullScreen: true,
          reload: true,
          setting: false
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
            </Button>,
            <Button
              key="3"
              type="primary"
              onClick={() => {
                excelDownload()
              }}
            >
              数据导出
            </Button>
          ]
        }}
        search={{
          filterType: 'light'
        }}
        rowKey="dep_id"
        headerTitle="所有部门"
        request={request}
        pagination={{
          pageSize: 8
        }}
        showActions="always"
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
              return renderDescription(row)
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
            render: (text, row) => {
              return [
                <Popconfirm
                  title="确定删除该部门?"
                  onOk={async () => {
                    //Message.info({ content: 'ok' })
                    const result = await deleteDepartment({
                      dep_id: row.dep_id
                    })
                    if (result.data.success) {
                      Notification.success({
                        title: 'Success',
                        content: result.data.message
                      })
                      setSelectedRowKeys([])
                      tableRef.current.reload()
                    } else {
                      Notification.error({
                        title: 'Failed',
                        content: result.data.message
                      })
                    }
                  }}
                  onCancel={() => {
                    //Message.error({ content: 'cancel' })
                  }}
                >
                  <a href={row.url} target="_blank" rel="noopener noreferrer" key="view">
                    删除
                  </a>
                </Popconfirm>,

                <a href={row.url} target="_blank" rel="noopener noreferrer" key="view">
                  查看
                </a>
              ]
            },
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
                    dep_address: formRef.current.getFieldsValue().create_address,
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
                    tableRef.current.reload()
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
