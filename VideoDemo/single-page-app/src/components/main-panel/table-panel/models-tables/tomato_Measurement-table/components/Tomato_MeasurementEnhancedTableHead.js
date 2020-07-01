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

export default function TomatoMeasurementEnhancedTableHead(props) {
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
          (permissions&&permissions.tomato_Measurement&&Array.isArray(permissions.tomato_Measurement)
          &&(permissions.tomato_Measurement.includes('update') || permissions.tomato_Measurement.includes('delete') || permissions.tomato_Measurement.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.tomato_Measurement.includes('update') || permissions.tomato_Measurement.includes('*')) ? 1 : 0) 
                +
                ((permissions.tomato_Measurement.includes('delete') || permissions.tomato_Measurement.includes('*')) ? 1 : 0)
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

        {/* tomato_ID*/}
        <TableCell
          key='tomato_ID'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'tomato_ID' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'tomato_ID'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'tomato_ID') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                tomato_ID              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='no_fruit'
          align='right'
          padding="default"
          sortDirection={orderBy === 'no_fruit' ? order : false}
        >
          {/* no_fruit */}
          <TableSortLabel
              active={orderBy === 'no_fruit'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'no_fruit')}}
          >
            <Typography color="inherit" variant="caption">
              no_fruit
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='sugar_content'
          align='right'
          padding="default"
          sortDirection={orderBy === 'sugar_content' ? order : false}
        >
          {/* sugar_content */}
          <TableSortLabel
              active={orderBy === 'sugar_content'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'sugar_content')}}
          >
            <Typography color="inherit" variant="caption">
              sugar_content
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='plant_variant_ID'
          align='left'
          padding="default"
          sortDirection={orderBy === 'plant_variant_ID' ? order : false}
        >
          {/* plant_variant_ID */}
          <TableSortLabel
              active={orderBy === 'plant_variant_ID'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'plant_variant_ID')}}
          >
            <Typography color="inherit" variant="caption">
              plant_variant_ID
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
TomatoMeasurementEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};