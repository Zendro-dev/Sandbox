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

export default function MetodoEnhancedTableHead(props) {
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
          (permissions&&permissions.metodo&&Array.isArray(permissions.metodo)
          &&(permissions.metodo.includes('update') || permissions.metodo.includes('delete') || permissions.metodo.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.metodo.includes('update') || permissions.metodo.includes('*')) ? 1 : 0) 
                +
                ((permissions.metodo.includes('delete') || permissions.metodo.includes('*')) ? 1 : 0)
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
          key='descripcion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'descripcion' ? order : false}
        >
          {/* descripcion */}
          <TableSortLabel
              active={orderBy === 'descripcion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'descripcion')}}
          >
            <Typography color="inherit" variant="caption">
              descripcion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='referencias'
          align='left'
          padding="default"
          sortDirection={orderBy === 'referencias' ? order : false}
        >
          {/* referencias */}
          <TableSortLabel
              active={orderBy === 'referencias'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'referencias')}}
          >
            <Typography color="inherit" variant="caption">
              referencias
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='link_referencias'
          align='left'
          padding="default"
          sortDirection={orderBy === 'link_referencias' ? order : false}
        >
          {/* link_referencias */}
          <TableSortLabel
              active={orderBy === 'link_referencias'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'link_referencias')}}
          >
            <Typography color="inherit" variant="caption">
              link_referencias
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
MetodoEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};