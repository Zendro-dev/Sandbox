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

export default function PlantVariantEnhancedTableHead(props) {
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
          (permissions&&permissions.plant_variant&&Array.isArray(permissions.plant_variant)
          &&(permissions.plant_variant.includes('update') || permissions.plant_variant.includes('delete') || permissions.plant_variant.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.plant_variant.includes('update') || permissions.plant_variant.includes('*')) ? 1 : 0) 
                +
                ((permissions.plant_variant.includes('delete') || permissions.plant_variant.includes('*')) ? 1 : 0)
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

        {/* plant_variant_ID*/}
        <TableCell
          key='plant_variant_ID'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'plant_variant_ID' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'plant_variant_ID'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'plant_variant_ID') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                plant_variant_ID              </Typography>
            </Grid>
          </Grid>
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
          key='genotype'
          align='left'
          padding="default"
          sortDirection={orderBy === 'genotype' ? order : false}
        >
          {/* genotype */}
          <TableSortLabel
              active={orderBy === 'genotype'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'genotype')}}
          >
            <Typography color="inherit" variant="caption">
              genotype
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='disease_resistances'
          align='left'
          padding="default"
          sortDirection={orderBy === 'disease_resistances' ? order : false}
        >
          {/* disease_resistances */}
          <TableSortLabel
              active={orderBy === 'disease_resistances'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'disease_resistances')}}
          >
            <Typography color="inherit" variant="caption">
              disease_resistances
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
PlantVariantEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};