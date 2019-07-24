import axios from 'axios';
import doPromise from '@common/doPromise';

const savePostList = data => ({type: 'SAVE_POSTLIST', data});
const loadMorePostList = data => ({type: 'LOAD_MORE_POSTLIST', data});

export const load_postlist = () => {
  return dispatch =>
    new Promise (async (resolve, reject) => {
      const [err, res] = await doPromise (axios ('/postList'));
      if (err) reject (err);
      dispatch (savePostList (res.data));
      resolve ('');
    });
};

export const load_more_postlist = () => {
  return dispatch =>
    new Promise (async (resolve, reject) => {
      const [err, res] = await doPromise (axios ('/loadMorePost'));
      if (err) reject (err);
      dispatch (loadMorePostList (res.data));
      resolve ('');
    });
};
