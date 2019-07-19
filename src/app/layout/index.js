import React from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Row, Col} from 'antd';

//routers
import routers from '../../routers';

//style
import './style.less';

export default props => {
  return (
    <div className="container">
      <div className="header">
        <Row>
          <Col xs={2} sm={4} md={6} lg={8} xl={10}>
            <div className="item" />
          </Col>
          <Col xs={2} sm={4} md={6} lg={8} xl={10}>
          <div className="item" />
          </Col>
          <Col xs={2} sm={4} md={6} lg={8} xl={10}>
          <div className="item" />
          </Col>
        </Row>
      </div>
      <div className="box">
        <Switch>
          {routers.map (route => (
            <Route
              key={route.path}
              exact={route.exact}
              path={route.path}
              component={route.component}
            />
          ))}
        </Switch>
      </div>
    </div>
  );
};
