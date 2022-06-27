import { department as getAllDepartment } from '@/services/department'
import { addTeacher } from '@/services/teacher'
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Message,
  Modal,
  Notification,
  Radio,
  Select,
  Steps
} from '@arco-design/web-react'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
const Step = Steps.Step
const TextArea = Input.TextArea
const FormItem = Form.Item
const AddTeacherModal = ({ cRef }) => {
  const [visible, setVisible] = useState(false) // table
  const [current, setCurrent] = useState(1)
  const [form2department, setForm2Department] = useState([])
  const [department, setDepartment] = useState([])
  const [allData, setAllData] = useState({
    tea_id: '',
    tea_name: '',
    tea_password: '',
    tea_familys: []
  })
  useImperativeHandle(cRef, () => ({
    setAddTeacherVisible: (vis) => {
      setVisible(vis)
      setCurrent(1)
    }
  }))
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
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 15
    }
  }
  return (
    <div>
      <Modal
        title="添加教师"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => {
          formRef1.current.resetFields()
          formRef2.current.resetFields()
          setVisible(false)
        }}
        footer={
          <>
            <div style={{ display: current === 1 ? '' : 'none' }}>
              <Button
                onClick={() => {
                  formRef1.current.resetFields()
                  formRef2.current.resetFields()
                  setVisible(false)
                }}
              >
                取消
              </Button>
              <Button
                onClick={async () => {
                  await formRef1.current.validate()
                  const d1 = {
                    tea_id: formRef1.current.getFieldsValue().tea_id,
                    tea_name: formRef1.current.getFieldsValue().tea_name,
                    tea_password: formRef1.current.getFieldsValue().tea_password
                  }
                  setAllData(d1)
                  setCurrent(current + 1)
                }}
                type="primary"
                style={{ marginLeft: 12 }}
              >
                下一步
              </Button>
            </div>
            <div style={{ display: current === 2 ? '' : 'none' }}>
              <Button
                onClick={() => {
                  setCurrent(current - 1)
                }}
              >
                上一步
              </Button>
              <Button
                onClick={async () => {
                  console.log(formRef2.current.getFieldsValue().tea_gender)
                  await formRef2.current.validate()
                  const d2 = {
                    tea_gender: formRef2.current.getFieldsValue().tea_gender,
                    tea_birthday:
                      formRef2.current.getFieldsValue().tea_birthday === undefined
                        ? ''
                        : formRef2.current.getFieldsValue().tea_birthday,
                    tea_phone: formRef2.current.getFieldsValue().tea_phone,
                    tea_email: formRef2.current.getFieldsValue().tea_email,

                    tea_address: formRef2.current.getFieldsValue().tea_address,
                    tea_entry_date: formRef2.current.getFieldsValue().tea_entry_date,
                    tea_title: formRef2.current.getFieldsValue().tea_title,
                    tea_department_id: formRef2.current.getFieldsValue().tea_department_id,
                    tea_job: formRef2.current.getFieldsValue().tea_job
                  }
                  setAllData(d2)
                  const D = {
                    ...allData,
                    ...d2
                  }
                  setAllData({
                    ...D
                  })

                  const res = await addTeacher(D)
                  if (res.tea_msg != undefined) {
                    Message.error('添加失败, 请检查信息是否填写正确!')
                  } else {
                    Notification.success({
                      title: 'Success',
                      content: '教师添加成功!'
                    })
                    formRef1.current.resetFields()
                    formRef2.current.resetFields()
                    setVisible(false)
                  }
                }}
                type="primary"
                style={{ marginLeft: 12 }}
              >
                添加
              </Button>
            </div>
          </>
        }
      >
        <div style={{ marginTop: -5, marginBottom: 15 }}>
          <Steps
            size="small"
            lineless
            current={current}
            style={{ maxWidth: 375, margin: '0 auto' }}
          >
            <Step title="账号信息" />
            <Step title="基本信息" />
          </Steps>
        </div>
        <Divider style={{ marginLeft: -20, marginRight: -200, marginTop: 0, marginBottom: 0 }} />
        {
          <div style={{ maxWidth: 650, display: current === 1 ? '' : 'none', marginTop: 20 }}>
            <Form
              ref={formRef1}
              {...formItemLayout}
              size={'default'}
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
          <div style={{ maxWidth: 650, display: current === 2 ? '' : 'none', marginTop: 20 }}>
            <Form ref={formRef2} {...formItemLayout} size={'default'} scrollToFirstError>
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
      </Modal>
    </div>
  )
}

export default AddTeacherModal
