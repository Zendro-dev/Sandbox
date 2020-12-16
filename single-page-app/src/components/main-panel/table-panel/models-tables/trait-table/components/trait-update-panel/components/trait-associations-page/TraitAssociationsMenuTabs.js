import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function TraitAssociationsMenuTabs(props) {
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
        <Tab id='TraitUpdatePanel-tabsA-button-observationVariables' 
          key='observationVariables' label='ObservationVariables' value='observationVariables' />
        <Tab id='TraitUpdatePanel-tabsA-button-ontologyReference' 
          key='ontologyReference' label='OntologyReference' value='ontologyReference' />
      </Tabs>
    </div>
  );
}
TraitAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};