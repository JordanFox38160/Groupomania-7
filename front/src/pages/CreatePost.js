import React from 'react';
import Navigation from '../components/Navigation';
import ContainerCreatePost from '../components/ContainerCreatePost';
import FooterContainer from '../components/Footer';

const CreatePage = () => {
    return (
        <div>
            <Navigation />
            <ContainerCreatePost />
            <FooterContainer />
        </div>
    );
};

export default CreatePage;