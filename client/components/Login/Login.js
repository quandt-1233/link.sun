import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import emailValidator from 'email-validator';
import LoginBox from './LoginBox';
// import LoginInputLabel from './LoginInputLabel';
// import TextInput from '../TextInput';
import Button from '../Button';
import Error from '../Error';
import {
  loginUser,
  showAuthError,
  signupUser,
  showPageLoading,
  loginUserWithGoogle,
} from '../../actions';
// eslint-disable-next-line import/first
import { GoogleLogin } from 'react-google-login';
import config from '../../config';

const Wrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  margin: 24px 0 64px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  & > * {
    flex: 1 1 0;
  }
  & > *:last-child {
    margin-left: 32px;
  }
  @media only screen and (max-width: 768px) {
    & > *:last-child {
      margin-left: 16px;
    }
  }
  button {
    height: 3.5em;
    padding: 0px 1.9em;
    margin: 3em 0em 0em 0em;
  }
`;

const VerificationMsg = styled.p`
  font-size: 24px;
  font-weight: 300;
`;

const User = styled.span`
  font-weight: normal;
  color: #512da8;
  border-bottom: 1px dotted #999;
`;

// const ForgetPassLink = styled.a`
//   align-self: flex-start;
//   margin: -24px 0 32px;
//   font-size: 14px;
//   text-decoration: none;
//   color: #2196f3;
//   border-bottom: 1px dotted transparent;

//   :hover {
//     border-bottom-color: #2196f3;
//   }
// `;

class Login extends Component {
  constructor() {
    super();
    this.authHandler = this.authHandler.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.signupHandler = this.signupHandler.bind(this);
    this.goTo = this.goTo.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
  }

  goTo(e) {
    e.preventDefault();
    const path = e.currentTarget.getAttribute('href');
    this.props.showPageLoading();
    Router.push(path);
  }

  authHandler(type) {
    const { loading, showError } = this.props;
    if (loading.login || loading.signup) return null;
    const form = document.getElementById('login-form');
    const { value: email } = form.elements.email;
    const { value: password } = form.elements.password;
    if (!email) return showError('Email address must not be empty.');
    if (!emailValidator.validate(email)) return showError('Email address is not valid.');
    if (password.trim().length < 8) {
      return showError('Password must be at least 8 chars long.');
    }
    return type === 'login'
      ? this.props.login({ email, password })
      : this.props.signup({ email, password });
  }

  loginHandler(e) {
    e.preventDefault();
    this.authHandler('login');
  }

  signupHandler(e) {
    e.preventDefault();
    this.authHandler('signup');
  }

  // eslint-disable-next-line class-methods-use-this
  responseGoogle(response) {
    if (response.error) {
      // eslint-disable-next-line no-console
      console.log(response.error);
    } else {
      this.props.googleLogin({
        accessToken: response.accessToken,
        tokenId: response.tokenId,
      });
    }
  }

  render() {
    return (
      <Wrapper>
        {this.props.auth.sentVerification ? (
          <VerificationMsg>
            A verification email has been sent to <User>{this.props.auth.user}</User>.
          </VerificationMsg>
        ) : (
          <LoginBox id="login-form" onSubmit={this.loginHandler}>
            {/* <LoginInputLabel htmlFor="email" test="test">
              Email address
            </LoginInputLabel>
            <TextInput type="email" name="email" id="email" autoFocus />
            <LoginInputLabel htmlFor="password">Password (min chars: 8)</LoginInputLabel>
            <TextInput type="password" name="password" id="password" />
            <ForgetPassLink href="/reset-password" title="Forget password" onClick={this.goTo}>
              Forgot your password?
            </ForgetPassLink> */}
            <ButtonWrapper>
              {/* <Button
                icon={this.props.loading.login ? 'loader' : 'login'}
                onClick={this.loginHandler}
                big
              >
                Log in
              </Button>
              <Button
                icon={this.props.loading.signup ? 'loader' : 'signup'}
                color="purple"
                onClick={this.signupHandler}
                big
              >
                Sign up
              </Button> */}

              <GoogleLogin
                clientId={config.GOOGLE_CLIENT_ID}
                buttonText="Signing in with Google"
                render={renderProps => (
                  <Button
                    icon={this.props.loading.login ? 'loader' : 'google'}
                    onClick={renderProps.onClick}
                    big
                    disabled={renderProps.disabled}
                  >
                    Signing in with Google
                  </Button>
                )}
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy="single_host_origin"
              />
            </ButtonWrapper>
            <Error type="auth" left={0} />
          </LoginBox>
        )}
      </Wrapper>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.shape({
    sentVerification: PropTypes.bool.isRequired,
    user: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.shape({
    login: PropTypes.bool.isRequired,
    signup: PropTypes.bool.isRequired,
  }).isRequired,
  login: PropTypes.func.isRequired,
  googleLogin: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  showPageLoading: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth, loading }) => ({ auth, loading });

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(loginUser, dispatch),
  signup: bindActionCreators(signupUser, dispatch),
  googleLogin: bindActionCreators(loginUserWithGoogle, dispatch),
  showError: bindActionCreators(showAuthError, dispatch),
  showPageLoading: bindActionCreators(showPageLoading, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
