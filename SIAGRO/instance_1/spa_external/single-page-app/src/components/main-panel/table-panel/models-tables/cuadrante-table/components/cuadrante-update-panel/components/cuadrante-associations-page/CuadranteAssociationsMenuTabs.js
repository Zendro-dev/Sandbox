import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function CuadranteAssociationsMenuTabs(props) {
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
        <Tab id='CuadranteUpdatePanel-tabsA-button-grupo_enfoque' 
          key='grupo_enfoque' label='Grupo_enfoque' value='grupo_enfoque' />
        <Tab id='CuadranteUpdatePanel-tabsA-button-informacion_taxonomica' 
          key='informacion_taxonomica' label='Informacion_taxonomica' value='informacion_taxonomica' />
        <Tab id='CuadranteUpdatePanel-tabsA-button-tipo_planta' 
          key='tipo_planta' label='Tipo_planta' value='tipo_planta' />
      </Tabs>
    </div>
  );
}
CuadranteAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};