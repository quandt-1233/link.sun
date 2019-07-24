import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ReCaptcha from './ReCaptcha';
import showRecaptcha from '../../helpers/recaptcha';
// import config from '../../config';

const Wrapper = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 0 ${({ isAuthenticated }) => (isAuthenticated ? '8px' : '24px')};
  background-color: white;

  a {
    text-decoration: none;
    color: #2d3436;
  }
`;

const Text = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: black;

  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }

  span {
    color: #ff3f34;
  }
`;

class Footer extends Component {
  componentDidMount() {
    showRecaptcha();
  }

  render() {
    return (
      <Wrapper isAuthenticated={this.props.isAuthenticated}>
        {!this.props.isAuthenticated && <ReCaptcha />}
        <Text>
          ___Made with{' '}
          <span role="img" aria-label="heart">
            ❤️
          </span>{' '}
          by Avengers Group
          {/* {' '}
          <a href="//thedevs.network/" title="The Devs">
            The Devs
          </a>
          .{' | '}
          <a
            href="https://github.com/thedevs-network/kutt"
            title="GitHub"
            target="_blank" // eslint-disable-line react/jsx-no-target-blank
          >
            GitHub
          </a>
          {' | '}
          <a href="/terms" title="Terms of Service">
            Terms of Service
          </a>
          {' | '}
          <a href="/report" title="Report abuse">
            Report Abuse
          </a>
          {config.CONTACT_EMAIL && (
            <Fragment>
              {' | '}
              <a href={`mailto:${config.CONTACT_EMAIL}`} title="Contact us">
                Contact us
              </a>
            </Fragment>
          )} */}
          ___
        </Text>
      </Wrapper>
    );
  }
}

Footer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({ isAuthenticated });

export default connect(mapStateToProps)(Footer);
