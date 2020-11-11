import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function ContactAssociationsMenuTabs(props) {
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
        <Tab key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab key='investigations' label='Investigations' value='investigations' />
        <Tab key='ontologyAnnotations' label='OntologyAnnotations' value='ontologyAnnotations' />
        <Tab key='studies' label='Studies' value='studies' />
      </Tabs>
    </div>
  );
}
ContactAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};