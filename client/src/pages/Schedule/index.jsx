import { backupSystem, schedule } from '@/services/backup'
import { ProCard } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import {
  Button,
  Descriptions,
  Divider,
  Form,
  Grid,
  Input,
  Notification,
  Radio
} from '@arco-design/web-react'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import Cron from 'react-js-cron'
import 'react-js-cron/dist/styles.css'
const { Row, Col } = Grid
const FormItem = Form.Item

const Schedule = () => {
  const [sys, setSys] = useState([])
  const [date, setDate] = useState('')
  const [backupType, setBackupType] = useState('sql')
  const [value, setValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const allowedDropdowns = ['period', 'months', 'month-days', 'week-days', 'hours', 'minutes']
  useEffect(async () => {
    const res = await backupSystem({})

    setSys(res.sys)
    let x = dayjs().format('YYYY-MM-DD').split('-')
    console.log(x)
    setDate(`${x[0]}年${x[1]}月${x[2]}日`)
  }, [])
  const Demo = () => {
    const formRef = useRef()

    return (
      <div>
        <Divider>定时备份设置</Divider>
        <Row>
          <Form style={{ width: 430 }} ref={formRef}>
            <FormItem label="Cron表达式" field="cron_value">
              <Input placeholder="please enter your username..." />
            </FormItem>
          </Form>
          <Button
            type="primary"
            style={{ marginLeft: 20 }}
            onClick={async () => {
              const res = await schedule({
                cron_value: formRef.current.getFieldsValue().cron_value
              })
              if (res.success) {
                Notification.success({
                  title: 'Success',
                  content: res.message
                })
              }
            }}
          >
            确认备份
          </Button>
        </Row>
        <Row>
          <Cron
            allowedDropdowns={allowedDropdowns}
            value={value}
            setValue={(e) => {
              console.log(e)
              setValue(e)
            }}
          ></Cron>

          <Button
            type="primary"
            style={{ marginLeft: 20 }}
            onClick={async () => {
              const res = await schedule({
                cron_value: value
              })
            }}
          >
            确认备份
          </Button>
        </Row>
      </div>
    )
  }
  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard title="系统实时信息" colSpan="30%">
          {/* <Button
          onClick={async () => {
            const res = await backup({})
            console.log(res)
            const blob = new Blob([res])
            const objectURL = URL.createObjectURL(blob)
            let btn = document.createElement('a')
            btn.download = 'backup2.sql'
            btn.href = objectURL
            btn.click()
            URL.revokeObjectURL(objectURL)
            btn = null
          }}
        >
          备份
        </Button> */}

          <Descriptions
            column={1}
            data={sys}
            style={{ marginBottom: 20 }}
            labelStyle={{ paddingRight: 36 }}
          />
        </ProCard>
        <ProCard title="数据库定时备份" headerBordered extra={date} split="vertical">
          {/* <div style={{ height: 360 }} colSpan="30%">
            
          </div> */}
          <ProCard>
            <div style={{ marginBottom: 20 }}>备份格式选择</div>
            <Radio.Group
              defaultValue="sql"
              style={{ marginBottom: 20 }}
              onChange={(v) => {
                setBackupType(v)
              }}
            >
              <Radio value="sql">sql文件</Radio>
              <Radio value="tar">tar压缩包</Radio>
            </Radio.Group>
            <div style={{ marginTop: 20 }}>
              <Demo />
            </div>
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  )
}

export default Schedule
