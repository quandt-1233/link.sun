import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import BodyWrapper from '../components/BodyWrapper';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Footer from '../components/Footer';

const Wrapper = styled.div`
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  align-items: cetner;
  img {
    width: 80%;
    display: block;
    margin: 0 auto;
  }
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 300;
  text-align: center;

  @media only screen and (max-width: 448px) {
    font-size: 18px;
  }
`;

const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
`;

const Error = styled.p`
  position: absolute;
  left: 0;
  bottom: -48px;
  font-size: 14px;
  color: red;

  @media only screen and (max-width: 448px) {
    bottom: -40px;
    font-size: 12px;
  }
`;

class UrlPasswordPage extends Component {
  static getInitialProps({ query }) {
    return { query };
  }

  constructor() {
    super();
    this.state = {
      error: '',
      loading: false,
      password: '',
    };
    this.updatePassword = this.updatePassword.bind(this);
    this.requestUrl = this.requestUrl.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  updatePassword(e) {
    this.setState({
      password: e.currentTarget.value,
    });
  }

  requestUrl(e) {
    e.preventDefault();
    const { password } = this.state;
    if (!password) {
      return this.setState({
        error: 'Password must not be empty',
      });
    }
    this.setState({ error: '' });
    this.setState({ loading: true });
    return axios
      .post('/api/url/requesturl', { id: this.props.query, password })
      .then(({ data }) => window.location.replace(data.target))
      .catch(({ response }) =>
        this.setState({
          loading: false,
          error: response.data.error,
        })
      );
  }

  render() {
    if (!this.props.query) {
      return (
        <BodyWrapper>
          <Wrapper>
            <Title>Whoops, We can&#8217;t seem to find the page you&#8217;re looking for. </Title>
            <img src="/images/cat-404-not-found.gif" alt="" />
          </Wrapper>
          <Footer />
        </BodyWrapper>
      );
    }
    return (
      <BodyWrapper>
        <Title>Enter the password to access the URL.</Title>
        <Form onSubmit={this.requestUrl}>
          <TextInput type="password" placeholder="Password" onChange={this.updatePassword} small />
          <Button type="submit" icon={this.state.loading ? 'loader' : ''}>
            Go
          </Button>
          <Error>{this.state.error}</Error>
        </Form>
      </BodyWrapper>
    );
  }
}

UrlPasswordPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string,
  }),
};

UrlPasswordPage.defaultProps = {
  query: null,
};

export default UrlPasswordPage;
