import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function CaracteristicaCuantitativaAssociationsMenuTabs(props) {
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
        <Tab id='CaracteristicaCuantitativaUpdatePanel-tabsA-button-metodo' 
          key='metodo' label='Metodo' value='metodo' />
        <Tab id='CaracteristicaCuantitativaUpdatePanel-tabsA-button-registro' 
          key='registro' label='Registro' value='registro' />
      </Tabs>
    </div>
  );
}
CaracteristicaCuantitativaAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};