import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import doPromise from '@common/doPromise';
import fetch from 'node-fetch';
import config from '@config';

//新建graphql客户链接
export const client = new ApolloClient({
	uri: config.graphql,
	fetch,
});

//封装graphql的请求
export const graphql = ({ type = 'query', args, variables = {}, _accessToken = '' }) => {
	return doPromise(
		new Promise(async (resolve, reject) => {
			let accessToken = __CLIENT__ ? localStorage.getItem('accessToken') : '';
			accessToken = accessToken == '' ? _accessToken : accessToken;
			let headers = {
				authorization: `bearer ${accessToken}`,
			};

			let _send = graphqlQuery;
			// console.log(type);
			if (type == 'mutation') _send = graphqlMutate;

			const [err, res] = await doPromise(_send({ args, headers, variables }));
			if (err) return reject(err);
			return resolve(res.data);
		})
	);
};

//query
const graphqlQuery = async ({ args, headers, variables }) => {
	const [err, res] = await doPromise(
		client.query({
			query: gql`
      query ${args}
			
    `,
			context: {
				headers,
			},
			variables,
			fetchPolicy: 'no-cache',
		})
	);
	if (err) throw new Error(err);
	return res;
};

//mutate
const graphqlMutate = async ({ args, headers, variables }) => {
	const [err, res] = await doPromise(
		client.mutate({
			mutation: gql`
        mutation ${args}
      `,
			context: {
				headers,
			},
			variables,
		})
	);
	if (err) throw new Error(err);
	return res;
};
