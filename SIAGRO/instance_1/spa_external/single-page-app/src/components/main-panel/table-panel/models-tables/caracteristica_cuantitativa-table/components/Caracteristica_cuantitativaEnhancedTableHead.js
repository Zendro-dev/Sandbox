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

export default function CaracteristicaCuantitativaEnhancedTableHead(props) {
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
          (permissions&&permissions.caracteristica_cuantitativa&&Array.isArray(permissions.caracteristica_cuantitativa)
          &&(permissions.caracteristica_cuantitativa.includes('update') || permissions.caracteristica_cuantitativa.includes('delete') || permissions.caracteristica_cuantitativa.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.caracteristica_cuantitativa.includes('update') || permissions.caracteristica_cuantitativa.includes('*')) ? 1 : 0) 
                +
                ((permissions.caracteristica_cuantitativa.includes('delete') || permissions.caracteristica_cuantitativa.includes('*')) ? 1 : 0)
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
          key='nombre'
          align='left'
          padding="default"
          sortDirection={orderBy === 'nombre' ? order : false}
        >
          {/* nombre */}
          <TableSortLabel
              active={orderBy === 'nombre'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'nombre')}}
          >
            <Typography color="inherit" variant="caption">
              nombre
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='valor'
          align='right'
          padding="default"
          sortDirection={orderBy === 'valor' ? order : false}
        >
          {/* valor */}
          <TableSortLabel
              active={orderBy === 'valor'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'valor')}}
          >
            <Typography color="inherit" variant="caption">
              valor
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='unidad'
          align='left'
          padding="default"
          sortDirection={orderBy === 'unidad' ? order : false}
        >
          {/* unidad */}
          <TableSortLabel
              active={orderBy === 'unidad'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'unidad')}}
          >
            <Typography color="inherit" variant="caption">
              unidad
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='nombre_corto'
          align='left'
          padding="default"
          sortDirection={orderBy === 'nombre_corto' ? order : false}
        >
          {/* nombre_corto */}
          <TableSortLabel
              active={orderBy === 'nombre_corto'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'nombre_corto')}}
          >
            <Typography color="inherit" variant="caption">
              nombre_corto
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='comentarios'
          align='left'
          padding="default"
          sortDirection={orderBy === 'comentarios' ? order : false}
        >
          {/* comentarios */}
          <TableSortLabel
              active={orderBy === 'comentarios'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'comentarios')}}
          >
            <Typography color="inherit" variant="caption">
              comentarios
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='metodo_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'metodo_id' ? order : false}
        >
          {/* metodo_id */}
          <TableSortLabel
              active={orderBy === 'metodo_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'metodo_id')}}
          >
            <Typography color="inherit" variant="caption">
              metodo_id
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='registro_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'registro_id' ? order : false}
        >
          {/* registro_id */}
          <TableSortLabel
              active={orderBy === 'registro_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'registro_id')}}
          >
            <Typography color="inherit" variant="caption">
              registro_id
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
CaracteristicaCuantitativaEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};