import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function InvestigationAssociationsMenuTabs(props) {
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
        <Tab id='InvestigationUpdatePanel-tabsA-button-contacts' 
          key='contacts' label='Contacts' value='contacts' />
        <Tab id='InvestigationUpdatePanel-tabsA-button-fileAttachments' 
          key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab id='InvestigationUpdatePanel-tabsA-button-ontologyAnnotations' 
          key='ontologyAnnotations' label='OntologyAnnotations' value='ontologyAnnotations' />
        <Tab id='InvestigationUpdatePanel-tabsA-button-studies' 
          key='studies' label='Studies' value='studies' />
      </Tabs>
    </div>
  );
}
InvestigationAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};