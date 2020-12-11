import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function MetodoAssociationsMenuTabs(props) {
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
        <Tab id='MetodoUpdatePanel-tabsA-button-caracteristicas_cualitativas' 
          key='caracteristicas_cualitativas' label='Caracteristicas_cualitativas' value='caracteristicas_cualitativas' />
        <Tab id='MetodoUpdatePanel-tabsA-button-caracteristicas_cuantitativas' 
          key='caracteristicas_cuantitativas' label='Caracteristicas_cuantitativas' value='caracteristicas_cuantitativas' />
      </Tabs>
    </div>
  );
}
MetodoAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};