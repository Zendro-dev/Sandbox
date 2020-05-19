import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function ObservationUnitPositionEnhancedTableHead(props) {
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
          (permissions&&permissions.observationUnitPosition&&Array.isArray(permissions.observationUnitPosition)
          &&(permissions.observationUnitPosition.includes('update') || permissions.observationUnitPosition.includes('delete') || permissions.observationUnitPosition.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.observationUnitPosition.includes('update') || permissions.observationUnitPosition.includes('*')) ? 1 : 0) 
                +
                ((permissions.observationUnitPosition.includes('delete') || permissions.observationUnitPosition.includes('*')) ? 1 : 0)
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
          key='blockNumber'
          align='left'
          padding="default"
          sortDirection={orderBy === 'blockNumber' ? order : false}
        >
          {/* blockNumber */}
          <TableSortLabel
              active={orderBy === 'blockNumber'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'blockNumber')}}
          >
            <Typography color="inherit" variant="caption">
              blockNumber
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='entryNumber'
          align='left'
          padding="default"
          sortDirection={orderBy === 'entryNumber' ? order : false}
        >
          {/* entryNumber */}
          <TableSortLabel
              active={orderBy === 'entryNumber'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'entryNumber')}}
          >
            <Typography color="inherit" variant="caption">
              entryNumber
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='positionCoordinateX'
          align='left'
          padding="default"
          sortDirection={orderBy === 'positionCoordinateX' ? order : false}
        >
          {/* positionCoordinateX */}
          <TableSortLabel
              active={orderBy === 'positionCoordinateX'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'positionCoordinateX')}}
          >
            <Typography color="inherit" variant="caption">
              positionCoordinateX
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='positionCoordinateY'
          align='left'
          padding="default"
          sortDirection={orderBy === 'positionCoordinateY' ? order : false}
        >
          {/* positionCoordinateY */}
          <TableSortLabel
              active={orderBy === 'positionCoordinateY'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'positionCoordinateY')}}
          >
            <Typography color="inherit" variant="caption">
              positionCoordinateY
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='replicate'
          align='left'
          padding="default"
          sortDirection={orderBy === 'replicate' ? order : false}
        >
          {/* replicate */}
          <TableSortLabel
              active={orderBy === 'replicate'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'replicate')}}
          >
            <Typography color="inherit" variant="caption">
              replicate
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationUnitDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationUnitDbId' ? order : false}
        >
          {/* observationUnitDbId */}
          <TableSortLabel
              active={orderBy === 'observationUnitDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationUnitDbId')}}
          >
            <Typography color="inherit" variant="caption">
              observationUnitDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationUnitPositionDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationUnitPositionDbId' ? order : false}
        >
          {/* observationUnitPositionDbId */}
          <TableSortLabel
              active={orderBy === 'observationUnitPositionDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationUnitPositionDbId')}}
          >
            <Typography color="inherit" variant="caption">
              observationUnitPositionDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
ObservationUnitPositionEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};