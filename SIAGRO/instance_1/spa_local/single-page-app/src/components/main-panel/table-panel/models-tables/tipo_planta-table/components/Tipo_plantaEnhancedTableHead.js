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

export default function TipoPlantaEnhancedTableHead(props) {
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
          (permissions&&permissions.tipo_planta&&Array.isArray(permissions.tipo_planta)
          &&(permissions.tipo_planta.includes('update') || permissions.tipo_planta.includes('delete') || permissions.tipo_planta.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.tipo_planta.includes('update') || permissions.tipo_planta.includes('*')) ? 1 : 0) 
                +
                ((permissions.tipo_planta.includes('delete') || permissions.tipo_planta.includes('*')) ? 1 : 0)
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

        {/* tipo_planta_id*/}
        <TableCell
          key='tipo_planta_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'tipo_planta_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'tipo_planta_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'tipo_planta_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                tipo_planta_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='tipo_planta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'tipo_planta' ? order : false}
        >
          {/* tipo_planta */}
          <TableSortLabel
              active={orderBy === 'tipo_planta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'tipo_planta')}}
          >
            <Typography color="inherit" variant="caption">
              tipo_planta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='foto_produccion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'foto_produccion' ? order : false}
        >
          {/* foto_produccion */}
          <TableSortLabel
              active={orderBy === 'foto_produccion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'foto_produccion')}}
          >
            <Typography color="inherit" variant="caption">
              foto_produccion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='foto_autoconsumo'
          align='left'
          padding="default"
          sortDirection={orderBy === 'foto_autoconsumo' ? order : false}
        >
          {/* foto_autoconsumo */}
          <TableSortLabel
              active={orderBy === 'foto_autoconsumo'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'foto_autoconsumo')}}
          >
            <Typography color="inherit" variant="caption">
              foto_autoconsumo
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='foto_venta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'foto_venta' ? order : false}
        >
          {/* foto_venta */}
          <TableSortLabel
              active={orderBy === 'foto_venta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'foto_venta')}}
          >
            <Typography color="inherit" variant="caption">
              foto_venta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='foto_compra'
          align='left'
          padding="default"
          sortDirection={orderBy === 'foto_compra' ? order : false}
        >
          {/* foto_compra */}
          <TableSortLabel
              active={orderBy === 'foto_compra'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'foto_compra')}}
          >
            <Typography color="inherit" variant="caption">
              foto_compra
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='justificacion_produccion_cuadrante1'
          align='left'
          padding="default"
          sortDirection={orderBy === 'justificacion_produccion_cuadrante1' ? order : false}
        >
          {/* justificacion_produccion_cuadrante1 */}
          <TableSortLabel
              active={orderBy === 'justificacion_produccion_cuadrante1'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'justificacion_produccion_cuadrante1')}}
          >
            <Typography color="inherit" variant="caption">
              justificacion_produccion_cuadrante1
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='justificacion_produccion_cuadrante2'
          align='left'
          padding="default"
          sortDirection={orderBy === 'justificacion_produccion_cuadrante2' ? order : false}
        >
          {/* justificacion_produccion_cuadrante2 */}
          <TableSortLabel
              active={orderBy === 'justificacion_produccion_cuadrante2'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'justificacion_produccion_cuadrante2')}}
          >
            <Typography color="inherit" variant="caption">
              justificacion_produccion_cuadrante2
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='justificacion_produccion_cuadrante3'
          align='left'
          padding="default"
          sortDirection={orderBy === 'justificacion_produccion_cuadrante3' ? order : false}
        >
          {/* justificacion_produccion_cuadrante3 */}
          <TableSortLabel
              active={orderBy === 'justificacion_produccion_cuadrante3'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'justificacion_produccion_cuadrante3')}}
          >
            <Typography color="inherit" variant="caption">
              justificacion_produccion_cuadrante3
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='justificacion_produccion_cuadrante4'
          align='left'
          padding="default"
          sortDirection={orderBy === 'justificacion_produccion_cuadrante4' ? order : false}
        >
          {/* justificacion_produccion_cuadrante4 */}
          <TableSortLabel
              active={orderBy === 'justificacion_produccion_cuadrante4'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'justificacion_produccion_cuadrante4')}}
          >
            <Typography color="inherit" variant="caption">
              justificacion_produccion_cuadrante4
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
TipoPlantaEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};