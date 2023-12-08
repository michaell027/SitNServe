import RegisterForm from '../components/RegisterForm';

type Props = {
    navigation: any;
};

function RegisterScreen({navigation}: Props) {
    return <RegisterForm navigation={navigation} />;
}

export default RegisterScreen;
