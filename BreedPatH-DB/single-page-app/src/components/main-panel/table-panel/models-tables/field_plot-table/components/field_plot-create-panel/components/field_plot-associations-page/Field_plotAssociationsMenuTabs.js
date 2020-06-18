import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function FieldPlotAssociationsMenuTabs(props) {
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
        <Tab key='field_plot_treatment' label='Field_plot_treatment' value='field_plot_treatment' />
        <Tab key='genotype' label='Genotype' value='genotype' />
        <Tab key='measurements' label='Measurements' value='measurements' />
      </Tabs>
    </div>
  );
}
FieldPlotAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};