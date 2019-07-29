import {graphql} from '@graphql';

export const getPostById = id => {
  return postsState => {
    let currentPost = null;
    let isExist = postsState.some (item => {
      // console.log (item);
      currentPost = item;
      return item._id === id;
    });
    if (isExist) {
      return currentPost;
    }

    return {};
  };
};

const savePost = data => ({type: 'SAVE_POST_BY_ID', data});

export const savePostById = id => {
  return dispatch =>
    new Promise (async (resolve, reject) => {
      //请求postbyid
      const args = `{
        getPostById(id:"${id}"){
          _id
          title
          content
          createDate
          user{
            _id
            username
          }
        }
      }`;

      const [err, res] = await graphql ({args});
      if (err) return reject (err);
      if (res.data.getPostById._id == '') return reject ('没有此帖子');
      res.data.getPostById.user.avatar =
        '//img.xiaoduyu.com/88b8737e-870a-45a0-af9e-7ce829fda190.jpg?imageMogr2/crop/!200x200a0a0/thumbnail/!200/quality/90';
      dispatch (savePost (res.data.getPostById));
      return resolve ();
    });
};
