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
    // if (data.length <= 0) {
    //   fetchUserData () (dispatch);
    // }
    return () => {};
  }, []);

  return (
    <div>
      <MetaTags>
        <title>home</title>
        <meta name="description" content="Some description." />
        <meta property="og:title" content="MyApp" />
        <meta property="og:image" content="path/to/image.jpg" />
      </MetaTags>

      <div>
        <img src={require ('./images/avatar.jpg')} />
      </div>
    </div>
  );
};
