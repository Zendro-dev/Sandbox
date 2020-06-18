import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function IndividualAssociationsMenuTabs(props) {
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
        <Tab key='genotype' label='Genotype' value='genotype' />
        <Tab key='mother_to' label='Mother_to' value='mother_to' />
        <Tab key='father_to' label='Father_to' value='father_to' />
        <Tab key='marker_data_snps' label='Marker_data_snps' value='marker_data_snps' />
        <Tab key='samples' label='Samples' value='samples' />
      </Tabs>
    </div>
  );
}
IndividualAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};