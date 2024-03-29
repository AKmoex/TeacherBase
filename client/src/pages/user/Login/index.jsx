import Footer from '@/components/Footer'
import { getFakeCaptcha } from '@/services/login'
import { login } from '@/services/user'
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form'
import { Alert, message, Tabs } from 'antd'
import localStorage from 'localStorage'
import { useState } from 'react'
import { FormattedMessage, history, SelectLang, useIntl, useModel } from 'umi'
import styles from './index.less'

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24
    }}
    message={content}
    type="error"
    showIcon
  />
)

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({})
  const [type, setType] = useState('account')
  const { initialState, setInitialState } = useModel('@@initialState')
  const intl = useIntl()

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.()
    // if(userInfo === undefined ){
    //   await localStorage.removeItem('token');
    // }

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }))
    }
  }

  const handleSubmit = async (values) => {
    try {
      // 登录
      const msg = await login({ ...values, type })

      if (msg.status === 'ok') {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！'
        })
        message.success(defaultLoginSuccessMessage)
        await localStorage.setItem('token', msg.token)
        await fetchUserInfo()
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return
        const { query } = history.location
        const { redirect } = query
        history.push(redirect || '/')
        return
      }

      console.log(msg) // 如果失败去设置用户错误信息

      setUserLoginState(msg)
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！'
      })
      message.error(defaultLoginFailureMessage)
    }
  }

  const { status, type: loginType } = userLoginState
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="TeacherBase"
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout.title'
          })}
          initialValues={{
            autoLogin: true
          }}
          onFinish={async (values) => {
            await handleSubmit(values)
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录'
              })}
            />
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误'
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="id"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.id.placeholder',
                  defaultMessage: '工号'
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage id="pages.login.id.required" defaultMessage="请输入工号!" />
                    )
                  }
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码'
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    )
                  }
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号'
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    )
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    )
                  }
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />
                }}
                captchaProps={{
                  size: 'large'
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码'
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码'
                    })}`
                  }

                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码'
                  })
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    )
                  }
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone
                  })

                  if (result === false) {
                    return
                  }

                  message.success('获取验证码成功！验证码为：1234')
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right'
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  )
}

export default Login
