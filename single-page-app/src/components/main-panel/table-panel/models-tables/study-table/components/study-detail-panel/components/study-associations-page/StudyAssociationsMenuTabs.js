import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function StudyAssociationsMenuTabs(props) {
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
        <Tab id='StudyUpdatePanel-tabsA-button-contacts' 
          key='contacts' label='Contacts' value='contacts' />
        <Tab id='StudyUpdatePanel-tabsA-button-environmentParameters' 
          key='environmentParameters' label='EnvironmentParameters' value='environmentParameters' />
        <Tab id='StudyUpdatePanel-tabsA-button-events' 
          key='events' label='Events' value='events' />
        <Tab id='StudyUpdatePanel-tabsA-button-location' 
          key='location' label='Location' value='location' />
        <Tab id='StudyUpdatePanel-tabsA-button-observations' 
          key='observations' label='Observations' value='observations' />
        <Tab id='StudyUpdatePanel-tabsA-button-observationUnits' 
          key='observationUnits' label='ObservationUnits' value='observationUnits' />
        <Tab id='StudyUpdatePanel-tabsA-button-seasons' 
          key='seasons' label='Seasons' value='seasons' />
        <Tab id='StudyUpdatePanel-tabsA-button-trial' 
          key='trial' label='Trial' value='trial' />
      </Tabs>
    </div>
  );
}
StudyAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};