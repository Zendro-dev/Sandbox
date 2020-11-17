import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function OntologyReferenceAssociationsMenuTabs(props) {
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
        <Tab id='OntologyReferenceUpdatePanel-tabsA-button-methods' 
          key='methods' label='Methods' value='methods' />
        <Tab id='OntologyReferenceUpdatePanel-tabsA-button-observationVariables' 
          key='observationVariables' label='ObservationVariables' value='observationVariables' />
        <Tab id='OntologyReferenceUpdatePanel-tabsA-button-scales' 
          key='scales' label='Scales' value='scales' />
        <Tab id='OntologyReferenceUpdatePanel-tabsA-button-traits' 
          key='traits' label='Traits' value='traits' />
      </Tabs>
    </div>
  );
}
OntologyReferenceAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};