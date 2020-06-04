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

export default function LocationEnhancedTableHead(props) {
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
          (permissions&&permissions.location&&Array.isArray(permissions.location)
          &&(permissions.location.includes('update') || permissions.location.includes('delete') || permissions.location.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.location.includes('update') || permissions.location.includes('*')) ? 1 : 0) 
                +
                ((permissions.location.includes('delete') || permissions.location.includes('*')) ? 1 : 0)
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

        {/* location_id*/}
        <TableCell
          key='location_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'location_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'location_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'location_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                location_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='pais'
          align='left'
          padding="default"
          sortDirection={orderBy === 'pais' ? order : false}
        >
          {/* pais */}
          <TableSortLabel
              active={orderBy === 'pais'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'pais')}}
          >
            <Typography color="inherit" variant="caption">
              pais
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='estado'
          align='left'
          padding="default"
          sortDirection={orderBy === 'estado' ? order : false}
        >
          {/* estado */}
          <TableSortLabel
              active={orderBy === 'estado'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'estado')}}
          >
            <Typography color="inherit" variant="caption">
              estado
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='municipio'
          align='left'
          padding="default"
          sortDirection={orderBy === 'municipio' ? order : false}
        >
          {/* municipio */}
          <TableSortLabel
              active={orderBy === 'municipio'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'municipio')}}
          >
            <Typography color="inherit" variant="caption">
              municipio
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='localidad'
          align='left'
          padding="default"
          sortDirection={orderBy === 'localidad' ? order : false}
        >
          {/* localidad */}
          <TableSortLabel
              active={orderBy === 'localidad'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'localidad')}}
          >
            <Typography color="inherit" variant="caption">
              localidad
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
LocationEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};