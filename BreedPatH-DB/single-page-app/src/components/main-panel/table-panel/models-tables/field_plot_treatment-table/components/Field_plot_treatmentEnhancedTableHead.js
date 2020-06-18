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

export default function FieldPlotTreatmentEnhancedTableHead(props) {
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
          (permissions&&permissions.field_plot_treatment&&Array.isArray(permissions.field_plot_treatment)
          &&(permissions.field_plot_treatment.includes('update') || permissions.field_plot_treatment.includes('delete') || permissions.field_plot_treatment.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.field_plot_treatment.includes('update') || permissions.field_plot_treatment.includes('*')) ? 1 : 0) 
                +
                ((permissions.field_plot_treatment.includes('delete') || permissions.field_plot_treatment.includes('*')) ? 1 : 0)
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
          key='start_date'
          align='left'
          padding="default"
          sortDirection={orderBy === 'start_date' ? order : false}
        >
          {/* start_date */}
          <TableSortLabel
              active={orderBy === 'start_date'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'start_date')}}
          >
            <Typography color="inherit" variant="caption">
              start_date
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='end_date'
          align='left'
          padding="default"
          sortDirection={orderBy === 'end_date' ? order : false}
        >
          {/* end_date */}
          <TableSortLabel
              active={orderBy === 'end_date'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'end_date')}}
          >
            <Typography color="inherit" variant="caption">
              end_date
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='name'
          align='left'
          padding="default"
          sortDirection={orderBy === 'name' ? order : false}
        >
          {/* name */}
          <TableSortLabel
              active={orderBy === 'name'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'name')}}
          >
            <Typography color="inherit" variant="caption">
              name
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='description'
          align='left'
          padding="default"
          sortDirection={orderBy === 'description' ? order : false}
        >
          {/* description */}
          <TableSortLabel
              active={orderBy === 'description'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'description')}}
          >
            <Typography color="inherit" variant="caption">
              description
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='chemical'
          align='left'
          padding="default"
          sortDirection={orderBy === 'chemical' ? order : false}
        >
          {/* chemical */}
          <TableSortLabel
              active={orderBy === 'chemical'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'chemical')}}
          >
            <Typography color="inherit" variant="caption">
              chemical
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='pesticide_type'
          align='left'
          padding="default"
          sortDirection={orderBy === 'pesticide_type' ? order : false}
        >
          {/* pesticide_type */}
          <TableSortLabel
              active={orderBy === 'pesticide_type'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'pesticide_type')}}
          >
            <Typography color="inherit" variant="caption">
              pesticide_type
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
FieldPlotTreatmentEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};