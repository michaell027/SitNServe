import React from 'react';
import LoginForm from '../components/LoginForm';

interface Props {
    navigation: any;
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
    return <LoginForm navigation={navigation} />;
};

export default LoginScreen;
