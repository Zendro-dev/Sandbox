import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function ProtocolAssociationsMenuTabs(props) {
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
        <Tab id='ProtocolUpdatePanel-tabsA-button-assays' 
          key='assays' label='Assays' value='assays' />
        <Tab id='ProtocolUpdatePanel-tabsA-button-fileAttachments' 
          key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab id='ProtocolUpdatePanel-tabsA-button-ontologyAnnotation' 
          key='ontologyAnnotation' label='OntologyAnnotation' value='ontologyAnnotation' />
        <Tab id='ProtocolUpdatePanel-tabsA-button-studies' 
          key='studies' label='Studies' value='studies' />
      </Tabs>
    </div>
  );
}
ProtocolAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};