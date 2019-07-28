import axios from 'axios';
import {graphql} from '@graphql';
import doPromise from '@common/doPromise';

const savePostList = data => ({type: 'SAVE_POSTLIST', data});
const loadMorePostList = data => ({type: 'LOAD_MORE_POSTLIST', data});

export const load_postlist = () => {
  return dispatch =>
    new Promise (async (resolve, reject) => {

      const args = `{
        getPosts{
          title
          content
        }
      }`;

      const [err, res] = await graphql ({args});
      if (err) return reject (err);
      if (res.data.getPosts.length < 0) return reject ('没有帖子');
      dispatch (savePostList (res.data.getPosts));
      resolve ();
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
