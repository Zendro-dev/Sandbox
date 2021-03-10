import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function CountryAssociationsMenuTabs(props) {
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
        <Tab id='CountryUpdatePanel-tabsA-button-unique_capital' 
          key='unique_capital' label='Unique_capital' value='unique_capital' />
        <Tab id='CountryUpdatePanel-tabsA-button-continent' 
          key='continent' label='Continent' value='continent' />
        <Tab id='CountryUpdatePanel-tabsA-button-rivers' 
          key='rivers' label='Rivers' value='rivers' />
      </Tabs>
    </div>
  );
}
CountryAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};