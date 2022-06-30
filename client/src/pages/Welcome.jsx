import { backupSystem } from '@/services/backup'
import { welcome } from '@/services/welcome'
import { PageContainer } from '@ant-design/pro-layout'
import { Card, Descriptions, Divider, Grid } from '@arco-design/web-react'
import { Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'umi'
import styles from './Welcome.less'

const { Row, Col } = Grid
const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
)

const Welcome = () => {
  const [data, setData] = useState({})
  const [sys, setSys] = useState([])

  useEffect(async () => {
    const res1 = await welcome({ keyword: '%' })
    console.log(res1.cnt_data)
    setData(res1.cnt_data)
    const res = await backupSystem({})

    setSys(res.sys)
  }, [])
  return (
    <PageContainer>
      <Row gutter={20}>
        <Col span={16}>
          <Card title="欢迎回来" bordered={false} style={{ width: '100%' }}>
            <Row style={{ textAlign: 'center' }}>
              <Col span={6}>
                <span>教师数量</span>
                <div style={{ fontSize: 30, fontWeight: 700 }}>{data.tea_cnt}</div>
              </Col>
              <Col span={6}>
                <span>院系数量</span>
                <div style={{ fontSize: 30, fontWeight: 700 }}>{data.dep_cnt}</div>
              </Col>
              <Col span={6}>
                <span>科研项目</span>
                <div style={{ fontSize: 30, fontWeight: 700 }}>{data.res_cnt}</div>
              </Col>
              <Col span={6}>
                <span>奖惩记录</span>
                <div style={{ fontSize: 30, fontWeight: 700 }}>{data.arc_cnt}</div>
              </Col>
            </Row>
            <Divider style={{ marginTop: 20 }}></Divider>
            <div style={{ marginTop: 45 }}>快捷入口</div>
            <Row style={{ textAlign: 'center', marginTop: 30 }}>
              <Card.Grid
                hoverable={true}
                style={{
                  width: '25%'
                }}
              >
                <Card className="card-demo-in-grid" style={{ width: '100%' }} bordered={false}>
                  <Link to="/teacher/list">教师管理</Link>
                </Card>
              </Card.Grid>
              <Card.Grid
                hoverable={true}
                style={{
                  width: '25%'
                }}
              >
                <Card className="card-demo-in-grid" style={{ width: '100%' }} bordered={false}>
                  <Link to="/department">院系管理</Link>
                </Card>
              </Card.Grid>
              <Card.Grid
                hoverable={true}
                style={{
                  width: '25%'
                }}
              >
                <Card className="card-demo-in-grid" style={{ width: '100%' }} bordered={false}>
                  <Link to="/research">科研管理</Link>
                </Card>
              </Card.Grid>
              <Card.Grid
                hoverable={true}
                style={{
                  width: '25%'
                }}
              >
                <Card className="card-demo-in-grid" style={{ width: '100%' }} bordered={false}>
                  <Link to="/archive">奖惩管理</Link>
                </Card>
              </Card.Grid>
            </Row>
            <Row style={{ textAlign: 'center' }}>
              <Card.Grid
                hoverable={true}
                style={{
                  width: '25%'
                }}
              >
                <Card className="card-demo-in-grid" style={{ width: '100%' }} bordered={false}>
                  <Link to="/tuser/edit/">个人信息</Link>
                </Card>
              </Card.Grid>
              <Card.Grid
                hoverable={true}
                style={{
                  width: '25%'
                }}
              >
                <Card className="card-demo-in-grid" style={{ width: '100%' }} bordered={false}>
                  <Link to="/tuser/archive">个人奖惩</Link>
                </Card>
              </Card.Grid>
              <Card.Grid
                hoverable={true}
                style={{
                  width: '25%'
                }}
              >
                <Card className="card-demo-in-grid" style={{ width: '100%' }} bordered={false}>
                  <Link to="/tuser/research">个人奖惩</Link>
                </Card>
              </Card.Grid>
              <Card.Grid
                hoverable={true}
                style={{
                  width: '25%'
                }}
              >
                <Card className="card-demo-in-grid" style={{ width: '100%' }} bordered={false}>
                  <Link to="/backup">备份恢复</Link>
                </Card>
              </Card.Grid>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="系统实时信息" bordered={false} style={{ width: '100%' }}>
            <Descriptions
              column={1}
              data={sys}
              style={{ marginBottom: 10 }}
              labelStyle={{ paddingRight: 36, paddingLeft: 20 }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default Welcome
