import React from 'react';
import {useDispatch} from 'react-redux';
import {Form, Icon, Input, Button, Checkbox} from 'antd';

//actions
import {login} from '@redux/actions/userInfo';

//style
import './style.less';

export default Form.create ({name: 'login'}) (props => {
  console.log (props);
  const {getFieldDecorator} = props.form;
  const dispatch = useDispatch ();

  // 处理form提交
  const handleSubmit = e => {
    e.preventDefault ();
    props.form.validateFields ((err, values) => {
      if (!err) {
        // console.log ('Received values of form: ', values);
        const {username, password} = values;
        const fromPath = props.location.state
          ? props.location.state.from.pathname
          : '/';
        login (username, password) (dispatch).then (res => {
          props.history.push (fromPath);
        });
      }
    });
  };

  return (
    <div styleName="login">
      <h1>登录</h1>
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
