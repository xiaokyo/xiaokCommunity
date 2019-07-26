import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import doPromise from '@common/doPromise';

const client = new ApolloClient ({
  uri: 'http://127.0.0.1:3000/graphql',
});

export const graphql = ({type = 'query', args}) => {
  return doPromise (
    new Promise ((resolve, reject) => {
      client
        .query ({
          query: gql`
        ${type}${args}
      `,
        })
        .then (data => {
          console.log (data);
          resolve (data);
        })
        .catch (error => reject (error));
    })
  );
};

graphql ({args: '{users{username password}}'});
