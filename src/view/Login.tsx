import React, { useState } from 'react'
import { Form, Input, Button, Checkbox, Col, Row } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { MLogin } from '@model/user'

const Login: React.FC = (): React.ReactElement => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values)
  }
  const [state, setState] = useState<MLogin>({
    id: '',
    password: ''
  })
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
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!'
              }
            ]}
          >
            <Input value={state.id} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!'
              }
            ]}
          >
            <Input
              value={state.password}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
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
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default Login
