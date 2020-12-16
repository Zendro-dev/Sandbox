import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function TrialAssociationsMenuTabs(props) {
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
        <Tab id='TrialUpdatePanel-tabsA-button-contacts' 
          key='contacts' label='Contacts' value='contacts' />
        <Tab id='TrialUpdatePanel-tabsA-button-observationUnits' 
          key='observationUnits' label='ObservationUnits' value='observationUnits' />
        <Tab id='TrialUpdatePanel-tabsA-button-program' 
          key='program' label='Program' value='program' />
        <Tab id='TrialUpdatePanel-tabsA-button-studies' 
          key='studies' label='Studies' value='studies' />
      </Tabs>
    </div>
  );
}
TrialAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};