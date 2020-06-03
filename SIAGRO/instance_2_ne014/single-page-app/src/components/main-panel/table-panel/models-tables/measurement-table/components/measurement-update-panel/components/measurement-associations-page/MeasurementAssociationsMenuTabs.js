import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function MeasurementAssociationsMenuTabs(props) {
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
        <Tab key='accession' label='Accession' value='accession' />
        <Tab key='individual' label='Individual' value='individual' />
      </Tabs>
    </div>
  );
}
MeasurementAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};