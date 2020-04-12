import React, { useState, useEffect } from 'react'
import { useDispatch, useStore, useSelector } from 'react-redux'
import { Link, withRouter } from 'react-router-dom';
import { Drawer, Button, Badge } from 'antd'

// style
import './avatarMenu.less'

//actions
import { logout } from '@redux/actions/userInfo';

//socket
import socketConnect from '@socket';

export default withRouter(({ _id, avatar, username, history }) => {

  const [visible, setVisible] = useState(false)
  const showDrawer = () => setVisible(true)
  const onClose = () => setVisible(false)

  const dispatch = useDispatch();
  // 退出并删除本地token
  const _logout = () => logout()(dispatch)

  const store = useStore()
  const [notification, userInfo] = useSelector(state => [state.notification, state.userInfo])
  const noreadArr = notification.filter(item => item['isread'] == false)

  useEffect(() => {
    socketConnect(store)
  }, [userInfo])

  const routerPush = url => {
    history.push(url)
    setVisible(false)
  }

  return (
    <div className="avatarMenu">
      <Badge count={noreadArr.length}>
        <img src={avatar} className="avatar" onClick={() => showDrawer()} />
      </Badge>

      <Drawer
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <div className="menuBox">
          <img src={avatar} className="avatar" />
          <div className="username">{username}</div>

          <ul className="menu-list">
            <li onClick={() => routerPush(`/user/${_id}`)}>
              <div>
                <i className="iconfont icon-people" />
                <span>我的主页</span>
              </div>
            </li>

            <li onClick={() => routerPush('/creditCards')}>
              <div>
                <i className="iconfont icon-qiapian" />
                <span>我的卡片</span>
              </div>
            </li>
            
            <li onClick={() => routerPush('/notification')}>
              <div>
                <i className="iconfont icon-notice" />
                <span>我的动态</span>
              </div>
              <Badge count={noreadArr.length} />
            </li>
            <li onClick={() => routerPush('/setting')}>
              <div>
                <i className="iconfont icon-settings_light" />
                <span>设置</span>
              </div>
            </li>
          </ul>

          <div className="logout">
            <Button
              type="danger"
              icon="poweroff"
              onClick={() => _logout()}
            >
              退出登录
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
})