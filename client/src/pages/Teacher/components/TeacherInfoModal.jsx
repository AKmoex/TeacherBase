import { getTeacherById } from '@/services/teacher'
import {
  Badge,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Steps,
  Table,
  Tabs
} from '@arco-design/web-react'
import dayjs from 'dayjs'
import React, { useEffect, useImperativeHandle, useState } from 'react'
const TabPane = Tabs.TabPane
const style = {
  //textAlign: 'center',
  //marginTop: 20
}
const Step = Steps.Step
const TextArea = Input.TextArea
const FormItem = Form.Item
const TeacherInfoModal = ({ cRef }) => {
  const [visible, setVisible] = useState(false) // table
  const [id, setId] = useState('') // table
  const [data, setData] = useState({})
  const [photoLoading, setPhotoLoading] = useState(true)
  const [photo, setPhoto] = useState('')
  const [edu, setEdu] = useState([])
  const [work, setWork] = useState([])
  const [arc, setArc] = useState([])
  const [res, setRes] = useState([])
  const [fam, setFam] = useState([])

  useImperativeHandle(cRef, () => ({
    setTeacherInfoId: (id) => {
      setVisible(true)
      setId(id)
    }
  }))
  useEffect(async () => {
    const { data } = await getTeacherById({ tea_id: id })
    console.log(data)
    const d = []
    d.push({
      label: '工号',
      value: data.id
    })
    d.push({
      label: '姓名',
      value: data.name
    })
    if (data.gender == '1') {
      d.push({
        label: '性别',
        value: '男'
      })
    } else if (data.gender == '2') {
      d.push({
        label: '性别',
        value: '女'
      })
    } else {
      d.push({
        label: '性别',
        value: ''
      })
    }

    d.push({
      label: '手机号码',
      value: data.phone
    })
    d.push({
      label: '邮箱',
      value: data.email
    })
    d.push({
      label: '民族',
      value: data.ethnicity
    })
    d.push({
      label: '政治面貌',
      value: data.political
    })
    d.push({
      label: '通讯地址',
      value: data.address
    })
    d.push({
      label: '职称',
      value: data.title
    })
    d.push({
      label: '职务',
      value: data.job
    })
    if (data.entry_date) {
      d.push({
        label: '入职时间',
        value: dayjs(data.entry_date).format('YYYY-MM-DD')
      })
    } else {
      d.push({
        label: '入职时间',
        value: ''
      })
    }

    if (data.term_date) {
      d.push({
        label: '离职时间',
        value: dayjs(data.term_date).format('YYYY-MM-DD')
      })
    } else {
      d.push({
        label: '离职时间',
        value: ''
      })
    }

    d.push({
      label: '所属院系',
      value: data.department_name
    })
    // 教育经历
    for (let i = 0; i < data.edu.length; i++) {
      data.edu[i].start_date = dayjs(data.edu[i].start_date).format('YYYY-MM')
      data.edu[i].end_date = dayjs(data.edu[i].end_date).format('YYYY-MM')
    }
    setEdu(data.edu)
    // 工作经历
    for (let i = 0; i < data.work.length; i++) {
      data.work[i].start_date = dayjs(data.work[i].start_date).format('YYYY-MM')
      data.work[i].end_date = dayjs(data.work[i].end_date).format('YYYY-MM')
    }
    setWork(data.work)
    // 奖惩记录
    for (let i = 0; i < data.arc.length; i++) {
      data.arc[i].obtain_date = dayjs(data.arc[i].obtain_date).format('YYYY-MM-DD')
    }
    setArc(data.arc)
    // 科研项目
    for (let i = 0; i < data.res.length; i++) {
      data.res[i].obtain_date = dayjs(data.res[i].obtain_date).format('YYYY-MM')
    }
    setRes(data.res)

    // 家庭关系
    setFam(data.fam)
    setData(d)
    setPhoto(data.photo)
    setPhotoLoading(false)
  }, [id])
  const edu_columns = [
    {
      title: '学位',
      dataIndex: 'degree'
    },
    {
      title: '开始时间',
      dataIndex: 'start_date'
    },
    { title: '结束时间', dataIndex: 'end_date' },
    {
      title: '学校',
      dataIndex: 'school'
    },
    {
      title: '专业',
      dataIndex: 'major'
    }
  ]
  const work_columns = [
    {
      title: '开始时间',
      dataIndex: 'start_date'
    },
    { title: '结束时间', dataIndex: 'end_date' },
    {
      title: '地点',
      dataIndex: 'location'
    },
    {
      title: '内容/说明',
      dataIndex: 'content'
    }
  ]
  const arc_columns = [
    {
      title: '奖惩',
      dataIndex: 'title'
    },
    { title: '时间', dataIndex: 'obtain_date' },
    {
      title: '种类',
      dataIndex: 'type',
      render: (col, record, index) => {
        if (record.type == 1) {
          return <Badge color="#f50" />
        } else {
          return <Badge color={'green'} />
        }
      }
    },
    {
      title: '备注/说明',
      dataIndex: 'detail'
    }
  ]
  const res_columns = [
    {
      title: '科研/项目',
      dataIndex: 'title'
    },
    { title: '时间', dataIndex: 'obtain_date' },

    {
      title: '详细说明',
      dataIndex: 'detail'
    }
  ]
  const fam_columns = [
    {
      title: '姓名',
      dataIndex: 'name'
    },
    { title: '关系', dataIndex: 'relation' },

    {
      title: '手机号码',
      dataIndex: 'phone'
    }
  ]
  return (
    <div>
      <Modal
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => {
          setVisible(false)
        }}
        alignCenter={false}
        style={{ top: 90, fiexd: true }}
        footer={null}
      >
        <Tabs defaultActiveTab="1" type="rounded">
          <TabPane key="1" title="基本" style={{ display: 'flex' }}>
            <div>
              <Image
                width={130}
                height={170}
                src={`http://localhost:5000${photo}`}
                alt="未上传"
                style={{ paddingTop: 20 }}
              />
            </div>
            <Descriptions
              //style={{ marginLeft: 10 }}
              data={data}
              layout="horizontal"
              border
              style={{ marginBottom: 20, flex: 1, marginLeft: 20 }}
              column={{
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 1
              }}
            />
          </TabPane>
          <TabPane key="2" title="教育">
            <Table columns={edu_columns} data={edu} />
          </TabPane>
          <TabPane key="3" title="工作">
            <Table columns={work_columns} data={work} />
          </TabPane>
          <TabPane key="4" title="奖惩">
            <Table columns={arc_columns} data={arc} />
          </TabPane>
          <TabPane key="5" title="科研">
            <Table columns={res_columns} data={res} />
          </TabPane>
          <TabPane key="6" title="家庭">
            <Table columns={fam_columns} data={fam} />
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  )
}

export default TeacherInfoModal
