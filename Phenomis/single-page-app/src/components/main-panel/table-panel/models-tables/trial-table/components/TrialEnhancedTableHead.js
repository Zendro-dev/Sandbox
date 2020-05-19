import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function TrialEnhancedTableHead(props) {
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
          (permissions&&permissions.trial&&Array.isArray(permissions.trial)
          &&(permissions.trial.includes('update') || permissions.trial.includes('delete') || permissions.trial.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.trial.includes('update') || permissions.trial.includes('*')) ? 1 : 0) 
                +
                ((permissions.trial.includes('delete') || permissions.trial.includes('*')) ? 1 : 0)
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
          key='active'
          align='left'
          padding="default"
          sortDirection={orderBy === 'active' ? order : false}
        >
          {/* active */}
          <TableSortLabel
              active={orderBy === 'active'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'active')}}
          >
            <Typography color="inherit" variant="caption">
              active
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
          key='endDate'
          align='left'
          padding="default"
          sortDirection={orderBy === 'endDate' ? order : false}
        >
          {/* endDate */}
          <TableSortLabel
              active={orderBy === 'endDate'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'endDate')}}
          >
            <Typography color="inherit" variant="caption">
              endDate
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
          key='startDate'
          align='left'
          padding="default"
          sortDirection={orderBy === 'startDate' ? order : false}
        >
          {/* startDate */}
          <TableSortLabel
              active={orderBy === 'startDate'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'startDate')}}
          >
            <Typography color="inherit" variant="caption">
              startDate
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='trialDescription'
          align='left'
          padding="default"
          sortDirection={orderBy === 'trialDescription' ? order : false}
        >
          {/* trialDescription */}
          <TableSortLabel
              active={orderBy === 'trialDescription'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'trialDescription')}}
          >
            <Typography color="inherit" variant="caption">
              trialDescription
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='trialName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'trialName' ? order : false}
        >
          {/* trialName */}
          <TableSortLabel
              active={orderBy === 'trialName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'trialName')}}
          >
            <Typography color="inherit" variant="caption">
              trialName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='trialPUI'
          align='left'
          padding="default"
          sortDirection={orderBy === 'trialPUI' ? order : false}
        >
          {/* trialPUI */}
          <TableSortLabel
              active={orderBy === 'trialPUI'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'trialPUI')}}
          >
            <Typography color="inherit" variant="caption">
              trialPUI
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

      </TableRow>
    </TableHead>
  );
}
TrialEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};