import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function BreedingMethodEnhancedTableHead(props) {
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
          (permissions&&permissions.breedingMethod&&Array.isArray(permissions.breedingMethod)
          &&(permissions.breedingMethod.includes('update') || permissions.breedingMethod.includes('delete') || permissions.breedingMethod.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.breedingMethod.includes('update') || permissions.breedingMethod.includes('*')) ? 1 : 0) 
                +
                ((permissions.breedingMethod.includes('delete') || permissions.breedingMethod.includes('*')) ? 1 : 0)
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
          key='breedingMethodDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'breedingMethodDbId' ? order : false}
        >
          {/* breedingMethodDbId */}
          <TableSortLabel
              active={orderBy === 'breedingMethodDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'breedingMethodDbId')}}
          >
            <Typography color="inherit" variant="caption">
              breedingMethodDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='breedingMethodName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'breedingMethodName' ? order : false}
        >
          {/* breedingMethodName */}
          <TableSortLabel
              active={orderBy === 'breedingMethodName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'breedingMethodName')}}
          >
            <Typography color="inherit" variant="caption">
              breedingMethodName
            </Typography>
          </TableSortLabel>
        </TableCell>

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

      </TableRow>
    </TableHead>
  );
}
BreedingMethodEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};