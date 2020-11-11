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
        <Tab key='assayResults' label='AssayResults' value='assayResults' />
        <Tab key='factors' label='Factors' value='factors' />
        <Tab key='fileAttachments' label='FileAttachments' value='fileAttachments' />
        <Tab key='materials' label='Materials' value='materials' />
        <Tab key='ontologyAnnotations' label='OntologyAnnotations' value='ontologyAnnotations' />
        <Tab key='study' label='Study' value='study' />
      </Tabs>
    </div>
  );
}
AssayAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};