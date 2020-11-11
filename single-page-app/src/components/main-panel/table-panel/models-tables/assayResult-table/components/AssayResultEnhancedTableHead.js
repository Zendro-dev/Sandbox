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

export default function AssayResultEnhancedTableHead(props) {
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
          (permissions&&permissions.assayResult&&Array.isArray(permissions.assayResult)
          &&(permissions.assayResult.includes('update') || permissions.assayResult.includes('delete') || permissions.assayResult.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.assayResult.includes('update') || permissions.assayResult.includes('*')) ? 1 : 0) 
                +
                ((permissions.assayResult.includes('delete') || permissions.assayResult.includes('*')) ? 1 : 0)
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

        {/* assayResult_id*/}
        <TableCell
          key='assayResult_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'assayResult_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'assayResult_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'assayResult_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                assayResult_id              </Typography>
            </Grid>
          </Grid>
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
          key='value_as_str'
          align='left'
          padding="default"
          sortDirection={orderBy === 'value_as_str' ? order : false}
        >
          {/* value_as_str */}
          <TableSortLabel
              active={orderBy === 'value_as_str'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'value_as_str')}}
          >
            <Typography color="inherit" variant="caption">
              value_as_str
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='value_as_int'
          align='right'
          padding="default"
          sortDirection={orderBy === 'value_as_int' ? order : false}
        >
          {/* value_as_int */}
          <TableSortLabel
              active={orderBy === 'value_as_int'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'value_as_int')}}
          >
            <Typography color="inherit" variant="caption">
              value_as_int
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='value_as_num'
          align='right'
          padding="default"
          sortDirection={orderBy === 'value_as_num' ? order : false}
        >
          {/* value_as_num */}
          <TableSortLabel
              active={orderBy === 'value_as_num'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'value_as_num')}}
          >
            <Typography color="inherit" variant="caption">
              value_as_num
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='value_as_bool'
          align='left'
          padding="default"
          sortDirection={orderBy === 'value_as_bool' ? order : false}
        >
          {/* value_as_bool */}
          <TableSortLabel
              active={orderBy === 'value_as_bool'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'value_as_bool')}}
          >
            <Typography color="inherit" variant="caption">
              value_as_bool
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='value_as_float'
          align='right'
          padding="default"
          sortDirection={orderBy === 'value_as_float' ? order : false}
        >
          {/* value_as_float */}
          <TableSortLabel
              active={orderBy === 'value_as_float'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'value_as_float')}}
          >
            <Typography color="inherit" variant="caption">
              value_as_float
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='assay_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'assay_id' ? order : false}
        >
          {/* assay_id */}
          <TableSortLabel
              active={orderBy === 'assay_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'assay_id')}}
          >
            <Typography color="inherit" variant="caption">
              assay_id
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='material_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'material_id' ? order : false}
        >
          {/* material_id */}
          <TableSortLabel
              active={orderBy === 'material_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'material_id')}}
          >
            <Typography color="inherit" variant="caption">
              material_id
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
AssayResultEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};