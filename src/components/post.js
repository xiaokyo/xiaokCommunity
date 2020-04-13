import React, { useState } from "react"
import {withRouter} from 'react-router-dom'
import { Drawer } from "antd"

export default withRouter(({history}) => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <div className="mobile-post">
      <i
        className="iconfont icon-bianji post-btn"
        style={{ fontSize: 50 }}
        onClick={showDrawer}
      />
      <Drawer
        // title="Basic Drawer"
        height={185}
        className="drawerPost"
        placement="bottom"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <div className="flex fyc fxc post-btn-group">
          <div
            className="_btn flex fyc"
            onClick={() => history.push("/sendPost")}
          >
            <i
              className="iconfont icon-tiwen"
              style={{ fontSize: 50, color: "#e3a86c" }}
            />
            <span>提问</span>
          </div>
          <div className="_btn flex fyc" onClick={() => history.push("/sendPost")}>
            <i
              className="iconfont icon-fawen"
              style={{ fontSize: 50, color: "#e3a86c" }}
            />
            <span>发布</span>
          </div>
        </div>
        <div className="closeDrawer flex fyc fxc">
          <i
            className="iconfont icon-guanbi1"
            style={{ fontSize: 14, color: "#333333" }}
            onClick={onClose}
          />
        </div>
      </Drawer>
    </div>
  );
})
