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

export default function RegistroEnhancedTableHead(props) {
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
          (permissions&&permissions.registro&&Array.isArray(permissions.registro)
          &&(permissions.registro.includes('update') || permissions.registro.includes('delete') || permissions.registro.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.registro.includes('update') || permissions.registro.includes('*')) ? 1 : 0) 
                +
                ((permissions.registro.includes('delete') || permissions.registro.includes('*')) ? 1 : 0)
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

        {/* conabio_id*/}
        <TableCell
          key='conabio_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'conabio_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'conabio_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'conabio_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                conabio_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='clave_original'
          align='left'
          padding="default"
          sortDirection={orderBy === 'clave_original' ? order : false}
        >
          {/* clave_original */}
          <TableSortLabel
              active={orderBy === 'clave_original'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'clave_original')}}
          >
            <Typography color="inherit" variant="caption">
              clave_original
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='tipo_alimento'
          align='left'
          padding="default"
          sortDirection={orderBy === 'tipo_alimento' ? order : false}
        >
          {/* tipo_alimento */}
          <TableSortLabel
              active={orderBy === 'tipo_alimento'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'tipo_alimento')}}
          >
            <Typography color="inherit" variant="caption">
              tipo_alimento
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='food_type'
          align='left'
          padding="default"
          sortDirection={orderBy === 'food_type' ? order : false}
        >
          {/* food_type */}
          <TableSortLabel
              active={orderBy === 'food_type'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'food_type')}}
          >
            <Typography color="inherit" variant="caption">
              food_type
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='descripcion_alimento'
          align='left'
          padding="default"
          sortDirection={orderBy === 'descripcion_alimento' ? order : false}
        >
          {/* descripcion_alimento */}
          <TableSortLabel
              active={orderBy === 'descripcion_alimento'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'descripcion_alimento')}}
          >
            <Typography color="inherit" variant="caption">
              descripcion_alimento
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='food_description'
          align='left'
          padding="default"
          sortDirection={orderBy === 'food_description' ? order : false}
        >
          {/* food_description */}
          <TableSortLabel
              active={orderBy === 'food_description'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'food_description')}}
          >
            <Typography color="inherit" variant="caption">
              food_description
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='procedencia'
          align='left'
          padding="default"
          sortDirection={orderBy === 'procedencia' ? order : false}
        >
          {/* procedencia */}
          <TableSortLabel
              active={orderBy === 'procedencia'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'procedencia')}}
          >
            <Typography color="inherit" variant="caption">
              procedencia
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='taxon_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'taxon_id' ? order : false}
        >
          {/* taxon_id */}
          <TableSortLabel
              active={orderBy === 'taxon_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'taxon_id')}}
          >
            <Typography color="inherit" variant="caption">
              taxon_id
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='referencias_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'referencias_ids' ? order : false}
        >
          {/* referencias_ids */}
          <TableSortLabel
              active={orderBy === 'referencias_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'referencias_ids')}}
          >
            <Typography color="inherit" variant="caption">
              referencias_ids
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
RegistroEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};