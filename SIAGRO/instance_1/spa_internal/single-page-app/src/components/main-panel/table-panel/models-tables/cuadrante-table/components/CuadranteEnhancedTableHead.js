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

export default function CuadranteEnhancedTableHead(props) {
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
          (permissions&&permissions.cuadrante&&Array.isArray(permissions.cuadrante)
          &&(permissions.cuadrante.includes('update') || permissions.cuadrante.includes('delete') || permissions.cuadrante.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.cuadrante.includes('update') || permissions.cuadrante.includes('*')) ? 1 : 0) 
                +
                ((permissions.cuadrante.includes('delete') || permissions.cuadrante.includes('*')) ? 1 : 0)
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

        {/* cuadrante_id*/}
        <TableCell
          key='cuadrante_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'cuadrante_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'cuadrante_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'cuadrante_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                cuadrante_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='produccion_valor'
          align='right'
          padding="default"
          sortDirection={orderBy === 'produccion_valor' ? order : false}
        >
          {/* produccion_valor */}
          <TableSortLabel
              active={orderBy === 'produccion_valor'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'produccion_valor')}}
          >
            <Typography color="inherit" variant="caption">
              produccion_valor
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='produccion_etiqueta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'produccion_etiqueta' ? order : false}
        >
          {/* produccion_etiqueta */}
          <TableSortLabel
              active={orderBy === 'produccion_etiqueta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'produccion_etiqueta')}}
          >
            <Typography color="inherit" variant="caption">
              produccion_etiqueta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='autoconsumo_valor'
          align='right'
          padding="default"
          sortDirection={orderBy === 'autoconsumo_valor' ? order : false}
        >
          {/* autoconsumo_valor */}
          <TableSortLabel
              active={orderBy === 'autoconsumo_valor'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'autoconsumo_valor')}}
          >
            <Typography color="inherit" variant="caption">
              autoconsumo_valor
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='autoconsumo_etiqueta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'autoconsumo_etiqueta' ? order : false}
        >
          {/* autoconsumo_etiqueta */}
          <TableSortLabel
              active={orderBy === 'autoconsumo_etiqueta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'autoconsumo_etiqueta')}}
          >
            <Typography color="inherit" variant="caption">
              autoconsumo_etiqueta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='compra_valor'
          align='right'
          padding="default"
          sortDirection={orderBy === 'compra_valor' ? order : false}
        >
          {/* compra_valor */}
          <TableSortLabel
              active={orderBy === 'compra_valor'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'compra_valor')}}
          >
            <Typography color="inherit" variant="caption">
              compra_valor
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='compra_etiqueta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'compra_etiqueta' ? order : false}
        >
          {/* compra_etiqueta */}
          <TableSortLabel
              active={orderBy === 'compra_etiqueta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'compra_etiqueta')}}
          >
            <Typography color="inherit" variant="caption">
              compra_etiqueta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='venta_valor'
          align='right'
          padding="default"
          sortDirection={orderBy === 'venta_valor' ? order : false}
        >
          {/* venta_valor */}
          <TableSortLabel
              active={orderBy === 'venta_valor'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'venta_valor')}}
          >
            <Typography color="inherit" variant="caption">
              venta_valor
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='venta_etiqueta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'venta_etiqueta' ? order : false}
        >
          {/* venta_etiqueta */}
          <TableSortLabel
              active={orderBy === 'venta_etiqueta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'venta_etiqueta')}}
          >
            <Typography color="inherit" variant="caption">
              venta_etiqueta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='nombre_comun_grupo_enfoque'
          align='left'
          padding="default"
          sortDirection={orderBy === 'nombre_comun_grupo_enfoque' ? order : false}
        >
          {/* nombre_comun_grupo_enfoque */}
          <TableSortLabel
              active={orderBy === 'nombre_comun_grupo_enfoque'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'nombre_comun_grupo_enfoque')}}
          >
            <Typography color="inherit" variant="caption">
              nombre_comun_grupo_enfoque
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='grupo_enfoque_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'grupo_enfoque_id' ? order : false}
        >
          {/* grupo_enfoque_id */}
          <TableSortLabel
              active={orderBy === 'grupo_enfoque_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'grupo_enfoque_id')}}
          >
            <Typography color="inherit" variant="caption">
              grupo_enfoque_id
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
          key='tipo_planta_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'tipo_planta_id' ? order : false}
        >
          {/* tipo_planta_id */}
          <TableSortLabel
              active={orderBy === 'tipo_planta_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'tipo_planta_id')}}
          >
            <Typography color="inherit" variant="caption">
              tipo_planta_id
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
CuadranteEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};