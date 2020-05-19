import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function GermplasmAssociationsMenuTabs(props) {
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
        <Tab key='breedingMethod' label='BreedingMethod' value='breedingMethod' />
        <Tab key='observations' label='Observations' value='observations' />
        <Tab key='observationUnits' label='ObservationUnits' value='observationUnits' />
      </Tabs>
    </div>
  );
}
GermplasmAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};