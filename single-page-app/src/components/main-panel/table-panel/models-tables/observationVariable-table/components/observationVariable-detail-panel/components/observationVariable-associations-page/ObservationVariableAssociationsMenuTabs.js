import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function ObservationVariableAssociationsMenuTabs(props) {
  const {
    associationSelected,
    handleClick,
  } = props;

  return (
    <div>
      <Tabs
        value={associationSelected}
        onChange={handleClick}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab id='ObservationVariableUpdatePanel-tabsA-button-method' 
          key='method' label='Method' value='method' />
        <Tab id='ObservationVariableUpdatePanel-tabsA-button-observations' 
          key='observations' label='Observations' value='observations' />
        <Tab id='ObservationVariableUpdatePanel-tabsA-button-ontologyReference' 
          key='ontologyReference' label='OntologyReference' value='ontologyReference' />
        <Tab id='ObservationVariableUpdatePanel-tabsA-button-scale' 
          key='scale' label='Scale' value='scale' />
        <Tab id='ObservationVariableUpdatePanel-tabsA-button-trait' 
          key='trait' label='Trait' value='trait' />
      </Tabs>
    </div>
  );
}
ObservationVariableAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};