import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function StudyAssociationsMenuTabs(props) {
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
        <Tab key='environmentParameters' label='EnvironmentParameters' value='environmentParameters' />
        <Tab key='events' label='Events' value='events' />
        <Tab key='location' label='Location' value='location' />
        <Tab key='observations' label='Observations' value='observations' />
        <Tab key='observationUnits' label='ObservationUnits' value='observationUnits' />
        <Tab key='studyToContacts' label='StudyToContacts' value='studyToContacts' />
        <Tab key='studyToSeasons' label='StudyToSeasons' value='studyToSeasons' />
        <Tab key='trial' label='Trial' value='trial' />
      </Tabs>
    </div>
  );
}
StudyAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};