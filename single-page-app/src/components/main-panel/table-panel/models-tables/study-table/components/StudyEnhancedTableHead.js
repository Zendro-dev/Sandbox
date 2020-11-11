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

export default function StudyEnhancedTableHead(props) {
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
          (permissions&&permissions.study&&Array.isArray(permissions.study)
          &&(permissions.study.includes('update') || permissions.study.includes('delete') || permissions.study.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.study.includes('update') || permissions.study.includes('*')) ? 1 : 0) 
                +
                ((permissions.study.includes('delete') || permissions.study.includes('*')) ? 1 : 0)
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

        {/* study_id*/}
        <TableCell
          key='study_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'study_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'study_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'study_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                study_id              </Typography>
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
          key='investigation_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'investigation_id' ? order : false}
        >
          {/* investigation_id */}
          <TableSortLabel
              active={orderBy === 'investigation_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'investigation_id')}}
          >
            <Typography color="inherit" variant="caption">
              investigation_id
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='factor_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'factor_ids' ? order : false}
        >
          {/* factor_ids */}
          <TableSortLabel
              active={orderBy === 'factor_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'factor_ids')}}
          >
            <Typography color="inherit" variant="caption">
              factor_ids
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='protocol_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'protocol_ids' ? order : false}
        >
          {/* protocol_ids */}
          <TableSortLabel
              active={orderBy === 'protocol_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'protocol_ids')}}
          >
            <Typography color="inherit" variant="caption">
              protocol_ids
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
          key='material_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'material_ids' ? order : false}
        >
          {/* material_ids */}
          <TableSortLabel
              active={orderBy === 'material_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'material_ids')}}
          >
            <Typography color="inherit" variant="caption">
              material_ids
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
StudyEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};