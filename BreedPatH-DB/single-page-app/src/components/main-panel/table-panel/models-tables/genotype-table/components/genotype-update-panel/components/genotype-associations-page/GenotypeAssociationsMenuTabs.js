import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function GenotypeAssociationsMenuTabs(props) {
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
        <Tab key='breeding_pool' label='Breeding_pool' value='breeding_pool' />
        <Tab key='field_plot' label='Field_plot' value='field_plot' />
        <Tab key='mother' label='Mother' value='mother' />
        <Tab key='father' label='Father' value='father' />
        <Tab key='individual' label='Individual' value='individual' />
      </Tabs>
    </div>
  );
}
GenotypeAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};