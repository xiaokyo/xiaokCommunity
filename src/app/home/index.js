import React, {useState, useEffect} from 'react';
import MetaTags from 'react-meta-tags';
import {useSelector, useDispatch} from 'react-redux';

//redux
import {fetchUserData} from '../../redux/actions/userInfo';

//style
import './style.less';

export default props => {
  const data = useSelector (state => state.userInfo);
  const dispatch = useDispatch ();

  useEffect (() => {
    if (data.length <= 0) {
      fetchUserData () (dispatch);
    }
    return () => {};
  }, []);

  return (
    <div className="main" styleName="main">
      <MetaTags>
        <title>home</title>
        <meta name="description" content="Some description." />
        <meta property="og:title" content="MyApp" />
        <meta property="og:image" content="path/to/image.jpg" />
      </MetaTags>

      <div className="zs" styleName="zs">
        <img src={require ('./images/avatar.jpg')} />
        {/* {state.map ((item, index) => <span key={item}>{item}</span>)} */}
        {data.map ((item, index) => (
          <div key={item.circuitId}>{item.circuitId}</div>
        ))}
      </div>
    </div>
  );
};
