import React from 'react';
import FooterThree from '../../components/Layout/Footer/FooterThree';
import HeaderFour from '../../components/Layout/Header/HeaderFour';
import SignInMain from '../../components/SignIn/SignInMain';
import Spinner from '../../components/Elements/Spinner/Spinner';
import Footer from '../../components/Layout/Footer/Footer';

const SignIn: React.FC = () => {
    return (
        <React.Fragment>
            <HeaderFour />
            {/* <Spinner/> */}
            <SignInMain />
            <Footer />
        </React.Fragment>
    );
};

export default SignIn;
