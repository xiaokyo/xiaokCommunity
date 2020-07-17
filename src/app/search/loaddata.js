import { graphql } from '@graphql';

export const searchList = async (key, limit, skip) => {
	const args = `searchPosts($key:String!,$limit:Int,$skip:Int){
    searchPosts(key:$key,limit:$limit,skip:$skip){
      _id
      title
      content
      user{
        _id
        username
      }
    }
  }`;

	const [err, res] = await graphql({ args, variables: { key, limit, skip } });
	if (err) throw new Error(err);
	return res.searchPosts;
};
