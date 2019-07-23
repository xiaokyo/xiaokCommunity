import {savePostById} from '../../redux/actions/posts';

export default () => {
  return async (dispatch, match) => {
    await savePostById (match.params.id) (dispatch);
  };
};
