import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function FileAttachmentAssociationsMenuTabs(props) {
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
        <Tab id='FileAttachmentUpdatePanel-tabsA-button-assays' 
          key='assays' label='Assays' value='assays' />
        <Tab id='FileAttachmentUpdatePanel-tabsA-button-assayResults' 
          key='assayResults' label='AssayResults' value='assayResults' />
        <Tab id='FileAttachmentUpdatePanel-tabsA-button-factors' 
          key='factors' label='Factors' value='factors' />
        <Tab id='FileAttachmentUpdatePanel-tabsA-button-investigations' 
          key='investigations' label='Investigations' value='investigations' />
        <Tab id='FileAttachmentUpdatePanel-tabsA-button-materials' 
          key='materials' label='Materials' value='materials' />
        <Tab id='FileAttachmentUpdatePanel-tabsA-button-protocols' 
          key='protocols' label='Protocols' value='protocols' />
        <Tab id='FileAttachmentUpdatePanel-tabsA-button-studies' 
          key='studies' label='Studies' value='studies' />
      </Tabs>
    </div>
  );
}
FileAttachmentAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};