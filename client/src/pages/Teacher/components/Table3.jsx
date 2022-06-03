import { Button, Form, Input, Select, Steps, Table } from '@arco-design/web-react'
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
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
const EditableContext = React.createContext({})

const EditableRow = (props) => {
  const { children, record, className, ...rest } = props
  const refForm = useRef(null)
  const getForm = () => refForm.current

  return (
    <EditableContext.Provider value={{ getForm }}>
      <Form
        style={{ display: 'table-row' }}
        children={children}
        ref={refForm}
        wrapper="tr"
        wrapperProps={rest}
        className={`${className} editable-row`}
      />
    </EditableContext.Provider>
  )
}

const EditableCell = (props) => {
  const { children, className, rowData, column, onHandleSave } = props

  const ref = useRef(null)
  const refInput = useRef(null)
  const { getForm } = useContext(EditableContext)
  const [editing, setEditing] = useState(false)

  const handleClick = useCallback(
    (e) => {
      if (
        editing &&
        column.editable &&
        ref.current &&
        !ref.current.contains(e.target) &&
        !e.target.classList.contains('js-demo-select-option')
      ) {
        cellValueChangeHandler(rowData[column.dataIndex])
      }
    },
    [editing, rowData, column]
  )

  useEffect(() => {
    editing && refInput.current && refInput.current.focus()
  }, [editing])

  useEffect(() => {
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [handleClick])

  const cellValueChangeHandler = (value) => {
    if (column.dataIndex === 'fam_relation') {
      const values = { [column.dataIndex]: value }
      onHandleSave && onHandleSave({ ...rowData, ...values })
      setTimeout(() => setEditing(!editing), 300)
    } else {
      const form = getForm()
      form.validate([column.dataIndex], (errors, values) => {
        if (!errors || !errors[column.dataIndex]) {
          setEditing(!editing)
          onHandleSave && onHandleSave({ ...rowData, ...values })
        }
      })
    }
  }

  if (editing) {
    if (column.dataIndex === 'fam_relation') {
      return (
        <div ref={ref}>
          <FormItem
            style={{ marginBottom: 0 }}
            labelCol={{
              span: 0
            }}
            wrapperCol={{
              span: 24
            }}
            initialValue={rowData[column.dataIndex]}
            field={column.dataIndex}
            rules={[
              {
                required: true,
                message: '关系必须选择'
              }
            ]}
          >
            <Select
              onChange={cellValueChangeHandler}
              defaultValue={rowData[column.dataIndex]}
              options={['父亲', '母亲', '夫妻', '子女', '兄弟', '姐妹']}
            />
          </FormItem>
        </div>
      )
    } else if (column.dataIndex === 'fam_phone') {
      return (
        <div ref={ref}>
          <FormItem
            style={{ marginBottom: 0 }}
            labelCol={{
              span: 0
            }}
            wrapperCol={{
              span: 24
            }}
            initialValue={rowData[column.dataIndex]}
            field={column.dataIndex}
          >
            <Input ref={refInput} onPressEnter={cellValueChangeHandler} />
          </FormItem>
        </div>
      )
    } else {
      return (
        <div ref={ref}>
          <FormItem
            style={{ marginBottom: 0 }}
            labelCol={{
              span: 0
            }}
            wrapperCol={{
              span: 24
            }}
            initialValue={rowData[column.dataIndex]}
            field={column.dataIndex}
            rules={[
              {
                required: true,
                message: '姓名不能为空'
              }
            ]}
          >
            <Input ref={refInput} onPressEnter={cellValueChangeHandler} />
          </FormItem>
        </div>
      )
    }
    // return (
    //   <div ref={ref}>
    //     {column.dataIndex === 'fam_relation' ? (
    //       <Select
    //         onChange={cellValueChangeHandler}
    //         defaultValue={rowData[column.dataIndex]}
    //         options={['父亲', '母亲', '夫妻', '子女', '兄弟', '姐妹']}
    //       />
    //     ) : (
    //       <FormItem
    //         style={{ marginBottom: 0 }}
    //         labelCol={{
    //           span: 0
    //         }}
    //         wrapperCol={{
    //           span: 24
    //         }}
    //         initialValue={rowData[column.dataIndex]}
    //         field={column.dataIndex}
    //         rules={[
    //           {
    //             required: true
    //           }
    //         ]}
    //       >
    //         <Input ref={refInput} onPressEnter={cellValueChangeHandler} />
    //       </FormItem>
    //     )}
    //   </div>
    // )
  }

  return (
    <div
      className={column.editable ? `editable-cell ${className}` : className}
      onClick={() => column.editable && setEditing(!editing)}
    >
      {children}
    </div>
  )
}

const Table3 = forwardRef((props, ref) => {
  const { tea_familys } = props.props
  console.log('Tbles', props.props.tea_familys)
  const [count, setCount] = useState(tea_familys.length)

  const [table3Data, setTable3Data] = useState(tea_familys)
  useEffect(() => {
    setTable3Data(props.props.tea_familys)
  }, [props.props.tea_familys])
  useImperativeHandle(ref, () => ({
    table3Data: table3Data
  }))
  const columns = [
    {
      title: '姓名',
      dataIndex: 'fam_name',
      editable: true
    },
    {
      title: '关系',
      dataIndex: 'fam_relation',
      editable: true
    },
    {
      title: '联系电话',
      dataIndex: 'fam_phone',
      editable: true
    },
    {
      title: 'Operation',
      dataIndex: 'op',
      render: (col, record) => (
        <Button onClick={() => removeRow(record.key)} type="primary" status="danger">
          Delete
        </Button>
      )
    }
  ]

  const handleSave = (row) => {
    const newData = [...table3Data]
    const index = newData.findIndex((item) => row.key === item.key)
    newData.splice(index, 1, {
      ...newData[index],
      ...row
    })
    setTable3Data(newData)
  }

  const removeRow = (key) => {
    setTable3Data(table3Data.filter((item) => item.key !== key))
  }

  const addRow = () => {
    setCount(count + 1)
    const temp_d3 = table3Data
    temp_d3.push({
      key: `${count + 1}`,
      fam_name: 'name',
      fam_phone: 'phone',
      fam_relation: '父亲'
    })
    setTable3Data(temp_d3)
  }

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30, marginBottom: 50 }}>
      <Button style={{ marginBottom: 10 }} type="primary" onClick={addRow}>
        Add
      </Button>
      <Table
        data={table3Data}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell
          }
        }}
        columns={columns.map((column) =>
          column.editable
            ? {
                ...column,
                onCell: () => ({
                  onHandleSave: handleSave
                })
              }
            : column
        )}
        className="table-demo-editable-cell"
      />
    </div>
  )
})

export default Table3
