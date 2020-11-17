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

export default function ContactEnhancedTableHead(props) {
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
          (permissions&&permissions.contact&&Array.isArray(permissions.contact)
          &&(permissions.contact.includes('update') || permissions.contact.includes('delete') || permissions.contact.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.contact.includes('update') || permissions.contact.includes('*')) ? 1 : 0) 
                +
                ((permissions.contact.includes('delete') || permissions.contact.includes('*')) ? 1 : 0)
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

        {/* contactDbId*/}
        <TableCell
          key='contactDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'contactDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'contactDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'contactDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                contactDbId              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='email'
          align='left'
          padding="default"
          sortDirection={orderBy === 'email' ? order : false}
        >
          {/* email */}
          <TableSortLabel
              active={orderBy === 'email'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'email')}}
          >
            <Typography color="inherit" variant="caption">
              email
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='instituteName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'instituteName' ? order : false}
        >
          {/* instituteName */}
          <TableSortLabel
              active={orderBy === 'instituteName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'instituteName')}}
          >
            <Typography color="inherit" variant="caption">
              instituteName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='name'
          align='left'
          padding="default"
          sortDirection={orderBy === 'name' ? order : false}
        >
          {/* name */}
          <TableSortLabel
              active={orderBy === 'name'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'name')}}
          >
            <Typography color="inherit" variant="caption">
              name
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='orcid'
          align='left'
          padding="default"
          sortDirection={orderBy === 'orcid' ? order : false}
        >
          {/* orcid */}
          <TableSortLabel
              active={orderBy === 'orcid'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'orcid')}}
          >
            <Typography color="inherit" variant="caption">
              orcid
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='type'
          align='left'
          padding="default"
          sortDirection={orderBy === 'type' ? order : false}
        >
          {/* type */}
          <TableSortLabel
              active={orderBy === 'type'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'type')}}
          >
            <Typography color="inherit" variant="caption">
              type
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='studyDbIds'
          align='left'
          padding="default"
          sortDirection={orderBy === 'studyDbIds' ? order : false}
        >
          {/* studyDbIds */}
          <TableSortLabel
              active={orderBy === 'studyDbIds'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'studyDbIds')}}
          >
            <Typography color="inherit" variant="caption">
              studyDbIds
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='trialDbIds'
          align='left'
          padding="default"
          sortDirection={orderBy === 'trialDbIds' ? order : false}
        >
          {/* trialDbIds */}
          <TableSortLabel
              active={orderBy === 'trialDbIds'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'trialDbIds')}}
          >
            <Typography color="inherit" variant="caption">
              trialDbIds
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
ContactEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};