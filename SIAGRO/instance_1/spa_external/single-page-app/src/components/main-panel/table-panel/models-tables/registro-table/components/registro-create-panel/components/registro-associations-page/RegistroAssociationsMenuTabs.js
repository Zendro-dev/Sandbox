import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function RegistroAssociationsMenuTabs(props) {
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
        <Tab key='caracteristicas_cuantitativas' label='Caracteristicas_cuantitativas' value='caracteristicas_cuantitativas' />
        <Tab key='referencias' label='Referencias' value='referencias' />
        <Tab key='informacion_taxonomica' label='Informacion_taxonomica' value='informacion_taxonomica' />
      </Tabs>
    </div>
  );
}
RegistroAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};