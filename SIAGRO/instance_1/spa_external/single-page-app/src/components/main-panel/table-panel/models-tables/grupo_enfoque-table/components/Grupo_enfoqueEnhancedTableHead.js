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

export default function GrupoEnfoqueEnhancedTableHead(props) {
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
          (permissions&&permissions.grupo_enfoque&&Array.isArray(permissions.grupo_enfoque)
          &&(permissions.grupo_enfoque.includes('update') || permissions.grupo_enfoque.includes('delete') || permissions.grupo_enfoque.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.grupo_enfoque.includes('update') || permissions.grupo_enfoque.includes('*')) ? 1 : 0) 
                +
                ((permissions.grupo_enfoque.includes('delete') || permissions.grupo_enfoque.includes('*')) ? 1 : 0)
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

        {/* grupo_id*/}
        <TableCell
          key='grupo_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'grupo_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'grupo_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'grupo_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                grupo_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='tipo_grupo'
          align='left'
          padding="default"
          sortDirection={orderBy === 'tipo_grupo' ? order : false}
        >
          {/* tipo_grupo */}
          <TableSortLabel
              active={orderBy === 'tipo_grupo'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'tipo_grupo')}}
          >
            <Typography color="inherit" variant="caption">
              tipo_grupo
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='numero_participantes'
          align='right'
          padding="default"
          sortDirection={orderBy === 'numero_participantes' ? order : false}
        >
          {/* numero_participantes */}
          <TableSortLabel
              active={orderBy === 'numero_participantes'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'numero_participantes')}}
          >
            <Typography color="inherit" variant="caption">
              numero_participantes
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='fecha'
          align='left'
          padding="default"
          sortDirection={orderBy === 'fecha' ? order : false}
        >
          {/* fecha */}
          <TableSortLabel
              active={orderBy === 'fecha'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fecha')}}
          >
            <Typography color="inherit" variant="caption">
              fecha
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='lista_especies'
          align='left'
          padding="default"
          sortDirection={orderBy === 'lista_especies' ? order : false}
        >
          {/* lista_especies */}
          <TableSortLabel
              active={orderBy === 'lista_especies'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'lista_especies')}}
          >
            <Typography color="inherit" variant="caption">
              lista_especies
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='sitio_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'sitio_id' ? order : false}
        >
          {/* sitio_id */}
          <TableSortLabel
              active={orderBy === 'sitio_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'sitio_id')}}
          >
            <Typography color="inherit" variant="caption">
              sitio_id
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
GrupoEnfoqueEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};