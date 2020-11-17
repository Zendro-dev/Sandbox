import React     from 'react';
import SwaggerUI from 'swagger-ui-react';
import brapiJson from './schema/brapi-phenotyping.json';
import axios from 'axios';


import { GRAPHQL_SERVER } from './config/globals';

import 'swagger-ui-react/swagger-ui.css';


export default class Swagger extends React.Component {

  requestInterceptor = async (req) => {

    const query = `{
      observations(pagination:{limit:10}){
        observationDbId
        collector
        uploadedBy
        value
      }
    }`
    // const query = `{
    //   assays(pagination: {limit: 2}) {
    //     measurement
    //     method
    //     assayResultsFilter(pagination: {limit: 30}) {
    //       value_as_num
    //       unit
    //     }
    //   }
    // }`;
    if (req.url.includes('/observations?')) {
      req.url = `${GRAPHQL_SERVER}`;
      req.method = 'POST';
      req.body = JSON.stringify({ query });
      req.headers = {
        ...req.headers,
        'Content-Type': 'application/json',
        common: {
          'Authorization': `Bearer ${this.props.token}`,
        }
      };
    }

    console.log({req});

    return req;
  }

  responseInterceptor = async (res) => {
    console.log({res});
    return res;
  }

  render () {
    return (
      <SwaggerUI
        spec={ brapiJson }
        requestInterceptor={ this.requestInterceptor }
        responseInterceptor={ this.responseInterceptor }
      />
    );
  }

}