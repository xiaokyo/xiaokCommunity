import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import doPromise from '@common/doPromise';
import fetch from 'node-fetch';

//新建graphql客户链接
export const client = new ApolloClient ({
  uri: __DEV__ ? '/graphql' : 'http://127.0.0.1:3000/graphql',
  fetch,
});
console.log (client);
//封装graphql的请求
export const graphql = ({type = 'query', args}) => {
  return doPromise (
    new Promise (async (resolve, reject) => {
      let accessToken = __CLIENT__ ? localStorage.getItem ('accessToken') : '';
      let headers = {
        authorization: `bearer ${accessToken}`,
      };

      let _send = graphqlQuery;
      console.log (type);
      if (type == 'mutation') _send = graphqlMutate;

      const [err, res] = await doPromise (_send ({args, headers}));
      if (err) return reject (err);
      return resolve (res);
    })
  );
};

//query
const graphqlQuery = async ({args, headers}) => {
  const [err, res] = await doPromise (
    client.query ({
      query: gql`
      query${args}
    `,
      context: {
        headers,
      },
    })
  );
  if (err) throw new Error (err);
  return res;
};

//mutate
const graphqlMutate = async ({args, headers}) => {
  const [err, res] = await doPromise (
    client.mutate ({
      mutation: gql`
        mutation${args}
      `,
      context: {
        headers,
      },
    })
  );

  if (err) throw new Error (err);
  return res;
};

// graphql ({args: '{users{username password}}'});
