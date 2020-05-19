import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function TrialToContactEnhancedTableHead(props) {
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
          (permissions&&permissions.trial_to_contact&&Array.isArray(permissions.trial_to_contact)
          &&(permissions.trial_to_contact.includes('update') || permissions.trial_to_contact.includes('delete') || permissions.trial_to_contact.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.trial_to_contact.includes('update') || permissions.trial_to_contact.includes('*')) ? 1 : 0) 
                +
                ((permissions.trial_to_contact.includes('delete') || permissions.trial_to_contact.includes('*')) ? 1 : 0)
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

        {/* id*/}
        <TableCell
          key='id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'id') }}
          >
            <Typography color="inherit" variant="caption">
              id            </Typography>
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
          key='contactDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'contactDbId' ? order : false}
        >
          {/* contactDbId */}
          <TableSortLabel
              active={orderBy === 'contactDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'contactDbId')}}
          >
            <Typography color="inherit" variant="caption">
              contactDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
TrialToContactEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};