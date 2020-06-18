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

export default function MeasurementEnhancedTableHead(props) {
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
          (permissions&&permissions.measurement&&Array.isArray(permissions.measurement)
          &&(permissions.measurement.includes('update') || permissions.measurement.includes('delete') || permissions.measurement.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.measurement.includes('update') || permissions.measurement.includes('*')) ? 1 : 0) 
                +
                ((permissions.measurement.includes('delete') || permissions.measurement.includes('*')) ? 1 : 0)
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

        {/* id*/}
        <TableCell
          key='id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='method'
          align='left'
          padding="default"
          sortDirection={orderBy === 'method' ? order : false}
        >
          {/* method */}
          <TableSortLabel
              active={orderBy === 'method'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'method')}}
          >
            <Typography color="inherit" variant="caption">
              method
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='reference'
          align='left'
          padding="default"
          sortDirection={orderBy === 'reference' ? order : false}
        >
          {/* reference */}
          <TableSortLabel
              active={orderBy === 'reference'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'reference')}}
          >
            <Typography color="inherit" variant="caption">
              reference
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='float_value'
          align='right'
          padding="default"
          sortDirection={orderBy === 'float_value' ? order : false}
        >
          {/* float_value */}
          <TableSortLabel
              active={orderBy === 'float_value'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'float_value')}}
          >
            <Typography color="inherit" variant="caption">
              float_value
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='int_value'
          align='right'
          padding="default"
          sortDirection={orderBy === 'int_value' ? order : false}
        >
          {/* int_value */}
          <TableSortLabel
              active={orderBy === 'int_value'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'int_value')}}
          >
            <Typography color="inherit" variant="caption">
              int_value
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='text_value'
          align='left'
          padding="default"
          sortDirection={orderBy === 'text_value' ? order : false}
        >
          {/* text_value */}
          <TableSortLabel
              active={orderBy === 'text_value'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'text_value')}}
          >
            <Typography color="inherit" variant="caption">
              text_value
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='unit'
          align='left'
          padding="default"
          sortDirection={orderBy === 'unit' ? order : false}
        >
          {/* unit */}
          <TableSortLabel
              active={orderBy === 'unit'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'unit')}}
          >
            <Typography color="inherit" variant="caption">
              unit
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='field_plot_id'
          align='right'
          padding="default"
          sortDirection={orderBy === 'field_plot_id' ? order : false}
        >
          {/* field_plot_id */}
          <TableSortLabel
              active={orderBy === 'field_plot_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'field_plot_id')}}
          >
            <Typography color="inherit" variant="caption">
              field_plot_id
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
MeasurementEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};