import React from 'react';
import axios from 'axios';
import BrAPI from './BrAPI';

import { GRAPHQL_ENDPOINT } from './config/globals';


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
        url: `${GRAPHQL_ENDPOINT}/login`,
        method: 'POST',
        data: {
          email: 'admin@zen.dro',
          password: 'admin',
        }
      });
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
