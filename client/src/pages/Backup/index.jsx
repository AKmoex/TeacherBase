import { backup, backupSystem } from '@/services/backup'
import { ProCard } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Descriptions, Modal, Radio, Upload } from '@arco-design/web-react'
import { Typography } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import styles from './index.less'

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
)

const Backup = () => {
  const [sys, setSys] = useState([])
  const [date, setDate] = useState('')
  const [backupType, setBackupType] = useState('sql')
  useEffect(async () => {
    const res = await backupSystem({})

    setSys(res.sys)
    let x = dayjs().format('YYYY-MM-DD').split('-')
    console.log(x)
    setDate(`${x[0]}年${x[1]}月${x[2]}日`)
  }, [])
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
        <ProCard title="数据库备份与恢复" headerBordered extra={date} split="vertical">
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
              <Button
                type="primary"
                onClick={async () => {
                  console.log('准备备份...')
                  const timestamp = Date.parse(new Date())
                  const res = await backup({ type: backupType })

                  //   let fileName = window.decodeURI(
                  //     res.headers['content-disposition'].split('=')[1],
                  //     'UTF-8'
                  //   )
                  let filename = `backup-${timestamp}.${backupType}`
                  const blob = new Blob([res])
                  const objectURL = URL.createObjectURL(blob)
                  let btn = document.createElement('a')
                  btn.download = filename
                  btn.href = objectURL
                  btn.click()
                  URL.revokeObjectURL(objectURL)
                  btn = null
                }}
              >
                备份
              </Button>
            </div>
          </ProCard>
          <ProCard>
            <div>
              <Upload
                multiple
                action="api/backup/restore"
                name="file"
                beforeUpload={(file) => {
                  return new Promise((resolve, reject) => {
                    Modal.confirm({
                      title: '恢复确认',
                      content: `确认用 ${file.name} 文件来恢复数据库吗? 该操作可能造成严重后果, 请务必先备份数据库 !`,
                      onConfirm: () => resolve(true),
                      onCancel: () => reject('cancel')
                    })
                  })
                }}
              />
            </div>
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  )
}

export default Backup
