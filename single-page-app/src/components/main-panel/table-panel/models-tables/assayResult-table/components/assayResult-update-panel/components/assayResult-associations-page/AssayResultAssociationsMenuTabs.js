import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function AssayResultAssociationsMenuTabs(props) {
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
        <Tab id='AssayResultUpdatePanel-tabsA-button-assay' 
          key='assay' label='Assay' value='assay' />
        <Tab id='AssayResultUpdatePanel-tabsA-button-fileAttachments' 
          key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab id='AssayResultUpdatePanel-tabsA-button-observedMaterial' 
          key='observedMaterial' label='ObservedMaterial' value='observedMaterial' />
        <Tab id='AssayResultUpdatePanel-tabsA-button-ontologyAnnotations' 
          key='ontologyAnnotations' label='OntologyAnnotations' value='ontologyAnnotations' />
      </Tabs>
    </div>
  );
}
AssayResultAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};