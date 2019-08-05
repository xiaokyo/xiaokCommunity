import { graphql } from '@graphql';

export const searchList = async (key, limit, skip) => {
	const args = `{
    searchPosts(key:"${key}",limit:${limit},skip:${skip}){
      _id
      title
      description
      user{
        _id
        username
      }
    }
  }`;

	const [err, res] = await graphql({ args });
	if (err) throw new Error(err);
	return res.data.searchPosts;
};
