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
        <Tab key='assays' label='Assays' value='assays' />
        <Tab key='contacts' label='Contacts' value='contacts' />
        <Tab key='factors' label='Factors' value='factors' />
        <Tab key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab key='investigation' label='Investigation' value='investigation' />
        <Tab key='materials' label='Materials' value='materials' />
        <Tab key='ontologyAnnotations' label='OntologyAnnotations' value='ontologyAnnotations' />
        <Tab key='protocols' label='Protocols' value='protocols' />
      </Tabs>
    </div>
  );
}
StudyAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};