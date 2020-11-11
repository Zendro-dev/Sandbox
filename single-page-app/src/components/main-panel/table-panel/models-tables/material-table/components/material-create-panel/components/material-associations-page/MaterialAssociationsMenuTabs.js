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
        <Tab key='assays' label='Assays' value='assays' />
        <Tab key='assayResults' label='AssayResults' value='assayResults' />
        <Tab key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab key='sourceSets' label='SourceSets' value='sourceSets' />
        <Tab key='elements' label='Elements' value='elements' />
        <Tab key='ontologyAnnotation' label='OntologyAnnotation' value='ontologyAnnotation' />
        <Tab key='studies' label='Studies' value='studies' />
      </Tabs>
    </div>
  );
}
MaterialAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};