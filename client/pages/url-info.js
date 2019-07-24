import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BodyWrapper from '../components/BodyWrapper';
import Footer from '../components/Footer';
import { authUser } from '../actions';

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
  font-size: 28px;
  font-weight: 300;
  text-align: center;
  margin: 24px 0;

  @media only screen and (max-width: 448px) {
    font-size: 18px;
  }
`;

const Target = styled.h3`
  font-size: 18px;
  text-align: center;

  @media only screen and (max-width: 448px) {
    font-size: 16px;
  }
`;

class UrlInfoPage extends Component {
  static getInitialProps({ query, req, reduxStore }) {
    const token = req && req.cookies && req.cookies.token;
    if (token && reduxStore) reduxStore.dispatch(authUser(token));
    return { query };
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
        <Wrapper>
          <Title>Target:</Title>
          <Target>{this.props.query}</Target>
        </Wrapper>
        <Footer />
      </BodyWrapper>
    );
  }
}

UrlInfoPage.propTypes = {
  query: PropTypes.string,
};

UrlInfoPage.defaultProps = {
  query: null,
};

export default UrlInfoPage;
