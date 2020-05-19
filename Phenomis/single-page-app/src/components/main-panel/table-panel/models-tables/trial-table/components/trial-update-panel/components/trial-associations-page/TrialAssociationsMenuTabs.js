import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function TrialAssociationsMenuTabs(props) {
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
        <Tab key='observationUnits' label='ObservationUnits' value='observationUnits' />
        <Tab key='program' label='Program' value='program' />
        <Tab key='studies' label='Studies' value='studies' />
        <Tab key='trialToContacts' label='TrialToContacts' value='trialToContacts' />
      </Tabs>
    </div>
  );
}
TrialAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};