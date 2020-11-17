import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Key from '@material-ui/icons/VpnKey';

export default function EventEnhancedTableHead(props) {
  const { t } = useTranslation();
  const {
    permissions,
    order,
    orderBy,
    onRequestSort
  } = props;

  return (
    <TableHead>
      <TableRow>

        {/* See-info icon */}
        <TableCell padding="checkbox" />

        {/* Actions */}
        {
          /* acl check */
          (permissions&&permissions.event&&Array.isArray(permissions.event)
          &&(permissions.event.includes('update') || permissions.event.includes('delete') || permissions.event.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.event.includes('update') || permissions.event.includes('*')) ? 1 : 0) 
                +
                ((permissions.event.includes('delete') || permissions.event.includes('*')) ? 1 : 0)
              }
            >
              <Typography color="inherit" variant="caption">
                { t('modelPanels.actions') }
              </Typography>
            </TableCell>
          )
        }

        {/* 
          Headers 
        */}

        {/* eventType*/}
        <TableCell
          key='eventType'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'eventType' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'eventType'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'eventType') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                eventType              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='eventDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'eventDbId' ? order : false}
        >
          {/* eventDbId */}
          <TableSortLabel
              active={orderBy === 'eventDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'eventDbId')}}
          >
            <Typography color="inherit" variant="caption">
              eventDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='eventDescription'
          align='left'
          padding="default"
          sortDirection={orderBy === 'eventDescription' ? order : false}
        >
          {/* eventDescription */}
          <TableSortLabel
              active={orderBy === 'eventDescription'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'eventDescription')}}
          >
            <Typography color="inherit" variant="caption">
              eventDescription
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='date'
          align='left'
          padding="default"
          sortDirection={orderBy === 'date' ? order : false}
        >
          {/* date */}
          <TableSortLabel
              active={orderBy === 'date'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'date')}}
          >
            <Typography color="inherit" variant="caption">
              date
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationUnitDbIds'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationUnitDbIds' ? order : false}
        >
          {/* observationUnitDbIds */}
          <TableSortLabel
              active={orderBy === 'observationUnitDbIds'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationUnitDbIds')}}
          >
            <Typography color="inherit" variant="caption">
              observationUnitDbIds
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='studyDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'studyDbId' ? order : false}
        >
          {/* studyDbId */}
          <TableSortLabel
              active={orderBy === 'studyDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'studyDbId')}}
          >
            <Typography color="inherit" variant="caption">
              studyDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
EventEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};