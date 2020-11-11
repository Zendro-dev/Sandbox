import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function AssayAssociationsMenuTabs(props) {
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
        <Tab id='AssayUpdatePanel-tabsA-button-assayResults' 
          key='assayResults' label='AssayResults' value='assayResults' />
        <Tab id='AssayUpdatePanel-tabsA-button-factors' 
          key='factors' label='Factors' value='factors' />
        <Tab id='AssayUpdatePanel-tabsA-button-fileAttachments' 
          key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab id='AssayUpdatePanel-tabsA-button-materials' 
          key='materials' label='Materials' value='materials' />
        <Tab id='AssayUpdatePanel-tabsA-button-ontologyAnnotations' 
          key='ontologyAnnotations' label='OntologyAnnotations' value='ontologyAnnotations' />
        <Tab id='AssayUpdatePanel-tabsA-button-study' 
          key='study' label='Study' value='study' />
      </Tabs>
    </div>
  );
}
AssayAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};