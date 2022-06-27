import { department as getAllDepartment } from '@/services/department'
import { addTeacherMultiple } from '@/services/teacher'
import { Button, Message, Modal, Notification, Steps, Upload } from '@arco-design/web-react'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import * as XLSX from 'xlsx'
const Step = Steps.Step
const data1 = [
  {
    label: '工号',
    value: 'tea_id',
    key: 0,
    disabled: true
  },
  {
    label: '姓名',
    value: 'tea_name',
    key: 1,
    disabled: true
  },
  {
    label: '性别',
    value: 'tea_gender',
    key: 2
  },
  {
    label: '手机号码',
    value: 'tea_phone',
    key: 3
  },
  {
    label: '邮箱',
    value: 'tea_email',
    key: 4
  },
  {
    label: '所属院系',
    value: 'tea_department_name',
    key: 5
  },
  {
    label: '出生日期',
    value: 'tea_birthday',
    key: 6
  },
  {
    label: '入职时间',
    value: 'tea_entry_date',
    key: 7
  },
  {
    label: '离职时间',
    value: 'tea_term_date',
    key: 8
  },
  {
    label: '职务',
    value: 'tea_job',
    key: 9
  },
  {
    label: '民族',
    value: 'tea_ethnicity',
    key: 10
  },
  {
    label: '政治面貌',
    value: 'tea_political',
    key: 11
  },
  {
    label: '通讯地址',
    value: 'tea_address',
    key: 12
  },
  {
    label: '职称',
    value: 'tea_title',
    key: 13
  },
  {
    label: '状态',
    value: 'tea_status',
    key: 14
  }
]
const ImportDataModal = ({ cRef }) => {
  const [visible, setVisible] = useState(false) // table
  const [file, setFile] = useState([])
  const [fileInfo, setFileInfo] = useState()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [data, setData] = useState([])
  const [errData, setErrData] = useState([])
  const [errColumns, setErrColumns] = useState([])

  const [showUploadList, setShowUploadList] = useState(true)
  useImperativeHandle(cRef, () => ({
    setImportDataVisible: (vis) => {
      setVisible(vis)
      setFile([])
      setCurrent(1)
      setShowUploadList(true)
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
    //setForm2Department(d)
    //setDepartment(res.data.department)
  }, [])

  const onImportExcel = async (file) => {
    let data = [] // 存储获取到的数据 // 通过FileReader对象读取文件
    const p = file.name.split('.')
    if (p[1] == 'xlsx') {
      const filePromise = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader()

          fileReader.readAsBinaryString(file) //二进制
          fileReader.onload = async (event) => {
            try {
              const { result } = event.target // 以二进制流方式读取得到整份excel表格对象

              const workbook = XLSX.read(result, { type: 'binary' }) // 遍历每张工作表进行读取（这里默认只读取第一张表）

              for (const sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                  // 利用 sheet_to_json 方法将 excel 转成 json 数据
                  data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet])) // break; // 如果只取第一张表，就取消注释这行
                }
              }
              let d = data.map((item) => {
                let t = {}
                for (var key in item) {
                  for (let i = 0; i < data1.length; i++) {
                    if (key == data1[i].label) {
                      t[data1[i].value] = item[key]
                      break
                    }
                  }
                }
                return t
              })

              setData(d)
              resolve(true)
            } catch (e) {
              console.log(e)
              // 这里可以抛出文件类型错误不正确的相关提示
              console.log('文件类型不正确')
              Message.error('上传文件格式不正确 !')

              reject(e)
            }
          }
        })
      }
      await filePromise(file)
    } else if (p[1] == 'zip') {
    } else {
      Message.error('上传文件格式不正确 !')
      return new Promise((resolve, reject) => {
        return reject('cancel')
      })
    }
  }

  return (
    <div>
      <Modal
        title="导入数据"
        visible={visible}
        onOk={() => {
          //setCurrent(current + 1)
        }}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        footer={
          <>
            <div style={{ display: current === 1 ? '' : 'none' }}>
              <Button
                onClick={() => {
                  setVisible(false)
                }}
              >
                取消
              </Button>
              <Button
                onClick={async () => {
                  setLoading(true)
                  const res = await addTeacherMultiple(data)
                  let t = res.data
                  if (t.length > 0) {
                    const m = []
                    let x = t.join(',')
                    for (let i = 0; i < t.length; t++) {
                      m.push(data[t[i]])
                    }

                    setErrData(m)
                    Notification.warning({
                      title: 'Warning',
                      content: `数据部分导入成功,第 ${x} 行数据导入失败 !`
                    })
                  } else {
                    Notification.success({
                      title: 'Success',
                      content: '数据全部导入成功 !'
                    })
                  }
                  setLoading(false)
                  setVisible(false)
                }}
                type="primary"
                style={{ marginLeft: 12 }}
              >
                确定
              </Button>
            </div>
            <div style={{ display: current === 2 ? '' : 'none' }}>
              <Button onClick={async () => {}} type="primary" style={{ marginLeft: 12 }}>
                确定
              </Button>
            </div>
          </>
        }
      >
        <Upload
          // key={Math.random()}
          showUploadList={showUploadList}
          style={{ display: current == 1 ? '' : 'none' }}
          // style={{ visibility: current == 2 ? 'hidden' : '' }}
          drag
          multiple
          accept=".zip,.xlsx"
          // action="/api/file/zip"
          action="/"
          tip="Only zip, xlsx can be uploaded, and the size does not exceed 100MB"
          beforeUpload={onImportExcel}
        />
        <div style={{ display: current == 2 ? '' : 'none' }}></div>
      </Modal>
    </div>
  )
}

export default ImportDataModal
