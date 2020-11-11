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
        <Tab key='assays' label='Assays' value='assays' />
        <Tab key='assayResults' label='AssayResults' value='assayResults' />
        <Tab key='factors' label='Factors' value='factors' />
        <Tab key='investigations' label='Investigations' value='investigations' />
        <Tab key='materials' label='Materials' value='materials' />
        <Tab key='protocols' label='Protocols' value='protocols' />
        <Tab key='studies' label='Studies' value='studies' />
      </Tabs>
    </div>
  );
}
FileAttachmentAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};