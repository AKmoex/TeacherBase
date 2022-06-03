import { department as getAllDepartment } from '@/services/department'
import { PageContainer } from '@ant-design/pro-layout'
import {
  AutoComplete,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Steps,
  Upload
} from '@arco-design/web-react'
import { IconLeft, IconRight } from '@arco-design/web-react/icon'
import React, { useEffect, useRef, useState } from 'react'
import Form1 from './components/Form1'
import Table3 from './components/Table3'
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
  const [allData, setAllData] = useState({
    tea_id: '',
    tea_name: '',
    tea_password: '',
    tea_familys: []
  })
  const childRef3 = useRef()
  const childRef1 = useRef()
  useEffect(() => {
    setForms([
      <Form1
        ref={childRef1}
        props={{
          tea_id: allData.tea_id,
          tea_name: allData.tea_name,
          tea_password: allData.tea_password
        }}
      />,
      <Form2 />,
      <Table3 ref={childRef3} props={{ tea_familys: allData.tea_familys }} />
    ])
  }, [])

  const formRef2 = useRef()

  const Form2 = () => {
    const [size, setSize] = useState('large')
    const [department, setDepartment] = useState([])
    const [form2department, setForm2Department] = useState([])

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

    return (
      <div style={{ maxWidth: 650 }}>
        <Form
          ref={formRef2}
          {...formItemLayout}
          size={size}
          scrollToFirstError
          initialValues={{
            tea_photo: '',
            tea_gender: 2,
            tea_brithday: '',
            tea_phone: '',
            tea_email: '',
            tea_political: '',
            tea_ethnicity: '',
            tea_address: '',
            tea_entry_date: '',
            tea_title: [],
            tea_department_id: '',
            tea_job: ''
          }}
        >
          <Form.Item label="照片" field="tea_photo">
            <Upload
              listType="picture-card"
              limit={1}
              name="file"
              action="/api/file/photo"
              onPreview={(file) => {
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
          <FormItem label="出生日期" field="tea_brithday">
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
                { label: '民革党员', value: '民革党员' },
                { label: '民盟盟员', value: '民盟盟员' },
                { label: '民建会员', value: '民建会员' },
                { label: '民进会员', value: '民进会员' },
                { label: '农工党党员', value: '农工党党员' },
                { label: '致公党党员', value: '致公党党员' },
                { label: '九三学社社员', value: '九三学社社员' },
                { label: '台盟盟员', value: '台盟盟员' },
                { label: '无党派人士', value: '无党派人士' },
                { label: '群众', value: '群众' }
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
              mode="multiple"
              allowCreate
              placeholder="please select"
              options={['教授', '副教授', '院士', '特任研究员', '特任教授', '讲师']}
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
        <div>{forms[step - 1]}</div>

        <div>
          <Button
            type="secondary"
            disabled={current <= 1}
            onClick={() => {
              console.log('BACK', allData)
              setCurrent(current - 1)
            }}
            style={{ paddingLeft: 8, marginLeft: 300, marginBottom: 40 }}
          >
            <IconLeft />
            Back
          </Button>
          <Button
            disabled={current >= 4}
            onClick={async () => {
              if (current == 1) {
                //setCreateLoading(true)
                await formRef1.current.validate()
                const d1 = {
                  tea_id: formRef1.current.getFieldsValue().tea_id,
                  tea_name: formRef1.current.getFieldsValue().tea_name,
                  tea_password: formRef1.current.getFieldsValue().tea_password
                }
                setAllData(d1)

                setCurrent(current + 1)
                //console.log(allData)
                // console.log(result.data)
              } else if (current === 2) {
                await formRef2.current.validate()
                const d2 = {
                  tea_photo: '',
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
                console.log(allData)
                setCurrent(current + 1)
              } else if (current === 3) {
                const table3Data = childRef3.current.table3Data
                console.log(table3Data)
                const d3 = []
                for (let i = 0; i < table3Data.length; i++) {
                  d3.push({
                    fam_name: table3Data[i].table3Data,
                    fam_phone: table3Data.fam_phone === undefined ? '' : table3Data[i].fam_phone,
                    fam_relation: table3Data[i].table3Data
                  })
                }
                const oldD = allData
                oldD.tea_familys = table3Data
                setAllData({
                  ...oldD
                })

                setCurrent(current + 1)
              }
            }}
            style={{ marginLeft: 20, paddingRight: 8 }}
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
            <Step
              style={{ marginBottom: -5 }}
              title="账号信息"
              description="This is a description"
            />
            <Step
              style={{ marginBottom: -5 }}
              title="基本信息"
              description="This is a description"
            />
            <Step
              style={{ marginBottom: -5 }}
              title="家庭关系"
              description="This is a description"
            />
            <Step
              style={{ marginBottom: -5 }}
              title="教育经历"
              description="This is a description"
            />
            <Step
              style={{ marginBottom: -5 }}
              title="工作经历"
              description="This is a description"
            />
            <Step
              style={{ marginBottom: -5 }}
              title="奖惩记录"
              description="This is a description"
            />
            <Step
              style={{ marginBottom: -5 }}
              title="科研成果"
              description="This is a description"
            />
          </Steps>
        </div>
        {renderContent(current)}
      </div>
    </PageContainer>
  )
}

export default AddTeacher
