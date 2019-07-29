import React from 'react';
import {useDispatch} from 'react-redux';
import {Form, Icon, Input, Button, message} from 'antd';

//style
import './style.less';
import {graphql} from '@graphql';

export default Form.create ({name: 'register'}) (props => {
  console.log ('register render');
  const {getFieldDecorator} = props.form;
  const dispatch = useDispatch ();

  // 处理form提交
  const handleSubmit = e => {
    e.preventDefault ();
    props.form.validateFields ((err, values) => {
      if (!err) {
        // console.log ('Received values of form: ', values);
        const {username, password, confrimPassword} = values;

        if (password != confrimPassword) return message.warning ('两次输入的密码不相同');
        const toPath = props.location.state
          ? props.location.state.from.pathname
          : '/login';

        regUser (username, password)
          .then (res => props.history.push (toPath))
          .catch (err => message.error (err));
      }
    });
  };

  //register graphql
  const regUser = async (username, password) => {
    const args = `{
      addUser(username:"${username}",password:"${password}"){
        success
        msg
      }
    }`;
    const [err, res] = await graphql ({type: 'mutation', args});
    if (err) throw new Error ('网络错误');
    if (!res.data.addUser.success) throw new Error ('注册失败');
    return message.success ('注册成功');
  };

  return (
    <div styleName="register">
      <h1>注册</h1>
      <div styleName="_box">
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator ('username', {
              rules: [{required: true, message: '请输入用户名！'}],
            }) (
              <Input
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                placeholder="用户名"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator ('password', {
              rules: [{required: true, message: '请输入密码！'}],
            }) (
              <Input
                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                type="password"
                placeholder="密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator ('confrimPassword', {
              rules: [{required: true, message: '请确认密码！'}],
            }) (
              <Input
                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                type="password"
                placeholder="确认密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            {/* <a className="login-form-forgot" href="">
              Forgot password
            </a> */}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});
