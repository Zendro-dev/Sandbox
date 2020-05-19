import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function ObservationEnhancedTableHead(props) {
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
          (permissions&&permissions.observation&&Array.isArray(permissions.observation)
          &&(permissions.observation.includes('update') || permissions.observation.includes('delete') || permissions.observation.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.observation.includes('update') || permissions.observation.includes('*')) ? 1 : 0) 
                +
                ((permissions.observation.includes('delete') || permissions.observation.includes('*')) ? 1 : 0)
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
          key='collector'
          align='left'
          padding="default"
          sortDirection={orderBy === 'collector' ? order : false}
        >
          {/* collector */}
          <TableSortLabel
              active={orderBy === 'collector'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'collector')}}
          >
            <Typography color="inherit" variant="caption">
              collector
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='germplasmDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'germplasmDbId' ? order : false}
        >
          {/* germplasmDbId */}
          <TableSortLabel
              active={orderBy === 'germplasmDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'germplasmDbId')}}
          >
            <Typography color="inherit" variant="caption">
              germplasmDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationTimeStamp'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationTimeStamp' ? order : false}
        >
          {/* observationTimeStamp */}
          <TableSortLabel
              active={orderBy === 'observationTimeStamp'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationTimeStamp')}}
          >
            <Typography color="inherit" variant="caption">
              observationTimeStamp
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
          key='observationVariableDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationVariableDbId' ? order : false}
        >
          {/* observationVariableDbId */}
          <TableSortLabel
              active={orderBy === 'observationVariableDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationVariableDbId')}}
          >
            <Typography color="inherit" variant="caption">
              observationVariableDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='studyDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'studyDbId' ? order : false}
        >
          {/* studyDbId */}
          <TableSortLabel
              active={orderBy === 'studyDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'studyDbId')}}
          >
            <Typography color="inherit" variant="caption">
              studyDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='uploadedBy'
          align='left'
          padding="default"
          sortDirection={orderBy === 'uploadedBy' ? order : false}
        >
          {/* uploadedBy */}
          <TableSortLabel
              active={orderBy === 'uploadedBy'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'uploadedBy')}}
          >
            <Typography color="inherit" variant="caption">
              uploadedBy
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='value'
          align='left'
          padding="default"
          sortDirection={orderBy === 'value' ? order : false}
        >
          {/* value */}
          <TableSortLabel
              active={orderBy === 'value'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'value')}}
          >
            <Typography color="inherit" variant="caption">
              value
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationDbId' ? order : false}
        >
          {/* observationDbId */}
          <TableSortLabel
              active={orderBy === 'observationDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationDbId')}}
          >
            <Typography color="inherit" variant="caption">
              observationDbId
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
          key='imageDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'imageDbId' ? order : false}
        >
          {/* imageDbId */}
          <TableSortLabel
              active={orderBy === 'imageDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'imageDbId')}}
          >
            <Typography color="inherit" variant="caption">
              imageDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
ObservationEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};