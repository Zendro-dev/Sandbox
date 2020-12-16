import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function EventAssociationsMenuTabs(props) {
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
        <Tab id='EventUpdatePanel-tabsA-button-eventParameters' 
          key='eventParameters' label='EventParameters' value='eventParameters' />
        <Tab id='EventUpdatePanel-tabsA-button-observationUnits' 
          key='observationUnits' label='ObservationUnits' value='observationUnits' />
        <Tab id='EventUpdatePanel-tabsA-button-study' 
          key='study' label='Study' value='study' />
      </Tabs>
    </div>
  );
}
EventAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};