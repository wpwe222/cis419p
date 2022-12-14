import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Feed from './Feed';
//import Chats from './Chats';
import Bar from './components/bar';
import LoginRegisterForm from './components/loginregister';
import Error from './components/error';
import { useCurrentUserQuery } from './apollo/queries/currentUserQuery';
import Loading from './components/loading';
import { withApollo } from '@apollo/client/react/hoc';
import './components/fontawesome';
import '../../assets/css/style.css';
import 'cropperjs/dist/cropper.css';
import Router from './router';


//testing git #2 

const App = ({ client }) => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('jwt'));
    const { data, error, loading, refetch } = useCurrentUserQuery();

    const handleLogin = (status) => {
        refetch().then(() => {
            setLoggedIn(status);
        }).catch(() => {
            setLoggedIn(status);
        });
    }

    useEffect(() => {
        const unsubscribe = client.onClearStore(
          () => {
            if(loggedIn){
              setLoggedIn(false)
            }
          }
        );
        return () => {
          unsubscribe();
        }
    }, []);


    if(loading) {
        return <Loading />;
    }

    return (
        <div className="container">
            <Helmet>
                <title>Graphbook - Feed</title>
                <meta name="description" content="Newsfeed of all your friends on Graphbook" />
            </Helmet>
            <Router loggedIn={loggedIn} changeLoginState={handleLogin}/>
        </div>
    )
}

export default withApollo(App);
