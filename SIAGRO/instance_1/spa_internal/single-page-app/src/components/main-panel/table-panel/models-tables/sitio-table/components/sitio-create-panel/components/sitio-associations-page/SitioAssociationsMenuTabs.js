import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function SitioAssociationsMenuTabs(props) {
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
        <Tab key='grupo_enfoque' label='Grupo_enfoque' value='grupo_enfoque' />
      </Tabs>
    </div>
  );
}
SitioAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};