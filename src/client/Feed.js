import React, { useState } from 'react';
import { gql, useQuery, useMutation, InMemoryCache } from '@apollo/client';
import Post from './components/post';

const GET_POSTS=gql`
query {
posts {
id
text
user
{
avatar
username
}
}
}
`;


const ADD_POST = gql`
mutation addPost($post: PostInput!){
addPost(post: $post){
id
text
user {
username 
avatar
}
}
}`;




const Feed = () => {
    const [postContent, setPostContent] = useState('');
    const { loading, error, data, fetchMore } = useQuery(GET_POSTS);
   // const [addPost] = useMutation(ADD_POST);
    const [addPost] = useMutation(ADD_POST, { refetchQueries: [{ query: GET_POSTS }]});

//const [addPost] = useMutation(ADD_POST, {
//	update(cache, { data: {addPost }})   {
//	const data = cache.readQuery({ query: GET_POSTS });
//	const newData = { posts: [addPost, ...data.posts]};
//	cache.writeQuery({ query: GET_POSTS, data: newData });
//}
//});

    const handleSubmit = (event) => {
    event.preventDefault();
    addPost({ variables: { post: { text: postContent }}});
    setPostContent(''); 
};
if (loading) return 'Loading...';
if (error) return `Error! ${error.message}`;

const { posts } = data;

return (
        <div className="container">
            <div className="postForm">
                <form onSubmit={handleSubmit}>
                    <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Write your custom post!"/>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            <div className="feed">
                {posts.map((post, i) =>
                   <Post key={post.id} post={post}/>
	        )} 
            </div>  


	</div>)}


export default Feed
