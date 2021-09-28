import * as React from 'react';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Dictionary from './dictionary';
import Introduction from './introduction';
import LinkConabio from './vinculacion';
import Guia from './guia';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Introducción" value="1" />
            <Tab label="Vinculación" value="2" />
            <Tab label="Guía" value="3" />
            <Tab label="Diccionario" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Introduction />
        </TabPanel>
        <TabPanel value="2">
          <LinkConabio />
        </TabPanel>
        <TabPanel value="3">
          <Guia />
        </TabPanel>
        <TabPanel value="4">
          <Dictionary />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

