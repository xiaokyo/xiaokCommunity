import axios from 'axios';
import {graphql} from '@graphql';
import doPromise from '@common/doPromise';

const savePostList = data => ({type: 'SAVE_POSTLIST', data});
const loadMorePostList = data => ({type: 'LOAD_MORE_POSTLIST', data});

export const load_postlist = () => {
  return dispatch =>
    new Promise (async (resolve, reject) => {
      const args = `{
        getPosts(limit:10,skip:0){
          _id
          title
          like
          createDate
          description
          user{
            _id
            username
          }
        }
      }`;

      const [err, res] = await graphql ({args});
      if (err) return reject (err);
      if (res.data.getPosts.length < 0) return reject ('没有帖子');
      dispatch (savePostList (res.data.getPosts));
      resolve (res.data.getPosts);
    });
};

export const load_more_postlist = pageIndex => {
  return dispatch =>
    new Promise (async (resolve, reject) => {
      const args = `{
        getPosts(limit:10,skip:${pageIndex}){
          _id
          title
          description
          like
          createDate
          user{
            _id
            username
          }
        }
      }`;

      const [err, res] = await graphql ({args});
      if (err) return reject (err);
      if (res.data.getPosts.length <= 0) return reject ('没有帖子');
      dispatch (loadMorePostList (res.data.getPosts));
      resolve (res.data.getPosts);
    });
};
