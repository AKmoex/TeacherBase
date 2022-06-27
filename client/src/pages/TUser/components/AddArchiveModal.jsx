import { addArchive } from '@/services/archive'
import { teacher as getAllTeacher } from '@/services/teacher'
import {
  Alert,
  DatePicker,
  Form,
  Icon,
  Input,
  Message,
  Modal,
  Notification,
  Radio,
  Select
} from '@arco-design/web-react'
import React, { useEffect, useImperativeHandle, useState } from 'react'
const TextArea = Input.TextArea
const IconFont = Icon.addFromIconFontCn({
  src: '//at.alicdn.com/t/font_180975_26f1p759rvn.js'
})

const FormItem = Form.Item
const AddArchiveModal = (props, ref) => {
  const [visible, setVisible] = useState(false) // table
  const [form2department, setForm2Department] = useState([])
  const [teacher, setTeacher] = useState([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [allData, setAllData] = useState({
    tea_id: '',
    tea_name: '',
    tea_password: '',
    tea_familys: []
  })
  const [form] = Form.useForm()
  useImperativeHandle(ref, () => ({
    setAddArchiveVisible: (vis) => {
      setVisible(vis)
      form.resetFields()
    }
  }))

  useEffect(async () => {
    console.log(props.tableReload())
    const res = await getAllTeacher({})
    console.log(res)
    const d = []
    for (let i = 0; i < res.data.teacher.length; i++) {
      d.push({
        label: `${res.data.teacher[i].tea_name}-${res.data.teacher[i].tea_id}`,
        value: res.data.teacher[i].tea_id
      })
    }
    setTeacher(d)
  }, [])

  const onOk = async () => {
    await form.validate()
    setConfirmLoading(true)
    const d = form.getFieldsValue()
    const res = await addArchive(d)
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
        title="新增奖惩记录"
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
        style={{ padding: 0 }}
      >
        <Alert
          closable
          type="info"
          content="教师姓名-工号必须正确, 否则将添加失败"
          style={{
            marginTop: -25,
            marginLeft: -20,
            marginRight: -20,
            width: '108%',
            marginBottom: 20
          }}
        />
        <div>
          <Form
            {...formItemLayout}
            form={form}
            labelCol={{
              style: { flexBasis: 90 }
            }}
            wrapperCol={{
              style: { flexBasis: 'calc(100% - 90px)' }
            }}
          >
            <FormItem
              label="奖惩名称"
              field="title"
              rules={[{ required: true, message: '请输入奖惩记录名称' }]}
            >
              <Input placeholder="请输入奖惩记录名称..." />
            </FormItem>
            <FormItem
              label="时间"
              field="obtain_date"
              rules={[{ required: true, message: '请选择时间' }]}
            >
              <DatePicker />
            </FormItem>
            <FormItem
              label="教师"
              field="teacher_id"
              rules={[{ required: true, message: '请选择时间' }]}
            >
              <Select showSearch placeholder="请选择教师...">
                {teacher.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            <FormItem label="类型" field="type">
              <Radio.Group>
                <Radio value="0">奖励</Radio>
                <Radio value="1">惩罚</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem label="详细说明" field="detail">
              <TextArea
                maxLength={{ length: 200, errorOnly: true }}
                showWordLimit
                autoSize={{ minRows: 6, maxRows: 10 }}
                placeholder="请输入奖惩记录描述等..."
              />
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  )
}
export default React.forwardRef(AddArchiveModal)
