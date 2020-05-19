import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function TraitEnhancedTableHead(props) {
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
          (permissions&&permissions.trait&&Array.isArray(permissions.trait)
          &&(permissions.trait.includes('update') || permissions.trait.includes('delete') || permissions.trait.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.trait.includes('update') || permissions.trait.includes('*')) ? 1 : 0) 
                +
                ((permissions.trait.includes('delete') || permissions.trait.includes('*')) ? 1 : 0)
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
          key='attribute'
          align='left'
          padding="default"
          sortDirection={orderBy === 'attribute' ? order : false}
        >
          {/* attribute */}
          <TableSortLabel
              active={orderBy === 'attribute'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'attribute')}}
          >
            <Typography color="inherit" variant="caption">
              attribute
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='entity'
          align='left'
          padding="default"
          sortDirection={orderBy === 'entity' ? order : false}
        >
          {/* entity */}
          <TableSortLabel
              active={orderBy === 'entity'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'entity')}}
          >
            <Typography color="inherit" variant="caption">
              entity
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mainAbbreviation'
          align='left'
          padding="default"
          sortDirection={orderBy === 'mainAbbreviation' ? order : false}
        >
          {/* mainAbbreviation */}
          <TableSortLabel
              active={orderBy === 'mainAbbreviation'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mainAbbreviation')}}
          >
            <Typography color="inherit" variant="caption">
              mainAbbreviation
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='status'
          align='left'
          padding="default"
          sortDirection={orderBy === 'status' ? order : false}
        >
          {/* status */}
          <TableSortLabel
              active={orderBy === 'status'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'status')}}
          >
            <Typography color="inherit" variant="caption">
              status
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='traitClass'
          align='left'
          padding="default"
          sortDirection={orderBy === 'traitClass' ? order : false}
        >
          {/* traitClass */}
          <TableSortLabel
              active={orderBy === 'traitClass'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'traitClass')}}
          >
            <Typography color="inherit" variant="caption">
              traitClass
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='traitDescription'
          align='left'
          padding="default"
          sortDirection={orderBy === 'traitDescription' ? order : false}
        >
          {/* traitDescription */}
          <TableSortLabel
              active={orderBy === 'traitDescription'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'traitDescription')}}
          >
            <Typography color="inherit" variant="caption">
              traitDescription
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='traitName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'traitName' ? order : false}
        >
          {/* traitName */}
          <TableSortLabel
              active={orderBy === 'traitName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'traitName')}}
          >
            <Typography color="inherit" variant="caption">
              traitName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='xref'
          align='left'
          padding="default"
          sortDirection={orderBy === 'xref' ? order : false}
        >
          {/* xref */}
          <TableSortLabel
              active={orderBy === 'xref'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'xref')}}
          >
            <Typography color="inherit" variant="caption">
              xref
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='traitDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'traitDbId' ? order : false}
        >
          {/* traitDbId */}
          <TableSortLabel
              active={orderBy === 'traitDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'traitDbId')}}
          >
            <Typography color="inherit" variant="caption">
              traitDbId
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
TraitEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};