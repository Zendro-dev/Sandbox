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
        <Tab key='germplasm' label='Germplasm' value='germplasm' />
        <Tab key='images' label='Images' value='images' />
        <Tab key='location' label='Location' value='location' />
        <Tab key='observations' label='Observations' value='observations' />
        <Tab key='observationTreatments' label='ObservationTreatments' value='observationTreatments' />
        <Tab key='observationUnitPosition' label='ObservationUnitPosition' value='observationUnitPosition' />
        <Tab key='observationUnitToEvents' label='ObservationUnitToEvents' value='observationUnitToEvents' />
        <Tab key='program' label='Program' value='program' />
        <Tab key='study' label='Study' value='study' />
        <Tab key='trial' label='Trial' value='trial' />
      </Tabs>
    </div>
  );
}
ObservationUnitAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};