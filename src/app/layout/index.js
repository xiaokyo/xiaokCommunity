import React from 'react';
import {Route, Link, Switch} from 'react-router-dom';

//routers
import routers from '../../routers';

export default props => {
  return (
    <div>
      <ul>
        <li><Link to="/">home</Link></li>
        <li><Link to="/notification">notification</Link></li>
      </ul>

      {/* {routers.map ((item, index) => (
        <Route
          key={index}
          exact={true}
          path={item.path}
          component={item.component}
        />
      ))} */}

      <Switch>
        {routers.map (route => <Route key={route.path} {...route} />)}
      </Switch>

    </div>
  );
};
