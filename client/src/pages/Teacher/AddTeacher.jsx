import { department as getAllDepartment } from '@/services/department'
import { addTeacherDetails } from '@/services/teacher'
import { PageContainer } from '@ant-design/pro-layout'
import {
  Alert,
  AutoComplete,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Notification,
  Radio,
  Result,
  Select,
  Space,
  Steps,
  Table,
  Typography,
  Upload
} from '@arco-design/web-react'
import { IconDelete, IconLeft, IconPlus, IconRight } from '@arco-design/web-react/icon'
import { cloneDeep, remove } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

const Step = Steps.Step
const TextArea = Input.TextArea
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

const AddTeacher = () => {
  const [current, setCurrent] = useState(1)
  const [forms, setForms] = useState([])
  const [table3Data, setTable3Data] = useState([])
  const [table6Data, setTable6Data] = useState([])
  const [table7Data, setTable7Data] = useState([])
  const [resultStatus, setResultStatus] = useState('success')
  const [resultTitle, setResultTitle] = useState('教师添加成功')
  const [resultSubTitle, setResultSubTitle] = useState('Add Teacher Success')
  const [allData, setAllData] = useState({
    tea_id: '',
    tea_name: '',
    tea_password: '',
    tea_familys: []
  })
  const [form2department, setForm2Department] = useState([])
  const [department, setDepartment] = useState([])
  const childRef3 = useRef()
  const [file, setFile] = React.useState()

  useEffect(async () => {
    const res = await getAllDepartment({ keyword: '%' })
    const d = []
    for (let i = 0; i < res.data.department.length; i++) {
      d.push({
        label: res.data.department[i].dep_name,
        value: res.data.department[i].dep_id
      })
    }
    setForm2Department(d)
    setDepartment(res.data.department)
  }, [])
  const formRef1 = useRef()
  const formRef2 = useRef()
  const formRef4 = useRef()
  const formRef5 = useRef()
  function onSelect(dateString, date) {
    console.log('onSelect', dateString, date)
  }

  function onChange(dateString, date) {
    console.log('onChange: ', dateString, date)
  }
  const Table3 = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [visible, setVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)

    const [form] = Form.useForm()

    const columns = [
      {
        title: '姓名',
        dataIndex: 'fam_name'
      },
      {
        title: '关系',
        dataIndex: 'fam_relation'
      },
      {
        title: '联系电话',
        dataIndex: 'fam_phone'
      }
    ]
    const onOk = async () => {
      await form.validate()
      const d = form.getFieldsValue()

      const d1 = table3Data
      if (table3Data.length == 0) {
        d.id = 0
      } else {
        d.id = table3Data[table3Data.length - 1].id + 1
      }

      d1.push(d)

      setConfirmLoading(true)
      await setTable3Data(d1)
      setConfirmLoading(false)
      setVisible(false)
    }

    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    }
    return (
      <div style={{ marginLeft: 40, marginRight: 40 }}>
        <Button onClick={() => setVisible(true)} type="primary" icon={<IconPlus />}>
          添加
        </Button>
        <Button
          //disabled={true}
          style={{ marginLeft: 20 }}
          onClick={() => {
            console.log(selectedRowKeys)
            const d = cloneDeep(table6Data)

            remove(d, function (n) {
              for (let i = 0; i < selectedRowKeys.length; i++) {
                if (n.id == selectedRowKeys[i]) {
                  return true
                }
              }
            })
            setTable3Data(d)
            //console.log(table6Data)
          }}
          status="danger"
          icon={<IconDelete />}
        >
          删除
        </Button>
        <Table
          style={{ marginTop: 20 }}
          rowKey="id"
          columns={columns}
          data={table3Data}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              console.log('onChange:', selectedRowKeys, selectedRows)
              setSelectedRowKeys(selectedRowKeys)
            },
            onSelect: (selected, record, selectedRows) => {
              //console.log(table6Data)
              console.log('onSelect:', selected, record, selectedRows)
            },
            checkboxProps: (record) => {
              return {
                disabled: record.id === '4'
              }
            }
          }}
        />
        <Modal
          title="新增家庭成员"
          visible={visible}
          onOk={onOk}
          confirmLoading={confirmLoading}
          onCancel={() => setVisible(false)}
        >
          <Form
            {...formItemLayout}
            form={form}
            labelCol={{ style: { flexBasis: 90 } }}
            wrapperCol={{ style: { flexBasis: 'calc(100% - 90px)' } }}
          >
            <FormItem label="姓名" field="fam_name" rules={[{ required: true }]}>
              <Input placeholder="" />
            </FormItem>
            <FormItem label="关系" required field="fam_relation" rules={[{ required: true }]}>
              <Input placeholder="" />
            </FormItem>
            <FormItem label="手机号码" required field="fam_phone">
              <Input
                placeholder=""
                rules={[
                  {
                    match: /^1[3456789]\d{9}$/,
                    message: '手机号码格式不正确'
                  }
                ]}
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }

  const Table6 = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [visible, setVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)

    const [form] = Form.useForm()

    const columns = [
      {
        title: '奖惩名称',
        dataIndex: 'title'
      },
      {
        title: '获得时间',
        dataIndex: 'obtain_date'
      },
      {
        title: '类型',
        dataIndex: 'type'
      },
      {
        title: '详细说明',
        dataIndex: 'detail'
      }
    ]
    const onOk = async () => {
      await form.validate()
      const d = form.getFieldsValue()
      if (d.type == '1') {
        d.type = 1
      } else {
        d.type = 0
      }
      if (d.detail == undefined) {
        d.detail = ''
      }
      const d1 = table6Data
      if (table6Data.length == 0) {
        d.id = 0
      } else {
        d.id = table6Data[table6Data.length - 1].id + 1
      }

      d1.push(d)

      setConfirmLoading(true)
      await setTable6Data(d1)
      setConfirmLoading(false)
      setVisible(false)
    }

    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    }
    return (
      <div style={{ marginLeft: 40, marginRight: 40 }}>
        <Button onClick={() => setVisible(true)} type="primary" icon={<IconPlus />}>
          添加
        </Button>
        <Button
          //disabled={true}
          style={{ marginLeft: 20 }}
          onClick={() => {
            console.log(selectedRowKeys)
            const d = cloneDeep(table6Data)

            remove(d, function (n) {
              for (let i = 0; i < selectedRowKeys.length; i++) {
                if (n.id == selectedRowKeys[i]) {
                  return true
                }
              }
            })
            setTable6Data(d)
            //console.log(table6Data)
          }}
          status="danger"
          icon={<IconDelete />}
        >
          删除
        </Button>
        <Table
          style={{ marginTop: 20 }}
          rowKey="id"
          columns={columns}
          data={table6Data}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              console.log('onChange:', selectedRowKeys, selectedRows)
              setSelectedRowKeys(selectedRowKeys)
            },
            onSelect: (selected, record, selectedRows) => {
              //console.log(table6Data)
              console.log('onSelect:', selected, record, selectedRows)
            },
            checkboxProps: (record) => {
              return {
                disabled: record.id === '4'
              }
            }
          }}
        />
        <Modal
          title="新增奖惩记录"
          visible={visible}
          onOk={onOk}
          confirmLoading={confirmLoading}
          onCancel={() => setVisible(false)}
        >
          <Form
            {...formItemLayout}
            form={form}
            labelCol={{ style: { flexBasis: 90 } }}
            wrapperCol={{ style: { flexBasis: 'calc(100% - 90px)' } }}
          >
            <FormItem label="奖惩名称" field="title" rules={[{ required: true }]}>
              <Input placeholder="" />
            </FormItem>
            <FormItem label="获得时间" required field="obtain_date" rules={[{ required: true }]}>
              <DatePicker />
            </FormItem>
            <FormItem label="类型" required field="type">
              <Radio.Group>
                <Radio value="0">奖励</Radio>
                <Radio value="1">惩罚</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem label="详细说明" required field="detail">
              <Input.TextArea
                maxLength={{ length: 60, errorOnly: false }}
                showWordLimit
                placeholder="More than 50 letters will be error"
                //wrapperStyle={{ width: 300,  }}
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }

  const Table7 = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [visible, setVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)

    const [form] = Form.useForm()

    const columns = [
      {
        title: '科研项目',
        dataIndex: 'title'
      },
      {
        title: '时间',
        dataIndex: 'obtain_date'
      },
      {
        title: '描述',
        dataIndex: 'detail'
      }
    ]
    const onOk = async () => {
      await form.validate()
      const d = form.getFieldsValue()

      if (d.detail == undefined) {
        d.detail = ''
      }
      const d1 = table7Data
      if (table7Data.length == 0) {
        d.id = 0
      } else {
        d.id = table7Data[table7Data.length - 1].id + 1
      }

      d1.push(d)

      setConfirmLoading(true)
      await setTable7Data(d1)
      setConfirmLoading(false)
      setVisible(false)
      console.log(d1)
    }

    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    }
    return (
      <div style={{ marginLeft: 40, marginRight: 40 }}>
        <Button onClick={() => setVisible(true)} type="primary" icon={<IconPlus />}>
          添加
        </Button>
        <Button
          //disabled={true}
          style={{ marginLeft: 20 }}
          onClick={() => {
            console.log(selectedRowKeys)
            const d = cloneDeep(table6Data)

            remove(d, function (n) {
              for (let i = 0; i < selectedRowKeys.length; i++) {
                if (n.id == selectedRowKeys[i]) {
                  return true
                }
              }
            })
            setTable6Data(d)
            //console.log(table6Data)
          }}
          status="danger"
          icon={<IconDelete />}
        >
          删除
        </Button>
        <Table
          style={{ marginTop: 20 }}
          rowKey="id"
          columns={columns}
          data={table7Data}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              console.log('onChange:', selectedRowKeys, selectedRows)
              setSelectedRowKeys(selectedRowKeys)
            },
            onSelect: (selected, record, selectedRows) => {
              //console.log(table6Data)
              console.log('onSelect:', selected, record, selectedRows)
            },
            checkboxProps: (record) => {
              return {
                disabled: record.id === '4'
              }
            }
          }}
        />
        <Modal
          title="新增科研项目"
          visible={visible}
          onOk={onOk}
          confirmLoading={confirmLoading}
          onCancel={() => setVisible(false)}
        >
          <Form
            {...formItemLayout}
            form={form}
            labelCol={{ style: { flexBasis: 90 } }}
            wrapperCol={{ style: { flexBasis: 'calc(100% - 90px)' } }}
          >
            <FormItem label="项目名称" field="title" rules={[{ required: true }]}>
              <Input placeholder="" />
            </FormItem>
            <FormItem label="时间" required field="obtain_date" rules={[{ required: true }]}>
              <DatePicker />
            </FormItem>
            <FormItem label="描述" required field="detail">
              <Input.TextArea
                maxLength={{ length: 60, errorOnly: false }}
                showWordLimit
                placeholder="More than 50 letters will be error"
                //wrapperStyle={{ width: 300,  }}
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }

  const renderContent = (step) => {
    return (
      <div
        style={{
          width: '100%',
          paddingTop: 40,
          background: 'var(--color-bg-2)',
          color: '#C2C7CC'
        }}
      >
        {
          <div style={{ maxWidth: 650, display: current === 1 ? '' : 'none' }}>
            <Alert
              style={{ marginBottom: 10, marginLeft: 200, width: 400 }}
              type="warning"
              content="教师工号为 8 位且唯一"
            />
            <Alert
              style={{ marginBottom: 20, marginLeft: 200, width: 400 }}
              type="success"
              content="初始登陆密码默认为123456"
            />
            <Form
              ref={formRef1}
              {...formItemLayout}
              size={'large'}
              // initialValues={{
              //   tea_id: data.tea_id,
              //   tea_name: data.tea_name,
              //   tad_password: data.tea_password
              // }}
              scrollToFirstError
            >
              <FormItem
                label="工号"
                field="tea_id"
                rules={[
                  { required: true, message: '工号不可为空' },
                  { type: 'number', message: '工号必须为8位纯数字' },
                  {
                    validator: async (value, callback) => {
                      return new Promise((resolve) => {
                        value = value.toString()
                        if (value.length != 8) {
                          setTimeout(() => {
                            callback('工号必须为8位纯数字')
                            resolve()
                          }, 10)
                        } else {
                          resolve()
                        }
                      })
                    }
                  }
                ]}
              >
                <Input placeholder="please enter..." />
              </FormItem>
              <FormItem label="姓名" field="tea_name" rules={[{ required: true }]}>
                <Input placeholder="please enter..." />
              </FormItem>
              <FormItem label="登陆密码" field="tea_password" rules={[{ required: true }]}>
                <Input.Password placeholder="please enter..." />
              </FormItem>
            </Form>
          </div>
        }
        {
          <div style={{ maxWidth: 650, display: current === 2 ? '' : 'none' }}>
            <Form ref={formRef2} {...formItemLayout} size={'large'} scrollToFirstError>
              <Form.Item label="照片" field="tea_photo">
                <Upload
                  listType="picture-card"
                  limit={1}
                  name="file"
                  action="/api/file/photo"
                  onChange={(_, currentFile) => {
                    if (currentFile.status == 'done') {
                      console.log(currentFile.response.url)
                      formRef2.current.setFieldsValue({
                        tea_photo: currentFile.response.url
                      })
                    }
                  }}
                  onPreview={(file) => {
                    console.log(file)
                    Modal.info({
                      title: 'Preview',
                      content: (
                        <img
                          src={file.url || URL.createObjectURL(file.originFile)}
                          style={{ maxWidth: '100%' }}
                        ></img>
                      )
                    })
                  }}
                />
              </Form.Item>
              <FormItem label="性别" field="tea_gender">
                <Radio.Group>
                  <Radio value="1">男</Radio>
                  <Radio value="2">女</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="出生日期" field="tea_birthday">
                <DatePicker />
              </FormItem>
              <FormItem
                label="手机号码"
                field="tea_phone"
                rules={[
                  {
                    match: /^1[3456789]\d{9}$/,
                    message: '手机号码格式不正确'
                  }
                ]}
              >
                <Input placeholder="please enter department phone" />
              </FormItem>
              <FormItem
                label="电子邮箱"
                field="tea_email"
                rules={[
                  {
                    required: false
                  },
                  {
                    type: 'email',
                    message: '邮箱格式错误'
                  }
                ]}
              >
                <Input placeholder="please enter department phone" />
              </FormItem>
              <FormItem label="政治面貌" field="tea_political">
                <Select
                  placeholder="please select"
                  options={[
                    { label: '中共党员', value: '中共党员' },
                    { label: '中共预备党员', value: '中共预备党员' },
                    { label: '共青团员', value: '共青团员' },
                    // { label: '民革党员', value: '民革党员' },
                    // { label: '民盟盟员', value: '民盟盟员' },
                    // { label: '民建会员', value: '民建会员' },
                    // { label: '民进会员', value: '民进会员' },
                    // { label: '农工党党员', value: '农工党党员' },
                    // { label: '致公党党员', value: '致公党党员' },
                    // { label: '九三学社社员', value: '九三学社社员' },
                    // { label: '台盟盟员', value: '台盟盟员' },
                    { label: '无党派人士', value: '无党派人士' },
                    { label: '群众', value: '群众' },
                    { label: '其他', value: '其他' }
                  ]}
                  allowClear
                />
              </FormItem>
              <FormItem label="民族" field="tea_ethnicity">
                <AutoComplete
                  placeholder="please enter"
                  data={[
                    '汉族',
                    '壮族',
                    '满族',
                    '回族',
                    '苗族',
                    '维吾尔族',
                    '土家族',
                    '彝族',
                    '蒙古族',
                    '藏族',
                    '布依族',
                    '侗族',
                    '瑶族',
                    '朝鲜族',
                    '白族',
                    '哈尼族',
                    '哈萨克族',
                    '黎族',
                    '傣族',
                    '畲族',
                    '傈僳族',
                    '仡佬族',
                    '东乡族',
                    '高山族',
                    '拉祜族',
                    '水族',
                    '佤族',
                    '纳西族',
                    '羌族',
                    '土族',
                    '仫佬族',
                    '锡伯族',
                    '柯尔克孜族',
                    '达斡尔族',
                    '景颇族',
                    '毛南族',
                    '撒拉族',
                    '布朗族',
                    '塔吉克族',
                    '阿昌族',
                    '普米族',
                    '鄂温克族',
                    '怒族',
                    '京族',
                    '基诺族',
                    '德昂族',
                    '保安族',
                    '俄罗斯族',
                    '裕固族',
                    '乌孜别克族',
                    '门巴族',
                    '鄂伦春族',
                    '独龙族',
                    '塔塔尔族',
                    '赫哲族',
                    '珞巴族'
                  ]}
                />
              </FormItem>
              <FormItem label="通讯地址" field="tea_address">
                <Input placeholder="please enter department phone" />
              </FormItem>
              <FormItem label="入职时间" field="tea_entry_date">
                <DatePicker />
              </FormItem>
              <FormItem
                label="职称"
                field="tea_title"
                rules={[
                  {
                    type: 'array',
                    minLength: 0
                  }
                ]}
              >
                <Select
                  allowCreate
                  placeholder="please select"
                  options={['教授', '副教授', '院士', '特任研究员', '特任教授', '助理教授', '讲师']}
                />
              </FormItem>
              <FormItem label="所属院系" field="tea_department_id">
                <Select placeholder="please select" options={form2department} allowClear />
              </FormItem>
              <FormItem label="职务" field="tea_job">
                <TextArea
                  placeholder="Please enter ..."
                  defaultValue="This is the contents of the textarea. "
                  autoSize
                />
              </FormItem>
            </Form>
          </div>
        }
        {
          <div style={{ maxWidth: 1000, marginBottom: 20, display: current === 3 ? '' : 'none' }}>
            <Table3></Table3>
          </div>
        }
        {
          <div style={{ maxWidth: 1200, display: current === 4 ? '' : 'none' }}>
            <Form
              ref={formRef4}
              {...formItemLayout}
              size={'large'}
              scrollToFirstError
              initialValues={{
                tea_edu: []
              }}
              onValuesChange={(_, v) => {
                console.log(_, v)
              }}
            >
              <Alert
                style={{ marginBottom: 10, marginLeft: 200, width: 350 }}
                content="完善教育经历（从大学起）"
              />
              <Alert
                style={{ marginBottom: 10, marginLeft: 200, width: 350 }}
                content="起始时间必须合法"
                type="warning"
              />
              <Form.List field="tea_edu">
                {(fields, { add, remove, move }) => {
                  return (
                    <div>
                      {fields.map((item, index) => {
                        return (
                          <div key={item.key}>
                            <Form.Item style={{ marginBottom: 3, marginLeft: 30 }}>
                              <Space>
                                <FormItem
                                  layout="vertical"
                                  label="学位"
                                  field={item.field + '.degree'}
                                  rules={[{ required: true, message: '请选择学位' }]}
                                  style={{ width: 80 }}
                                >
                                  <Select
                                    style={{ fontSize: 16 }}
                                    placeholder="please select"
                                    options={[
                                      { label: '本科', value: '本科' },
                                      { label: '硕士', value: '硕士' },
                                      { label: '博士', value: '博士' },
                                      { label: '博士后', value: '博士后' }
                                    ]}
                                    allowClear
                                  />
                                </FormItem>
                                <Form.Item
                                  label="起止时间"
                                  layout="vertical"
                                  field={item.field + '.date'}
                                  rules={[{ required: true, message: '请选择起止时间' }]}
                                  style={{ width: 230 }}
                                >
                                  <DatePicker.RangePicker
                                    mode={'month'}
                                    onChange={onChange}
                                    onSelect={onSelect}
                                  />
                                </Form.Item>
                                <Form.Item
                                  layout="vertical"
                                  label="学校/机构"
                                  field={item.field + '.school'}
                                  rules={[{ required: true, message: '请输入学校/机构' }]}
                                  style={{ width: 230 }}
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  layout="vertical"
                                  label="学院/专业"
                                  field={item.field + '.major'}
                                  style={{ width: 250 }}
                                >
                                  <Input />
                                </Form.Item>

                                <Button
                                  icon={<IconDelete />}
                                  shape="circle"
                                  status="danger"
                                  onClick={() => remove(index)}
                                ></Button>
                              </Space>
                            </Form.Item>
                          </div>
                        )
                      })}
                      <Form.Item style={{ marginLeft: 30 }}>
                        <Button
                          onClick={() => {
                            add()
                          }}
                          type="primary"
                          icon={<IconPlus />}
                        >
                          添加
                        </Button>

                        <Button
                          style={{ marginLeft: 20 }}
                          onClick={() => {
                            formRef4.current.resetFields()
                          }}
                          status="danger"
                          icon={<IconDelete />}
                        >
                          重置
                        </Button>
                      </Form.Item>
                    </div>
                  )
                }}
              </Form.List>
            </Form>
          </div>
        }
        {
          <div style={{ maxWidth: 1200, display: current === 5 ? '' : 'none' }}>
            <Form
              ref={formRef5}
              {...formItemLayout}
              size={'large'}
              scrollToFirstError
              initialValues={{
                tea_work: []
              }}
              onValuesChange={(_, v) => {
                console.log(_, v)
              }}
            >
              <Form.List field="tea_work">
                {(fields, { add, remove, move }) => {
                  return (
                    <div>
                      {fields.map((item, index) => {
                        return (
                          <div key={item.key}>
                            <Form.Item style={{ marginBottom: 3, marginLeft: 30 }}>
                              <Space>
                                <Form.Item
                                  label="起止时间"
                                  layout="vertical"
                                  field={item.field + '.date'}
                                  rules={[{ required: true, message: '请选择起止时间' }]}
                                  style={{ width: 230 }}
                                >
                                  <DatePicker.RangePicker
                                    mode={'month'}
                                    onChange={onChange}
                                    onSelect={onSelect}
                                  />
                                </Form.Item>
                                <Form.Item
                                  layout="vertical"
                                  label="地点"
                                  field={item.field + '.location'}
                                  rules={[{ required: true, message: '请输入工作公司/机构等' }]}
                                  style={{ width: 230 }}
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  layout="vertical"
                                  label="内容/备注"
                                  field={item.field + '.content'}
                                  style={{ width: 250 }}
                                >
                                  <TextArea autoSize />
                                </Form.Item>

                                <Button
                                  icon={<IconDelete />}
                                  shape="circle"
                                  status="danger"
                                  onClick={() => remove(index)}
                                ></Button>
                              </Space>
                            </Form.Item>
                          </div>
                        )
                      })}
                      <Form.Item style={{ marginLeft: 30 }}>
                        <Button
                          onClick={() => {
                            add()
                          }}
                          type="primary"
                          icon={<IconPlus />}
                        >
                          添加
                        </Button>

                        <Button
                          style={{ marginLeft: 20 }}
                          onClick={() => {
                            formRef5.current.resetFields()
                          }}
                          status="danger"
                          icon={<IconDelete />}
                        >
                          重置
                        </Button>
                      </Form.Item>
                    </div>
                  )
                }}
              </Form.List>
            </Form>
          </div>
        }
        {
          <div style={{ maxWidth: 1000, marginBottom: 20, display: current === 6 ? '' : 'none' }}>
            <Table6></Table6>
          </div>
        }
        {
          <div style={{ maxWidth: 1000, marginBottom: 20, display: current === 7 ? '' : 'none' }}>
            <Table7></Table7>
          </div>
        }
        {
          <div
            style={{
              maxWidth: 1000,
              marginBottom: 20,
              marginTop: 50,
              display: current === 8 ? '' : 'none'
            }}
          >
            <Result
              status={resultStatus}
              title={resultTitle}
              subTitle={resultSubTitle}
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    window.location.reload()
                  }}
                >
                  再次添加
                </Button>
              }
            >
              <Typography
                className="result-content"
                style={{ background: 'var(--color-fill-2)', padding: 24 }}
              >
                <Typography.Paragraph>如果添加失败:</Typography.Paragraph>
                <ul>
                  <li> 仔细检查每个步骤的填写内容 </li>
                  <li> 确认所填写的内容正确无误 </li>
                  <li> 刷新网页后重新填写内容 </li>
                </ul>
              </Typography>
            </Result>
          </div>
        }
        <div>
          <Button
            type="secondary"
            disabled={current <= 1}
            onClick={() => {
              console.log('BACK', allData)
              formRef1.current.setFieldsValue(allData)
              console.log(table3Data)
              setCurrent(current - 1)
            }}
            style={{
              paddingLeft: 8,
              marginLeft: 300,
              marginBottom: 40,
              display: current != 8 ? '' : 'none'
            }}
          >
            <IconLeft />
            Back
          </Button>
          <Button
            disabled={current >= 9}
            onClick={async () => {
              if (current == 1) {
                await formRef1.current.validate()
                const d1 = {
                  tea_id: formRef1.current.getFieldsValue().tea_id,
                  tea_name: formRef1.current.getFieldsValue().tea_name,
                  tea_password: formRef1.current.getFieldsValue().tea_password
                }
                setAllData(d1)

                setCurrent(current + 1)
              } else if (current === 2) {
                console.log(formRef2.current.getFieldsValue())

                await formRef2.current.validate()
                const d2 = {
                  tea_photo:
                    formRef2.current.getFieldsValue().tea_photo === undefined
                      ? ''
                      : formRef2.current.getFieldsValue().tea_photo,
                  tea_gender: formRef2.current.getFieldsValue().tea_gender,
                  tea_birthday:
                    formRef2.current.getFieldsValue().tea_birthday === undefined
                      ? ''
                      : formRef2.current.getFieldsValue().tea_birthday,
                  tea_phone: formRef2.current.getFieldsValue().tea_phone,
                  tea_email: formRef2.current.getFieldsValue().tea_email,
                  tea_political: formRef2.current.getFieldsValue().tea_political,
                  tea_ethnicity: formRef2.current.getFieldsValue().tea_ethnicity,
                  tea_address: formRef2.current.getFieldsValue().tea_address,
                  tea_entry_date: formRef2.current.getFieldsValue().tea_entry_date,
                  tea_title: formRef2.current.getFieldsValue().tea_title,
                  tea_department_id: formRef2.current.getFieldsValue().tea_department_id,
                  tea_job: formRef2.current.getFieldsValue().tea_job
                }
                console.log(formRef2.current.getFieldsValue())
                setAllData(d2)

                const D = {
                  ...allData,
                  ...d2
                }
                setAllData({
                  ...D
                })
                setCurrent(current + 1)
              } else if (current === 3) {
                const oldD = allData
                oldD.tea_familys = table3Data
                setAllData({
                  ...oldD
                })
                setCurrent(current + 1)
                //console.log(allData)
              } else if (current == 4) {
                await formRef4.current.validate()
                console.log(formRef4.current.getFieldsValue())
                if (formRef4.current.getFieldsValue().tea_edu === undefined) {
                  setCurrent(current + 1)
                } else {
                  const d2 = {
                    tea_edu: formRef4.current.getFieldsValue().tea_edu
                  }
                  const oldD = allData
                  oldD.tea_edu = d2
                  setAllData({
                    ...oldD
                  })
                  setCurrent(current + 1)
                }
              } else if (current == 5) {
                await formRef5.current.validate()
                if (formRef5.current.getFieldsValue().tea_work === undefined) {
                  setCurrent(current + 1)
                } else {
                  const d2 = {
                    tea_work: formRef5.current.getFieldsValue().tea_work
                  }
                  const oldD = allData
                  oldD.tea_work = d2
                  setAllData({
                    ...oldD
                  })
                  setCurrent(current + 1)
                }
              } else if (current == 6) {
                const oldD = allData
                oldD.tea_archive = table6Data
                setAllData({
                  ...oldD
                })
                setCurrent(current + 1)
              } else if (current == 7) {
                console.log(allData)

                const oldD = allData
                oldD.tea_research = table7Data
                setAllData({
                  ...oldD
                })
                const res = await addTeacherDetails(allData)
                if (res.success) {
                  if (
                    res.tea_msg != undefined ||
                    res.res_msg != undefined ||
                    res.fam_msg != undefined ||
                    res.edu_msg != undefined ||
                    res.work_msg != undefined ||
                    res.arc_msg != undefined ||
                    res.work_msg != undefined
                  ) {
                    setResultStatus('error')
                    setResultTitle('部分信息填写错误')
                    let t = ''
                    if (res.tea_msg != undefined) {
                      t += res.tea_msg
                    }
                    if (res.res_msg != undefined) {
                      t = t + ',' + res.res_msg
                    }
                    if (res.fam_msg != undefined) {
                      t = t + ',' + res.fam_msg
                    }
                    if (res.edu_msg != undefined) {
                      t = t + ',' + res.edu_msg
                    }
                    if (res.work_msg != undefined) {
                      t = t + ',' + res.work_msg
                    }
                    if (res.arc_msg != undefined) {
                      t = t + ',' + res.arc_msg
                    }
                    if (res.work_msg != undefined) {
                      t = t + ',' + res.work_msg
                    }
                    setResultSubTitle(t)
                    setCurrent(current + 1)
                  } else {
                    setResultStatus('success')
                    setResultTitle('教师添加成功')
                    setResultSubTitle('Add Teacher Success')
                    setCurrent(current + 1)
                    Notification.success({
                      title: 'Success',
                      content: '教师添加成功'
                    })
                  }
                } else {
                }
              }
            }}
            style={{ marginLeft: 20, paddingRight: 8, display: current != 8 ? '' : 'none' }}
            type="primary"
          >
            Next
            <IconRight />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <PageContainer>
      <div style={{ display: 'flex', padding: 1, background: 'var(--color-fill-2)' }}>
        <div
          style={{
            background: 'var(--color-bg-2)',
            padding: 24,
            borderRight: '1px solid var(--color-border)',
            boxSizing: 'border-box'
          }}
        >
          <Steps
            direction="vertical"
            lineless
            current={current}
            onChange={setCurrent}
            style={{ width: 200 }}
          >
            <Step style={{ marginBottom: -12 }} title="账号信息" description="教师的工号、密码" />
            <Step style={{ marginBottom: -12 }} title="基本信息" description="输入教师的基本信息" />
            <Step style={{ marginBottom: -12 }} title="家庭关系" description="添加教师的家庭成员" />
            <Step style={{ marginBottom: -12 }} title="教育经历" description="完善教育经历" />
            <Step style={{ marginBottom: -12 }} title="工作经历" description="完善工作经历" />
            <Step style={{ marginBottom: -12 }} title="奖惩记录" description="添加教师的奖惩记录" />
            <Step
              style={{ marginBottom: -10 }}
              title="科研项目"
              description="教师的科研项目或成果"
            />
            <Step style={{ marginBottom: -10 }} title="完成添加" description="添加结果页面" />
          </Steps>
        </div>
        {renderContent(current)}
      </div>
    </PageContainer>
  )
}

export default AddTeacher
