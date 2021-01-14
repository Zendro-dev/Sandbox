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

export default function SPARefactorEnhancedTableHead(props) {
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
          (permissions&&permissions.sPARefactor&&Array.isArray(permissions.sPARefactor)
          &&(permissions.sPARefactor.includes('update') || permissions.sPARefactor.includes('delete') || permissions.sPARefactor.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.sPARefactor.includes('update') || permissions.sPARefactor.includes('*')) ? 1 : 0) 
                +
                ((permissions.sPARefactor.includes('delete') || permissions.sPARefactor.includes('*')) ? 1 : 0)
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

        {/* int*/}
        <TableCell
          key='int'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'int' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'int'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'int') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                int              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='array'
          align='left'
          padding="default"
          sortDirection={orderBy === 'array' ? order : false}
        >
          {/* array */}
          <TableSortLabel
              active={orderBy === 'array'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'array')}}
          >
            <Typography color="inherit" variant="caption">
              array
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='string'
          align='left'
          padding="default"
          sortDirection={orderBy === 'string' ? order : false}
        >
          {/* string */}
          <TableSortLabel
              active={orderBy === 'string'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'string')}}
          >
            <Typography color="inherit" variant="caption">
              string
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='float'
          align='right'
          padding="default"
          sortDirection={orderBy === 'float' ? order : false}
        >
          {/* float */}
          <TableSortLabel
              active={orderBy === 'float'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'float')}}
          >
            <Typography color="inherit" variant="caption">
              float
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='date'
          align='left'
          padding="default"
          sortDirection={orderBy === 'date' ? order : false}
        >
          {/* date */}
          <TableSortLabel
              active={orderBy === 'date'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'date')}}
          >
            <Typography color="inherit" variant="caption">
              date
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='time'
          align='left'
          padding="default"
          sortDirection={orderBy === 'time' ? order : false}
        >
          {/* time */}
          <TableSortLabel
              active={orderBy === 'time'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'time')}}
          >
            <Typography color="inherit" variant="caption">
              time
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='datetime'
          align='left'
          padding="default"
          sortDirection={orderBy === 'datetime' ? order : false}
        >
          {/* datetime */}
          <TableSortLabel
              active={orderBy === 'datetime'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'datetime')}}
          >
            <Typography color="inherit" variant="caption">
              datetime
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
SPARefactorEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};