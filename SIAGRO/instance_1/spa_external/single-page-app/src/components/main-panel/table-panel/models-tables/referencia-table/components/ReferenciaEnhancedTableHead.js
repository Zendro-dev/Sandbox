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

export default function ReferenciaEnhancedTableHead(props) {
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
          (permissions&&permissions.referencia&&Array.isArray(permissions.referencia)
          &&(permissions.referencia.includes('update') || permissions.referencia.includes('delete') || permissions.referencia.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.referencia.includes('update') || permissions.referencia.includes('*')) ? 1 : 0) 
                +
                ((permissions.referencia.includes('delete') || permissions.referencia.includes('*')) ? 1 : 0)
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

        {/* referencia_id*/}
        <TableCell
          key='referencia_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'referencia_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'referencia_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'referencia_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                referencia_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='referencia'
          align='left'
          padding="default"
          sortDirection={orderBy === 'referencia' ? order : false}
        >
          {/* referencia */}
          <TableSortLabel
              active={orderBy === 'referencia'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'referencia')}}
          >
            <Typography color="inherit" variant="caption">
              referencia
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='registros_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'registros_ids' ? order : false}
        >
          {/* registros_ids */}
          <TableSortLabel
              active={orderBy === 'registros_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'registros_ids')}}
          >
            <Typography color="inherit" variant="caption">
              registros_ids
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
ReferenciaEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};