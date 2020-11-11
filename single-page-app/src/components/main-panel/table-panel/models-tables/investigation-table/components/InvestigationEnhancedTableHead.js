import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Key from '@material-ui/icons/VpnKey';

export default function InvestigationEnhancedTableHead(props) {
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
          (permissions&&permissions.investigation&&Array.isArray(permissions.investigation)
          &&(permissions.investigation.includes('update') || permissions.investigation.includes('delete') || permissions.investigation.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.investigation.includes('update') || permissions.investigation.includes('*')) ? 1 : 0) 
                +
                ((permissions.investigation.includes('delete') || permissions.investigation.includes('*')) ? 1 : 0)
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

        {/* investigation_id*/}
        <TableCell
          key='investigation_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'investigation_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'investigation_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'investigation_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                investigation_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='title'
          align='left'
          padding="default"
          sortDirection={orderBy === 'title' ? order : false}
        >
          {/* title */}
          <TableSortLabel
              active={orderBy === 'title'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'title')}}
          >
            <Typography color="inherit" variant="caption">
              title
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
          key='ontologyAnnotation_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'ontologyAnnotation_ids' ? order : false}
        >
          {/* ontologyAnnotation_ids */}
          <TableSortLabel
              active={orderBy === 'ontologyAnnotation_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'ontologyAnnotation_ids')}}
          >
            <Typography color="inherit" variant="caption">
              ontologyAnnotation_ids
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='contact_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'contact_ids' ? order : false}
        >
          {/* contact_ids */}
          <TableSortLabel
              active={orderBy === 'contact_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'contact_ids')}}
          >
            <Typography color="inherit" variant="caption">
              contact_ids
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='fileAttachment_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'fileAttachment_ids' ? order : false}
        >
          {/* fileAttachment_ids */}
          <TableSortLabel
              active={orderBy === 'fileAttachment_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fileAttachment_ids')}}
          >
            <Typography color="inherit" variant="caption">
              fileAttachment_ids
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
InvestigationEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};