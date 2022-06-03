import { department as getAllDepartment } from '@/services/department'
import { Alert, Form, Input, Steps } from '@arco-design/web-react'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
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

const Form1 = forwardRef((props, ref) => {
  const [size, setSize] = useState('large')
  const [department, setDepartment] = useState([])
  const formRef1 = useRef()
  const [data, setData] = useState({
    tea_id: props.props.tea_id,
    tea_name: props.props.tea_name,
    tea_password: props.props.tea_password
  })
  useEffect(async () => {
    const res = await getAllDepartment({ keyword: '%' })
    setDepartment(res.data.department)
  }, [])
  useImperativeHandle(ref, () => ({
    data: data
  }))
  return (
    <div style={{ maxWidth: 650 }}>
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
        size={size}
        initialValues={{
          tea_id: data.tea_id,
          tea_name: data.tea_name,
          tad_password: data.tea_password
        }}
        scrollToFirstError
      >
        <FormItem label="工号" field="tea_id" rules={[{ required: true }]}>
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
  )
})

export default Form1
