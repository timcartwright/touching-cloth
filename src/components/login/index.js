import React, {Component} from 'react';
import Section from '../presentation/Section';
import Button from '../presentation/Button';
import Auth from '../../auth';

const auth = new Auth();

class Login extends Component {

    login() {
        auth.login();
    }
    
    logout() {
        this.props.auth.logout();
    }

    render() {
        return (
            <Section>
                <Button onClick={this.login.bind(this)}>
                    Login
                </Button>
            </Section>
        );
    }
}

export default Login;
