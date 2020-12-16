import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function ObservationAssociationsMenuTabs(props) {
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
        <Tab id='ObservationUpdatePanel-tabsA-button-germplasm' 
          key='germplasm' label='Germplasm' value='germplasm' />
        <Tab id='ObservationUpdatePanel-tabsA-button-image' 
          key='image' label='Image' value='image' />
        <Tab id='ObservationUpdatePanel-tabsA-button-observationUnit' 
          key='observationUnit' label='ObservationUnit' value='observationUnit' />
        <Tab id='ObservationUpdatePanel-tabsA-button-observationVariable' 
          key='observationVariable' label='ObservationVariable' value='observationVariable' />
        <Tab id='ObservationUpdatePanel-tabsA-button-season' 
          key='season' label='Season' value='season' />
        <Tab id='ObservationUpdatePanel-tabsA-button-study' 
          key='study' label='Study' value='study' />
      </Tabs>
    </div>
  );
}
ObservationAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};