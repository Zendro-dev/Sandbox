import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function SeasonAssociationsMenuTabs(props) {
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
        <Tab id='SeasonUpdatePanel-tabsA-button-observations' 
          key='observations' label='Observations' value='observations' />
        <Tab id='SeasonUpdatePanel-tabsA-button-studies' 
          key='studies' label='Studies' value='studies' />
      </Tabs>
    </div>
  );
}
SeasonAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};