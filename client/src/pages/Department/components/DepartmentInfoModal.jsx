import { editDepartment } from '@/services/department'
import { Pie } from '@ant-design/plots'
import {
  Descriptions,
  Divider,
  Form,
  Icon,
  Input,
  Modal,
  Notification
} from '@arco-design/web-react'
import React, { useImperativeHandle, useState } from 'react'
const TextArea = Input.TextArea
const IconFont = Icon.addFromIconFontCn({
  src: '//at.alicdn.com/t/font_180975_26f1p759rvn.js'
})
const FormItem = Form.Item
const DepartmentInfoModal = (props, ref) => {
  const [visible, setVisible] = useState(false) // table
  const [data, setData] = useState([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [teacher, setTeacher] = useState([])
  const [depData, setDepData] = useState([])

  const [form] = Form.useForm()
  useImperativeHandle(ref, () => ({
    setDepartmentInfoVisible: (d) => {
      setVisible(true)
      form.setFieldsValue(d)
      setData(d)
      const x = []
      x.push({
        label: '院系名称',
        value: d.name
      })
      x.push({
        label: '成立时间',
        value: d.establish_date ? d.establish_date : ''
      })
      x.push({
        label: '联系电话',
        value: d.phone ? d.phone : ''
      })
      x.push({
        label: '通讯地址',
        value: d.address ? d.address : ''
      })
      x.push({
        label: '教师人数',
        value: d.t_count
      })
      setDepData(x)
      setTeacher(d.teacher_data)
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

  const DemoPie = () => {
    const config = {
      appendPadding: 10,
      data: teacher,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      label: {
        type: 'outer',
        content: '{name} {percentage}'
      },
      interactions: [
        {
          type: 'pie-legend-active'
        },
        {
          type: 'element-active'
        }
      ]
    }
    return <Pie {...config} />
  }

  const DepartmentInfo = () => {
    return (
      <div>
        <Descriptions
          column={1}
          title="院系信息"
          data={depData}
          style={{ marginBottom: 20 }}
          labelStyle={{ paddingRight: 36 }}
        />
      </div>
    )
  }

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
        title="院系基本信息"
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
        style={{ padding: 0, width: 750 }}
        footer={null}
      >
        <div style={{ display: 'flex' }}>
          <DepartmentInfo />
          <Divider type="vertical" />
          <DemoPie />
        </div>
      </Modal>
    </div>
  )
}
export default React.forwardRef(DepartmentInfoModal)
