import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Feed from './Feed';
import '../../assets/css/style.css';


const App = () => {
        return (
            <div className="container">
                <Helmet>
                    <title>Graphbook - Feed</title>
                    <meta name="description" content="Newsfeed of all your friends on Graphbook" />
                </Helmet>
                <Feed />
            </div>
        )
    }
export default App
