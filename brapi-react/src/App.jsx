import React from 'react';
import axios from 'axios';
import BrAPI from './BrAPI';

import { LOGIN_URL } from './config/globals';


export default class App extends React.Component {

  constructor () {
    super();
    this.state = {
      token: null,
    };
  }

  async componentDidMount () {

    let res;
    try {
      res = await axios({
        url: `${LOGIN_URL}`,
        method: 'POST',
        data: {
          email: 'coeit@emphasis-layer.com',
          password: 'admin',
        }
      });

      console.log({ 'login-response': res });
    }
    catch (error) {
      console.log(error);
    }

    if (res) this.setState({ token: res.data.token });
  }

  render () {
    return (
      <BrAPI
        token={ this.state.token }
      />
    );
  }
}
