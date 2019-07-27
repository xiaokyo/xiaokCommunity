import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import doPromise from '@common/doPromise';

const client = new ApolloClient ({
  uri: '/graphql',
});

export const graphql = ({type = 'query', args, headers = {}}) => {
  return doPromise (
    new Promise (async (resolve, reject) => {
      if (type == 'query') {
        await client
          .query ({
            query: gql`
        ${type}${args}
      `,
            context: {
              headers,
            },
          })
          .then (data => {
            console.log (data);
            resolve (data);
          })
          .catch (error => reject (error));
      } else {
        await client
          .mutate ({
            mutation: gql`
        ${type}${args}
      `,
            context: {
              headers,
            },
          })
          .then (data => {
            console.log (data);
            resolve (data);
          })
          .catch (error => reject (error));
      }
    })
  );
};

// graphql ({args: '{users{username password}}'});
