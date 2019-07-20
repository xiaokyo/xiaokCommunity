import React from 'react';
import {useDispatch} from 'react-redux';
import {fetchUserData} from '../../redux/actions/userInfo';

export default props => {
  console.log (props);

  const dispatch = useDispatch ();

  const login = () => {
    fetchUserData () (dispatch).then (res =>
      props.history.push (props.location.state.from.pathname)
    );
  };

  return <div onClick={login}>login</div>;
};
