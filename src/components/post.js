import React, { useState } from "react";
import { Drawer } from "antd";

export default props => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <div className="mobile-post">
      <i
        className="iconfont iconbianji post-btn"
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
            onClick={() => PostRouter("/personal-index?page=question")}
          >
            <i
              className="iconfont icontiwen"
              style={{ fontSize: 50, color: "#7495FF" }}
            />
            <span>提问</span>
          </div>
          <div className="_btn flex fyc" onClick={() => PostRouter("/article")}>
            <i
              className="iconfont iconfawen"
              style={{ fontSize: 50, color: "#7495FF" }}
            />
            <span>发布</span>
          </div>
        </div>
        <div className="closeDrawer flex fyc fxc">
          <i
            className="iconfont iconguanbi1"
            style={{ fontSize: 14, color: "#333333" }}
            onClick={onClose}
          />
        </div>
      </Drawer>
    </div>
  );
};
