import { gql } from '@apollo/client';

import { USER_ATTRIBUTES } from '../fragments/userAttributes';

export const ADD_POST = gql' mutation addPost($post : PostInput!) {addPost(post : $post) {id text user {  ...userAttributes } }}
 ${USER_ATTRIBUTES}
';
