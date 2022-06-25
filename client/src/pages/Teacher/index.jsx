import { department as getAllDepartment } from '@/services/department'
import { teacher } from '@/services/teacher'
import { DownOutlined } from '@ant-design/icons'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Divider, Drawer, Form, Grid, Input, Message, Space } from '@arco-design/web-react'
import { Radio as SimeRadio, RadioGroup as SimeRadioGroup, Transfer } from '@douyinfe/semi-ui'
import { Select as AntdSelect } from 'antd'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { pick } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'umi'
import * as XLSX from 'xlsx'
import AddTeacherModal from './components/AddTeacherModal'
import TeacherInfoModal from './components/TeacherInfoModal'

const { Col, Row } = Grid
const Teacher = () => {
  const [data, setData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [columnsStateMap, setColumnsStateMap] = useState({
    tea_term_date: {
      show: false
    },
    tea_entry_date: {
      show: false
    },
    tea_ethnicity: {
      show: false
    },
    tea_birthday: {
      show: false
    },
    tea_political: {
      show: false
    },
    tea_gender: {
      show: false
    },
    tea_address: {
      show: false
    }
  })
  const [zipValue, setZipValue] = useState('excel')
  const [compressionValue, setCompressionValue] = useState(false)

  const [options, setOptions] = useState(['tea_id', 'tea_name'])
  const [department, setDepartment] = useState({})
  const [downloadVisible, setDownloadVisible] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(async () => {
    const res = await getAllDepartment({ keyword: '%' })
    const d = {}
    d['全部'] = {
      text: '全部'
    }

    const temp = res.data.department.map((item, index) => {
      const text = item.dep_name
      d[item.dep_name] = { text }
    })
    setDepartment(d)
  }, [])
  const addTeacherModalRef = useRef()
  const teacherInfoModalRef = useRef()

  const request = async (params, soter, filter) => {
    if (params.tea_title && params.tea_title.length > 0) {
      let ttt = params.tea_title.join(',')
      params.tea_title = ttt
    }
    const result = await teacher(params)
    let d = result.data.teacher
    for (let i = 0; i < d.length; i++) {
      if (d[i].tea_term_date == null) {
        d[i].tea_status = '在职'
      } else {
        d[i].tea_status = '已离职'
      }
      if (d[i].tea_gender == 1) {
        d[i].tea_gender = '男'
      } else if (d[i].tea_gender == 2) {
        d[i].tea_gender = '女'
      } else {
        d[i].tea_gender = null
      }
    }
    setData(d)
    console.log(d)
    return {
      total: d.length,
      data: d,
      success: true
    }
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys)
  }
  const MySelect = (props) => {
    const { state } = props
    const [innerOptions, setOptions] = useState([])
    useEffect(() => {
      setOptions([
        {
          label: '教授',
          value: '教授'
        },
        {
          label: '副教授',
          value: '副教授'
        },
        {
          label: '院士',
          value: '院士'
        },
        {
          label: '特任研究院',
          value: '特任研究院'
        },
        {
          label: '特任教授',
          value: '特任教授'
        },
        {
          label: '助理教授',
          value: '助理教授'
        },
        {
          label: '讲师',
          value: '讲师'
        }
      ])
    }, [JSON.stringify(state)])

    return (
      <AntdSelect
        mode="multiple"
        options={innerOptions}
        value={props.value}
        onChange={props.onChange}
      />
    )
  }
  const columns = [
    {
      title: '工号',
      dataIndex: 'tea_id'
      //render: (_) => <a>{_}</a>
    },
    {
      title: '姓名',
      dataIndex: 'tea_name'
      //render: (_) => <a>{_}</a>
    },
    {
      title: '性别',
      dataIndex: 'tea_gender',
      //render: (_) => <a>{_}</a>
      valueType: 'radio',
      //initialValue: '全部',
      valueEnum: {
        全部: { text: '全部' },
        男: { text: '男' },
        女: { text: '女' }
      }
    },
    {
      title: '手机号码',
      dataIndex: 'tea_phone'
    },
    {
      title: '邮箱',
      dataIndex: 'tea_email',
      hideInSearch: true
    },
    {
      title: '出生日期',
      dataIndex: 'tea_birthday',
      hideInSearch: true
    },
    {
      title: '照片',
      dataIndex: 'tea_photo',
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: '所属院系',
      dataIndex: 'tea_department_name',
      valueType: 'select',
      valueEnum: department
    },
    {
      title: '民族',
      dataIndex: 'tea_ethnicity',
      hideInSearch: true
    },
    {
      title: '政治面貌',
      dataIndex: 'tea_political',
      valueType: 'select',
      valueEnum: {
        全部: { text: '全部' },
        中共党员: { text: '中共党员' },
        中共预备党员: { text: '中共预备党员' },
        共青团员: { text: '共青团员' },
        无党派人士: { text: '无党派人士' },
        群众: { text: '群众' },
        其他: { text: '其他' }
      }
    },
    {
      title: '通讯地址',
      dataIndex: 'tea_address',
      hideInSearch: true
    },
    {
      title: '职称',
      dataIndex: 'tea_title',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return <MySelect {...rest} />
      }
    },
    {
      title: '状态',
      dataIndex: 'tea_status',
      //filters: true,
      valueEnum: {
        在职: { text: '在职', status: 'Success' },
        已离职: { text: '已离职', status: 'Error' }
      }
    },
    {
      title: '入职时间',
      key: 'tea_entry_date',
      dataIndex: 'tea_entry_date',
      valueType: 'date',
      hideInSearch: true,
      sorter: (a, b) => a.tea_entry_date - b.tea_entry_date
    },
    {
      title: '离职时间',
      key: 'tea_term_date',
      dataIndex: 'tea_term_date',
      valueType: 'date',
      hideInSearch: true,
      show: false,
      //hideInSetting: true,

      sorter: (a, b) => a.tea_term_date - b.tea_term_date
    },
    {
      title: '入职时间',
      key: 'dateRange',
      dataIndex: 'createdAtRange',
      valueType: 'dateRange',
      hideInTable: true,
      hideInSetting: true
    },

    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => {
        return [
          <a
            key="link1"
            onClick={() => {
              teacherInfoModalRef.current.setTeacherInfoId(record.tea_id)
            }}
          >
            查看
          </a>,
          <a key="link2">
            <Link to={`/teacher/edit/${record.tea_id}`}>编辑</Link>
          </a>,
          <TableDropdown
            key="actionGroup"
            menus={[
              { key: 'copy', name: '复制' },
              { key: 'delete', name: '删除' }
            ]}
          />
        ]
      }
    }
  ]
  const formItemLayout = {
    wrapperCol: {
      span: 24
    }
  }
  function getCellWidth(value) {
    // 判断是否为null或undefined
    if (value == null) {
      return 10
    } else if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
      // 判断是否包含中文
      return value.toString().length * 2.1
    } else {
      return value.toString().length * 1.1
      /* 另一种方案
      value = value.toString()
      return value.replace(/[\u0391-\uFFE5]/g, 'aa').length
      */
    }
  }
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
  return (
    <PageContainer>
      <AddTeacherModal cRef={addTeacherModalRef} />
      <TeacherInfoModal cRef={teacherInfoModalRef} />
      <Drawer
        width={435}
        title={<span>信息导出 </span>}
        visible={downloadVisible}
        confirmLoading={confirmLoading}
        onOk={async () => {
          await form.validate()
          const filename = form.getFieldValue('filename')

          const selectData = []
          if (selectedRowKeys.length <= 0 || options.length <= 0) {
            Message.warning('请选择数据或者数据项')
            return
          }

          for (let a of data) {
            for (const b of selectedRowKeys) {
              if (a.tea_id == b) {
                if (a.tea_birthday) {
                  a.tea_birthday = dayjs(a.tea_birthday).format('YYYY-MM-DD')
                }

                selectData.push(a)
                break
              }
            }
          }

          for (let i = 0; i < selectData.length; i++) {
            selectData[i] = pick(selectData[i], options)
          }

          const worksheet = XLSX.utils.json_to_sheet(selectData)
          const workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, filename)
          const headers = []

          for (const a of options) {
            for (const b of data1) {
              if (a == b.value) {
                headers.push(b.label)
                break
              }
            }
          }

          let colWidths = [],
            colNames = Object.keys(selectData[0]) // 所有列的名称数组

          // 计算每一列的所有单元格宽度
          // 先遍历行
          selectData.forEach((row) => {
            // 列序号
            let index = 0
            // 遍历列
            for (const key in row) {
              if (colWidths[index] == null) colWidths[index] = []

              switch (typeof row[key]) {
                case 'string':
                case 'number':
                case 'boolean':
                  colWidths[index].push(getCellWidth(row[key]))
              }
              index++
            }
          })

          worksheet['!cols'] = []
          // 每一列取最大值最为列宽
          colWidths.forEach((widths, index) => {
            // 计算列头的宽度
            widths.push(getCellWidth(colNames[index]))
            // 设置最大值为列宽
            worksheet['!cols'].push({
              wch: Math.max(...widths)
            })
          })

          XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' })

          if (zipValue == 'zip') {
            let zip = new JSZip()
            const workBookBuffer = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array',
              compression: compressionValue
            })
            const fileData = new Blob([workBookBuffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            })
            zip.file(`${filename}.xlsx`, fileData)
            zip.generateAsync({ type: 'blob' }).then(function (blob) {
              saveAs(blob, `${filename}.zip`)
            })
          } else {
            XLSX.writeFile(workbook, `${filename}.xlsx`, { compression: compressionValue })
          }
        }}
        onCancel={() => {
          setDownloadVisible(false)
        }}
      >
        <div style={{ marginTop: 20, marginBottom: -10, fontSize: 16, fontWeight: 500 }}>
          数据项选择
        </div>
        <Divider />

        <Transfer
          style={{ width: 400 }}
          dataSource={data1}
          defaultValue={['tea_id', 'tea_name']}
          draggable
          onChange={(values, items) => {
            setOptions(values)
          }}
        />
        <Row>
          <Col span={12}>
            <div style={{ marginTop: 30, marginBottom: -8, fontSize: 16, fontWeight: 500 }}>
              是否压缩
            </div>
            <Divider style={{ marginBottom: 8 }} />
            <SimeRadioGroup
              value={compressionValue}
              onChange={(e) => {
                setCompressionValue(e.target.value)
              }}
            >
              <SimeRadio value={false}>不压缩</SimeRadio>
              <SimeRadio value={true}>压缩</SimeRadio>
            </SimeRadioGroup>
          </Col>
          <Col span={12}>
            <div style={{ marginTop: 30, marginBottom: -8, fontSize: 16, fontWeight: 500 }}>
              打包方式
            </div>
            <Divider style={{ marginBottom: 8 }} />
            <SimeRadioGroup
              value={zipValue}
              onChange={(e) => {
                setZipValue(e.target.value)
              }}
            >
              <SimeRadio value={'excel'}>Excel</SimeRadio>
              <SimeRadio value={'zip'}>Zip</SimeRadio>
            </SimeRadioGroup>
          </Col>
        </Row>

        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            label="文件名/文件夹名"
            field="filename"
            rules={[{ required: true, message: '文件名或文件夹名不可为空' }]}
          >
            <Input placeholder="请输入文件名或文件夹名称" />
          </Form.Item>
        </Form>
      </Drawer>
      <ProTable
        columns={columns}
        request={request}
        rowKey="tea_id"
        pagination={{
          showQuickJumper: true
        }}
        search={{
          //optionRender: false,
          collapsed: false
        }}
        options={{
          fullScreen: true
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: setColumnsStateMap
        }}
        rowSelection={rowSelection}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a>批量删除</a>
              <a
                onClick={() => {
                  setDownloadVisible(true)
                  form.setFieldsValue({ filename: '教师信息表' })
                }}
              >
                导出数据
              </a>
            </Space>
          )
        }}
        //dateFormatter="string"
        headerTitle="所有教师"
        toolBarRender={() => [
          <Button key="show">
            你好
            {/* <a href={`/teacher/edit/1`} target="_blank" /> */}
          </Button>,
          <Button
            key="out"
            onClick={() => {
              setDownloadVisible(true)
              form.setFieldsValue({ filename: '教师信息表' })
            }}
          >
            导出数据
            <DownOutlined />
          </Button>,
          <Button
            type="primary"
            onClick={() => addTeacherModalRef.current.setAddTeacherVisible(true)}
            key="primary"
          >
            添加教师
          </Button>
        ]}
      />
    </PageContainer>
  )
}
export default Teacher
