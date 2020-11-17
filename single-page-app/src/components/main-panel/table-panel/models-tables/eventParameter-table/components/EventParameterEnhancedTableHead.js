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

export default function EventParameterEnhancedTableHead(props) {
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
          (permissions&&permissions.eventParameter&&Array.isArray(permissions.eventParameter)
          &&(permissions.eventParameter.includes('update') || permissions.eventParameter.includes('delete') || permissions.eventParameter.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.eventParameter.includes('update') || permissions.eventParameter.includes('*')) ? 1 : 0) 
                +
                ((permissions.eventParameter.includes('delete') || permissions.eventParameter.includes('*')) ? 1 : 0)
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

        {/* eventParameterDbId*/}
        <TableCell
          key='eventParameterDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'eventParameterDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'eventParameterDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'eventParameterDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                eventParameterDbId              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='key'
          align='left'
          padding="default"
          sortDirection={orderBy === 'key' ? order : false}
        >
          {/* key */}
          <TableSortLabel
              active={orderBy === 'key'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'key')}}
          >
            <Typography color="inherit" variant="caption">
              key
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='rdfValue'
          align='left'
          padding="default"
          sortDirection={orderBy === 'rdfValue' ? order : false}
        >
          {/* rdfValue */}
          <TableSortLabel
              active={orderBy === 'rdfValue'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'rdfValue')}}
          >
            <Typography color="inherit" variant="caption">
              rdfValue
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='value'
          align='left'
          padding="default"
          sortDirection={orderBy === 'value' ? order : false}
        >
          {/* value */}
          <TableSortLabel
              active={orderBy === 'value'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'value')}}
          >
            <Typography color="inherit" variant="caption">
              value
            </Typography>
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

      </TableRow>
    </TableHead>
  );
}
EventParameterEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};