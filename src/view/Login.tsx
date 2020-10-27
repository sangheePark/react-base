import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, Checkbox, Col, Row } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { MLogin } from '@model/user'

export interface ILoginProps {
  value: MLogin
  onClick: (login: MLogin) => void
}
const Login: React.FC<ILoginProps> = ({ value, onClick }): React.ReactElement => {
  const { t, i18n } = useTranslation(['login', 'valid', 'error'])
  const [state, setState] = useState<MLogin>({
    ...value
  })

  const onFinish = (values: any) => {
    // console.log('value:' + JSON.stringify(state))
    onClick(state)
  }

  const handelChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name }
    } = e

    // console.log('name:' + name)
    // console.log('value:' + value)
    setState({
      ...state,
      [name]: value
    })
  }
  return (
    <Row justify="center" align="middle" style={{ height: '100%' }}>
      <Col>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="id"
            rules={[
              {
                required: true,
                message: t('valid:required', { field: t('id') })
              }
            ]}
          >
            <Input
              name="id"
              value={value.id}
              onChange={handelChangeInput}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder={t('id')}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t('valid:required', { field: t('password') })
              }
            ]}
          >
            <Input
              name="password"
              value={value.password}
              onChange={handelChangeInput}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={t('password')}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default Login
