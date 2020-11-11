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

        {/* contact_id*/}
        <TableCell
          key='contact_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'contact_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'contact_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'contact_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                contact_id              </Typography>
            </Grid>
          </Grid>
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
          key='phone'
          align='left'
          padding="default"
          sortDirection={orderBy === 'phone' ? order : false}
        >
          {/* phone */}
          <TableSortLabel
              active={orderBy === 'phone'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'phone')}}
          >
            <Typography color="inherit" variant="caption">
              phone
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='address'
          align='left'
          padding="default"
          sortDirection={orderBy === 'address' ? order : false}
        >
          {/* address */}
          <TableSortLabel
              active={orderBy === 'address'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'address')}}
          >
            <Typography color="inherit" variant="caption">
              address
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='affiliation'
          align='left'
          padding="default"
          sortDirection={orderBy === 'affiliation' ? order : false}
        >
          {/* affiliation */}
          <TableSortLabel
              active={orderBy === 'affiliation'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'affiliation')}}
          >
            <Typography color="inherit" variant="caption">
              affiliation
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='study_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'study_ids' ? order : false}
        >
          {/* study_ids */}
          <TableSortLabel
              active={orderBy === 'study_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'study_ids')}}
          >
            <Typography color="inherit" variant="caption">
              study_ids
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='investigation_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'investigation_ids' ? order : false}
        >
          {/* investigation_ids */}
          <TableSortLabel
              active={orderBy === 'investigation_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'investigation_ids')}}
          >
            <Typography color="inherit" variant="caption">
              investigation_ids
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

      </TableRow>
    </TableHead>
  );
}
ContactEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};