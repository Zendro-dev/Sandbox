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

export default function SeasonEnhancedTableHead(props) {
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
          (permissions&&permissions.season&&Array.isArray(permissions.season)
          &&(permissions.season.includes('update') || permissions.season.includes('delete') || permissions.season.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.season.includes('update') || permissions.season.includes('*')) ? 1 : 0) 
                +
                ((permissions.season.includes('delete') || permissions.season.includes('*')) ? 1 : 0)
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

        {/* seasonDbId*/}
        <TableCell
          key='seasonDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'seasonDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'seasonDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'seasonDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                seasonDbId              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='season'
          align='left'
          padding="default"
          sortDirection={orderBy === 'season' ? order : false}
        >
          {/* season */}
          <TableSortLabel
              active={orderBy === 'season'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'season')}}
          >
            <Typography color="inherit" variant="caption">
              season
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='year'
          align='right'
          padding="default"
          sortDirection={orderBy === 'year' ? order : false}
        >
          {/* year */}
          <TableSortLabel
              active={orderBy === 'year'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'year')}}
          >
            <Typography color="inherit" variant="caption">
              year
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='studyDbIds'
          align='left'
          padding="default"
          sortDirection={orderBy === 'studyDbIds' ? order : false}
        >
          {/* studyDbIds */}
          <TableSortLabel
              active={orderBy === 'studyDbIds'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'studyDbIds')}}
          >
            <Typography color="inherit" variant="caption">
              studyDbIds
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
SeasonEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};