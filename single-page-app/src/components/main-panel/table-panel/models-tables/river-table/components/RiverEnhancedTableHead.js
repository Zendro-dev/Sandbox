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

export default function RiverEnhancedTableHead(props) {
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
          (permissions&&permissions.river&&Array.isArray(permissions.river)
          &&(permissions.river.includes('update') || permissions.river.includes('delete') || permissions.river.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.river.includes('update') || permissions.river.includes('*')) ? 1 : 0) 
                +
                ((permissions.river.includes('delete') || permissions.river.includes('*')) ? 1 : 0)
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

        {/* river_id*/}
        <TableCell
          key='river_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'river_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'river_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'river_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                river_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='name'
          align='left'
          padding="default"
          sortDirection={orderBy === 'name' ? order : false}
        >
          {/* name */}
          <TableSortLabel
              active={orderBy === 'name'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'name')}}
          >
            <Typography color="inherit" variant="caption">
              name
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='length'
          align='right'
          padding="default"
          sortDirection={orderBy === 'length' ? order : false}
        >
          {/* length */}
          <TableSortLabel
              active={orderBy === 'length'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'length')}}
          >
            <Typography color="inherit" variant="caption">
              length
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='country_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'country_ids' ? order : false}
        >
          {/* country_ids */}
          <TableSortLabel
              active={orderBy === 'country_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'country_ids')}}
          >
            <Typography color="inherit" variant="caption">
              country_ids
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
RiverEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};