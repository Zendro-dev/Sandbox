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

export default function ScaleEnhancedTableHead(props) {
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
          (permissions&&permissions.scale&&Array.isArray(permissions.scale)
          &&(permissions.scale.includes('update') || permissions.scale.includes('delete') || permissions.scale.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.scale.includes('update') || permissions.scale.includes('*')) ? 1 : 0) 
                +
                ((permissions.scale.includes('delete') || permissions.scale.includes('*')) ? 1 : 0)
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

        {/* scaleDbId*/}
        <TableCell
          key='scaleDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'scaleDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'scaleDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'scaleDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                scaleDbId              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='decimalPlaces'
          align='right'
          padding="default"
          sortDirection={orderBy === 'decimalPlaces' ? order : false}
        >
          {/* decimalPlaces */}
          <TableSortLabel
              active={orderBy === 'decimalPlaces'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'decimalPlaces')}}
          >
            <Typography color="inherit" variant="caption">
              decimalPlaces
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='scaleName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'scaleName' ? order : false}
        >
          {/* scaleName */}
          <TableSortLabel
              active={orderBy === 'scaleName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'scaleName')}}
          >
            <Typography color="inherit" variant="caption">
              scaleName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='xref'
          align='left'
          padding="default"
          sortDirection={orderBy === 'xref' ? order : false}
        >
          {/* xref */}
          <TableSortLabel
              active={orderBy === 'xref'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'xref')}}
          >
            <Typography color="inherit" variant="caption">
              xref
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='ontologyDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'ontologyDbId' ? order : false}
        >
          {/* ontologyDbId */}
          <TableSortLabel
              active={orderBy === 'ontologyDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'ontologyDbId')}}
          >
            <Typography color="inherit" variant="caption">
              ontologyDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
ScaleEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};