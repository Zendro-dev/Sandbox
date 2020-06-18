import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function SampleAssociationsMenuTabs(props) {
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
        <Tab key='individual' label='Individual' value='individual' />
        <Tab key='library_data' label='Library_data' value='library_data' />
        <Tab key='sequencing_experiment' label='Sequencing_experiment' value='sequencing_experiment' />
        <Tab key='transcript_counts' label='Transcript_counts' value='transcript_counts' />
      </Tabs>
    </div>
  );
}
SampleAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};