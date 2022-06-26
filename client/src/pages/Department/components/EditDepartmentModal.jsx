import { editDepartment } from '@/services/department'
import { DatePicker, Form, Icon, Input, Modal, Notification } from '@arco-design/web-react'
import React, { useImperativeHandle, useState } from 'react'
const TextArea = Input.TextArea
const IconFont = Icon.addFromIconFontCn({
  src: '//at.alicdn.com/t/font_180975_26f1p759rvn.js'
})
const FormItem = Form.Item
const EditDepartmentModal = (props, ref) => {
  const [visible, setVisible] = useState(false) // table
  const [data, setData] = useState([])
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [form] = Form.useForm()
  useImperativeHandle(ref, () => ({
    setEditDepartmentVisible: (d) => {
      setVisible(true)
      form.setFieldsValue(d)
      setData(d)
    }
  }))

  // useEffect(async () => {
  //   const res = await getAllTeacher({})
  //   console.log(res)
  //   const d = []
  //   for (let i = 0; i < res.data.teacher.length; i++) {
  //     d.push({
  //       label: `${res.data.teacher[i].tea_name}-${res.data.teacher[i].tea_id}`,
  //       value: res.data.teacher[i].tea_id
  //     })
  //   }
  //   setTeacher(d)
  // }, [])

  const onOk = async () => {
    await form.validate()
    setConfirmLoading(true)
    const d = form.getFieldsValue()
    console.log(d)
    const res = await editDepartment({ ...d, id: data.id })
    if (res.success) {
      Notification.success({
        icon: <IconFont type="icon-success" />,
        title: 'Success',
        content: res.message
      })
      setVisible(false)
      props.tableReload()
    } else {
      Message.error(res.message)
    }
    setConfirmLoading(false)
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
    <div>
      <Modal
        title="编辑院系信息"
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
        style={{ padding: 0 }}
      >
        <div style={{ maxWidth: 650 }}>
          <Form
            form={form}
            {...formItemLayout}
            size={'large'}
            scrollToFirstError
            layout={'vertical'}
          >
            <FormItem
              label="部门名称"
              field="name"
              rules={[{ required: true, message: '请输入部门名称' }]}
            >
              <Input placeholder="please enter department name" />
            </FormItem>
            <FormItem label="通讯地址" field="address">
              <Input placeholder="please enter department address" />
            </FormItem>
            <FormItem
              label="联系电话"
              field="phone"
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
            <FormItem label="成立时间" field="establish_date" rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD" />
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  )
}
export default React.forwardRef(EditDepartmentModal)
