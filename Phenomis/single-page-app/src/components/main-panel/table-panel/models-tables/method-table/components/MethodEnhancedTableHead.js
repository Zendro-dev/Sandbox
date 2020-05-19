import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function MethodEnhancedTableHead(props) {
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
          (permissions&&permissions.method&&Array.isArray(permissions.method)
          &&(permissions.method.includes('update') || permissions.method.includes('delete') || permissions.method.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.method.includes('update') || permissions.method.includes('*')) ? 1 : 0) 
                +
                ((permissions.method.includes('delete') || permissions.method.includes('*')) ? 1 : 0)
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
          key='formula'
          align='left'
          padding="default"
          sortDirection={orderBy === 'formula' ? order : false}
        >
          {/* formula */}
          <TableSortLabel
              active={orderBy === 'formula'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'formula')}}
          >
            <Typography color="inherit" variant="caption">
              formula
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='methodClass'
          align='left'
          padding="default"
          sortDirection={orderBy === 'methodClass' ? order : false}
        >
          {/* methodClass */}
          <TableSortLabel
              active={orderBy === 'methodClass'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'methodClass')}}
          >
            <Typography color="inherit" variant="caption">
              methodClass
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='methodName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'methodName' ? order : false}
        >
          {/* methodName */}
          <TableSortLabel
              active={orderBy === 'methodName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'methodName')}}
          >
            <Typography color="inherit" variant="caption">
              methodName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='reference'
          align='left'
          padding="default"
          sortDirection={orderBy === 'reference' ? order : false}
        >
          {/* reference */}
          <TableSortLabel
              active={orderBy === 'reference'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'reference')}}
          >
            <Typography color="inherit" variant="caption">
              reference
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='methodDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'methodDbId' ? order : false}
        >
          {/* methodDbId */}
          <TableSortLabel
              active={orderBy === 'methodDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'methodDbId')}}
          >
            <Typography color="inherit" variant="caption">
              methodDbId
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
MethodEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};