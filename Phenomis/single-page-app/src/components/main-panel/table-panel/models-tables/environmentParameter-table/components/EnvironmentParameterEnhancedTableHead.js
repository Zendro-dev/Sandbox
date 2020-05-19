import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function EnvironmentParameterEnhancedTableHead(props) {
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
          (permissions&&permissions.environmentParameter&&Array.isArray(permissions.environmentParameter)
          &&(permissions.environmentParameter.includes('update') || permissions.environmentParameter.includes('delete') || permissions.environmentParameter.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.environmentParameter.includes('update') || permissions.environmentParameter.includes('*')) ? 1 : 0) 
                +
                ((permissions.environmentParameter.includes('delete') || permissions.environmentParameter.includes('*')) ? 1 : 0)
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
          key='description'
          align='left'
          padding="default"
          sortDirection={orderBy === 'description' ? order : false}
        >
          {/* description */}
          <TableSortLabel
              active={orderBy === 'description'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'description')}}
          >
            <Typography color="inherit" variant="caption">
              description
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='parameterName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'parameterName' ? order : false}
        >
          {/* parameterName */}
          <TableSortLabel
              active={orderBy === 'parameterName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'parameterName')}}
          >
            <Typography color="inherit" variant="caption">
              parameterName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='parameterPUI'
          align='left'
          padding="default"
          sortDirection={orderBy === 'parameterPUI' ? order : false}
        >
          {/* parameterPUI */}
          <TableSortLabel
              active={orderBy === 'parameterPUI'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'parameterPUI')}}
          >
            <Typography color="inherit" variant="caption">
              parameterPUI
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='unit'
          align='left'
          padding="default"
          sortDirection={orderBy === 'unit' ? order : false}
        >
          {/* unit */}
          <TableSortLabel
              active={orderBy === 'unit'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'unit')}}
          >
            <Typography color="inherit" variant="caption">
              unit
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='unitPUI'
          align='left'
          padding="default"
          sortDirection={orderBy === 'unitPUI' ? order : false}
        >
          {/* unitPUI */}
          <TableSortLabel
              active={orderBy === 'unitPUI'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'unitPUI')}}
          >
            <Typography color="inherit" variant="caption">
              unitPUI
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
          key='valuePUI'
          align='left'
          padding="default"
          sortDirection={orderBy === 'valuePUI' ? order : false}
        >
          {/* valuePUI */}
          <TableSortLabel
              active={orderBy === 'valuePUI'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'valuePUI')}}
          >
            <Typography color="inherit" variant="caption">
              valuePUI
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
          key='environmentParameterDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'environmentParameterDbId' ? order : false}
        >
          {/* environmentParameterDbId */}
          <TableSortLabel
              active={orderBy === 'environmentParameterDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'environmentParameterDbId')}}
          >
            <Typography color="inherit" variant="caption">
              environmentParameterDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
EnvironmentParameterEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};