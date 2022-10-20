import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';

import { onError } from "@apollo/client/link/error";

import { gql } from '@apollo/client';

const client = new ApolloClient({

  link: from([

    onError(({ graphQLErrors, networkError }) => {

      if (graphQLErrors) {

        graphQLErrors.map(({ message, locations, path }) =>

        console.log('[GraphQL error]: Message: ${message},Location:${locations}, Path: ${path}'));

        if (networkError) {

          console.log('[Network error]: ${networkError}');

        }

      }

    }),

    new HttpLink({

	    uri: 'http://ec2-3-139-88-139.us-east-2.compute.amazonaws.com:8000/graphql',

    }),

]),

cache: new InMemoryCache(),

});





client.query({
	query: gql`
	{
	posts {
		id
		text
		
		user
		{
		avatar
		username
		}
}
}`
}).then(result => console.log(result));






export default client;
