import React from 'react';
import SignUpMain from '../../components/SignUp/SignUpMain';
import HeaderFour from '../../components/Layout/Header/HeaderFour';
import Footer from '../../components/Layout/Footer/Footer';
const SignUp: React.FC = () => {
    return (
        <React.Fragment>
            <HeaderFour />
            <SignUpMain />
            <Footer />
        </React.Fragment>
    );
};

export default SignUp;
