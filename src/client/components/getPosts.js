import React, { Component } from 'react';
import { Query } from "react-apollo";
import Loading from '../loading';
import Error from '../error';
import gql from "graphql-tag";

const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int, $username: String) { 
    postsFeed(page: $page, limit: $limit, username: $username) { 
      posts {
        id
        text
        user {
          avatar
          username
        }
      }
    }
  }
`;

export const useGetPostsQuery = ( variables)=> useQuery(GET_POSTS, { pollInterval: 5000, variables: { page: 0, limit: 10 , ...variables}});
