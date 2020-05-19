import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function ObservationUnitEnhancedTableHead(props) {
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
          (permissions&&permissions.observationUnit&&Array.isArray(permissions.observationUnit)
          &&(permissions.observationUnit.includes('update') || permissions.observationUnit.includes('delete') || permissions.observationUnit.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.observationUnit.includes('update') || permissions.observationUnit.includes('*')) ? 1 : 0) 
                +
                ((permissions.observationUnit.includes('delete') || permissions.observationUnit.includes('*')) ? 1 : 0)
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
          key='locationDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'locationDbId' ? order : false}
        >
          {/* locationDbId */}
          <TableSortLabel
              active={orderBy === 'locationDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'locationDbId')}}
          >
            <Typography color="inherit" variant="caption">
              locationDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationLevel'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationLevel' ? order : false}
        >
          {/* observationLevel */}
          <TableSortLabel
              active={orderBy === 'observationLevel'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationLevel')}}
          >
            <Typography color="inherit" variant="caption">
              observationLevel
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationUnitName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationUnitName' ? order : false}
        >
          {/* observationUnitName */}
          <TableSortLabel
              active={orderBy === 'observationUnitName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationUnitName')}}
          >
            <Typography color="inherit" variant="caption">
              observationUnitName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationUnitPUI'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationUnitPUI' ? order : false}
        >
          {/* observationUnitPUI */}
          <TableSortLabel
              active={orderBy === 'observationUnitPUI'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationUnitPUI')}}
          >
            <Typography color="inherit" variant="caption">
              observationUnitPUI
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='plantNumber'
          align='left'
          padding="default"
          sortDirection={orderBy === 'plantNumber' ? order : false}
        >
          {/* plantNumber */}
          <TableSortLabel
              active={orderBy === 'plantNumber'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'plantNumber')}}
          >
            <Typography color="inherit" variant="caption">
              plantNumber
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='plotNumber'
          align='left'
          padding="default"
          sortDirection={orderBy === 'plotNumber' ? order : false}
        >
          {/* plotNumber */}
          <TableSortLabel
              active={orderBy === 'plotNumber'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'plotNumber')}}
          >
            <Typography color="inherit" variant="caption">
              plotNumber
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='programDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'programDbId' ? order : false}
        >
          {/* programDbId */}
          <TableSortLabel
              active={orderBy === 'programDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'programDbId')}}
          >
            <Typography color="inherit" variant="caption">
              programDbId
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
          key='trialDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'trialDbId' ? order : false}
        >
          {/* trialDbId */}
          <TableSortLabel
              active={orderBy === 'trialDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'trialDbId')}}
          >
            <Typography color="inherit" variant="caption">
              trialDbId
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

      </TableRow>
    </TableHead>
  );
}
ObservationUnitEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};