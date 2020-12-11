import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function EjemplarAssociationsMenuTabs(props) {
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
        <Tab key='caracteristicas_cualitativas' label='Caracteristicas_cualitativas' value='caracteristicas_cualitativas' />
        <Tab key='caracteristicas_cuantitativas' label='Caracteristicas_cuantitativas' value='caracteristicas_cuantitativas' />
        <Tab key='Taxon' label='Taxon' value='taxon' />
      </Tabs>
    </div>
  );
}
EjemplarAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};