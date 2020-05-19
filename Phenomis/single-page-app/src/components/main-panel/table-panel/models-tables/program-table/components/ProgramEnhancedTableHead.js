import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function ProgramEnhancedTableHead(props) {
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
          (permissions&&permissions.program&&Array.isArray(permissions.program)
          &&(permissions.program.includes('update') || permissions.program.includes('delete') || permissions.program.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.program.includes('update') || permissions.program.includes('*')) ? 1 : 0) 
                +
                ((permissions.program.includes('delete') || permissions.program.includes('*')) ? 1 : 0)
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
          key='abbreviation'
          align='left'
          padding="default"
          sortDirection={orderBy === 'abbreviation' ? order : false}
        >
          {/* abbreviation */}
          <TableSortLabel
              active={orderBy === 'abbreviation'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'abbreviation')}}
          >
            <Typography color="inherit" variant="caption">
              abbreviation
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='commonCropName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'commonCropName' ? order : false}
        >
          {/* commonCropName */}
          <TableSortLabel
              active={orderBy === 'commonCropName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'commonCropName')}}
          >
            <Typography color="inherit" variant="caption">
              commonCropName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='documentationURL'
          align='left'
          padding="default"
          sortDirection={orderBy === 'documentationURL' ? order : false}
        >
          {/* documentationURL */}
          <TableSortLabel
              active={orderBy === 'documentationURL'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'documentationURL')}}
          >
            <Typography color="inherit" variant="caption">
              documentationURL
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='leadPersonDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'leadPersonDbId' ? order : false}
        >
          {/* leadPersonDbId */}
          <TableSortLabel
              active={orderBy === 'leadPersonDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'leadPersonDbId')}}
          >
            <Typography color="inherit" variant="caption">
              leadPersonDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='leadPersonName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'leadPersonName' ? order : false}
        >
          {/* leadPersonName */}
          <TableSortLabel
              active={orderBy === 'leadPersonName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'leadPersonName')}}
          >
            <Typography color="inherit" variant="caption">
              leadPersonName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='objective'
          align='left'
          padding="default"
          sortDirection={orderBy === 'objective' ? order : false}
        >
          {/* objective */}
          <TableSortLabel
              active={orderBy === 'objective'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'objective')}}
          >
            <Typography color="inherit" variant="caption">
              objective
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='programName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'programName' ? order : false}
        >
          {/* programName */}
          <TableSortLabel
              active={orderBy === 'programName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'programName')}}
          >
            <Typography color="inherit" variant="caption">
              programName
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

      </TableRow>
    </TableHead>
  );
}
ProgramEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};