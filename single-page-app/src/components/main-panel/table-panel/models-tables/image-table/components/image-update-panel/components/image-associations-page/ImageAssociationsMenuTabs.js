import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function ImageAssociationsMenuTabs(props) {
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
        <Tab id='ImageUpdatePanel-tabsA-button-observations' 
          key='observations' label='Observations' value='observations' />
        <Tab id='ImageUpdatePanel-tabsA-button-observationUnit' 
          key='observationUnit' label='ObservationUnit' value='observationUnit' />
      </Tabs>
    </div>
  );
}
ImageAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};