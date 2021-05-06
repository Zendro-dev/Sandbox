import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function TipoPlantaAssociationsMenuTabs(props) {
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
        <Tab id='TipoPlantaUpdatePanel-tabsA-button-cuadrantes' 
          key='cuadrantes' label='Cuadrantes' value='cuadrantes' />
      </Tabs>
    </div>
  );
}
TipoPlantaAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};