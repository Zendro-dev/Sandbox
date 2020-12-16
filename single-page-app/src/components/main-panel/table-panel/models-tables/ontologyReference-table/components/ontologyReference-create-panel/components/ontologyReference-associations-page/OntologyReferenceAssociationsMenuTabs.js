import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function OntologyReferenceAssociationsMenuTabs(props) {
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
        <Tab key='methods' label='Methods' value='methods' />
        <Tab key='observationVariables' label='ObservationVariables' value='observationVariables' />
        <Tab key='scales' label='Scales' value='scales' />
        <Tab key='traits' label='Traits' value='traits' />
      </Tabs>
    </div>
  );
}
OntologyReferenceAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};