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

export default function FieldPlotEnhancedTableHead(props) {
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
          (permissions&&permissions.field_plot&&Array.isArray(permissions.field_plot)
          &&(permissions.field_plot.includes('update') || permissions.field_plot.includes('delete') || permissions.field_plot.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.field_plot.includes('update') || permissions.field_plot.includes('*')) ? 1 : 0) 
                +
                ((permissions.field_plot.includes('delete') || permissions.field_plot.includes('*')) ? 1 : 0)
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
          key='field_name'
          align='left'
          padding="default"
          sortDirection={orderBy === 'field_name' ? order : false}
        >
          {/* field_name */}
          <TableSortLabel
              active={orderBy === 'field_name'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'field_name')}}
          >
            <Typography color="inherit" variant="caption">
              field_name
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='coordinates_or_name'
          align='left'
          padding="default"
          sortDirection={orderBy === 'coordinates_or_name' ? order : false}
        >
          {/* coordinates_or_name */}
          <TableSortLabel
              active={orderBy === 'coordinates_or_name'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'coordinates_or_name')}}
          >
            <Typography color="inherit" variant="caption">
              coordinates_or_name
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='year'
          align='left'
          padding="default"
          sortDirection={orderBy === 'year' ? order : false}
        >
          {/* year */}
          <TableSortLabel
              active={orderBy === 'year'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'year')}}
          >
            <Typography color="inherit" variant="caption">
              year
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='area_sqm'
          align='right'
          padding="default"
          sortDirection={orderBy === 'area_sqm' ? order : false}
        >
          {/* area_sqm */}
          <TableSortLabel
              active={orderBy === 'area_sqm'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'area_sqm')}}
          >
            <Typography color="inherit" variant="caption">
              area_sqm
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='type'
          align='left'
          padding="default"
          sortDirection={orderBy === 'type' ? order : false}
        >
          {/* type */}
          <TableSortLabel
              active={orderBy === 'type'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'type')}}
          >
            <Typography color="inherit" variant="caption">
              type
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='genotype_id'
          align='right'
          padding="default"
          sortDirection={orderBy === 'genotype_id' ? order : false}
        >
          {/* genotype_id */}
          <TableSortLabel
              active={orderBy === 'genotype_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'genotype_id')}}
          >
            <Typography color="inherit" variant="caption">
              genotype_id
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
FieldPlotEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};