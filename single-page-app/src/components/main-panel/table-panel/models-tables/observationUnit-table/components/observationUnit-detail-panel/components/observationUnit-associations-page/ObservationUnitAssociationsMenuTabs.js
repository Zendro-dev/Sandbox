import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function ObservationUnitAssociationsMenuTabs(props) {
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
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-events' 
          key='events' label='Events' value='events' />
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-germplasm' 
          key='germplasm' label='Germplasm' value='germplasm' />
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-images' 
          key='images' label='Images' value='images' />
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-location' 
          key='location' label='Location' value='location' />
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-observations' 
          key='observations' label='Observations' value='observations' />
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-observationTreatments' 
          key='observationTreatments' label='ObservationTreatments' value='observationTreatments' />
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-observationUnitPosition' 
          key='observationUnitPosition' label='ObservationUnitPosition' value='observationUnitPosition' />
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-program' 
          key='program' label='Program' value='program' />
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-study' 
          key='study' label='Study' value='study' />
        <Tab id='ObservationUnitUpdatePanel-tabsA-button-trial' 
          key='trial' label='Trial' value='trial' />
      </Tabs>
    </div>
  );
}
ObservationUnitAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};