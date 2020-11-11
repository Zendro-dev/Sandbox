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
        <Tab id='StudyUpdatePanel-tabsA-button-assays' 
          key='assays' label='Assays' value='assays' />
        <Tab id='StudyUpdatePanel-tabsA-button-contacts' 
          key='contacts' label='Contacts' value='contacts' />
        <Tab id='StudyUpdatePanel-tabsA-button-factors' 
          key='factors' label='Factors' value='factors' />
        <Tab id='StudyUpdatePanel-tabsA-button-fileAttachments' 
          key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab id='StudyUpdatePanel-tabsA-button-investigation' 
          key='investigation' label='Investigation' value='investigation' />
        <Tab id='StudyUpdatePanel-tabsA-button-materials' 
          key='materials' label='Materials' value='materials' />
        <Tab id='StudyUpdatePanel-tabsA-button-ontologyAnnotations' 
          key='ontologyAnnotations' label='OntologyAnnotations' value='ontologyAnnotations' />
        <Tab id='StudyUpdatePanel-tabsA-button-protocols' 
          key='protocols' label='Protocols' value='protocols' />
      </Tabs>
    </div>
  );
}
StudyAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};