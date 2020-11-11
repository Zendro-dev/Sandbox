import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function MaterialAssociationsMenuTabs(props) {
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
        <Tab id='MaterialUpdatePanel-tabsA-button-assays' 
          key='assays' label='Assays' value='assays' />
        <Tab id='MaterialUpdatePanel-tabsA-button-assayResults' 
          key='assayResults' label='AssayResults' value='assayResults' />
        <Tab id='MaterialUpdatePanel-tabsA-button-fileAttachments' 
          key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab id='MaterialUpdatePanel-tabsA-button-sourceSets' 
          key='sourceSets' label='SourceSets' value='sourceSets' />
        <Tab id='MaterialUpdatePanel-tabsA-button-elements' 
          key='elements' label='Elements' value='elements' />
        <Tab id='MaterialUpdatePanel-tabsA-button-ontologyAnnotation' 
          key='ontologyAnnotation' label='OntologyAnnotation' value='ontologyAnnotation' />
        <Tab id='MaterialUpdatePanel-tabsA-button-studies' 
          key='studies' label='Studies' value='studies' />
      </Tabs>
    </div>
  );
}
MaterialAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};