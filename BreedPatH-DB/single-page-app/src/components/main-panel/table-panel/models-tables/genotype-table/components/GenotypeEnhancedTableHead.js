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

export default function GenotypeEnhancedTableHead(props) {
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
          (permissions&&permissions.genotype&&Array.isArray(permissions.genotype)
          &&(permissions.genotype.includes('update') || permissions.genotype.includes('delete') || permissions.genotype.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.genotype.includes('update') || permissions.genotype.includes('*')) ? 1 : 0) 
                +
                ((permissions.genotype.includes('delete') || permissions.genotype.includes('*')) ? 1 : 0)
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
          key='pedigree_type'
          align='left'
          padding="default"
          sortDirection={orderBy === 'pedigree_type' ? order : false}
        >
          {/* pedigree_type */}
          <TableSortLabel
              active={orderBy === 'pedigree_type'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'pedigree_type')}}
          >
            <Typography color="inherit" variant="caption">
              pedigree_type
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mother_id'
          align='right'
          padding="default"
          sortDirection={orderBy === 'mother_id' ? order : false}
        >
          {/* mother_id */}
          <TableSortLabel
              active={orderBy === 'mother_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mother_id')}}
          >
            <Typography color="inherit" variant="caption">
              mother_id
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='father_id'
          align='right'
          padding="default"
          sortDirection={orderBy === 'father_id' ? order : false}
        >
          {/* father_id */}
          <TableSortLabel
              active={orderBy === 'father_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'father_id')}}
          >
            <Typography color="inherit" variant="caption">
              father_id
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='breeding_pool_id'
          align='right'
          padding="default"
          sortDirection={orderBy === 'breeding_pool_id' ? order : false}
        >
          {/* breeding_pool_id */}
          <TableSortLabel
              active={orderBy === 'breeding_pool_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'breeding_pool_id')}}
          >
            <Typography color="inherit" variant="caption">
              breeding_pool_id
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
GenotypeEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};