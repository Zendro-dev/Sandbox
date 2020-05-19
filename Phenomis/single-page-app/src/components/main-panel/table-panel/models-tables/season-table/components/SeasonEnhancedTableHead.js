import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

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
          key='seasonDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'seasonDbId' ? order : false}
        >
          {/* seasonDbId */}
          <TableSortLabel
              active={orderBy === 'seasonDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'seasonDbId')}}
          >
            <Typography color="inherit" variant="caption">
              seasonDbId
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

      </TableRow>
    </TableHead>
  );
}
SeasonEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};