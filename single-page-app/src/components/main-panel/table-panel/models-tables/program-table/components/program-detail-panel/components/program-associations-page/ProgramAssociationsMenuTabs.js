import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function ProgramAssociationsMenuTabs(props) {
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
        <Tab id='ProgramUpdatePanel-tabsA-button-leadPerson' 
          key='leadPerson' label='LeadPerson' value='leadPerson' />
        <Tab id='ProgramUpdatePanel-tabsA-button-observationUnits' 
          key='observationUnits' label='ObservationUnits' value='observationUnits' />
        <Tab id='ProgramUpdatePanel-tabsA-button-trials' 
          key='trials' label='Trials' value='trials' />
      </Tabs>
    </div>
  );
}
ProgramAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};