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

export default function AssayEnhancedTableHead(props) {
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
          (permissions&&permissions.assay&&Array.isArray(permissions.assay)
          &&(permissions.assay.includes('update') || permissions.assay.includes('delete') || permissions.assay.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.assay.includes('update') || permissions.assay.includes('*')) ? 1 : 0) 
                +
                ((permissions.assay.includes('delete') || permissions.assay.includes('*')) ? 1 : 0)
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

        {/* assay_id*/}
        <TableCell
          key='assay_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'assay_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'assay_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'assay_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                assay_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='measurement'
          align='left'
          padding="default"
          sortDirection={orderBy === 'measurement' ? order : false}
        >
          {/* measurement */}
          <TableSortLabel
              active={orderBy === 'measurement'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'measurement')}}
          >
            <Typography color="inherit" variant="caption">
              measurement
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='technology'
          align='left'
          padding="default"
          sortDirection={orderBy === 'technology' ? order : false}
        >
          {/* technology */}
          <TableSortLabel
              active={orderBy === 'technology'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'technology')}}
          >
            <Typography color="inherit" variant="caption">
              technology
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='platform'
          align='left'
          padding="default"
          sortDirection={orderBy === 'platform' ? order : false}
        >
          {/* platform */}
          <TableSortLabel
              active={orderBy === 'platform'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'platform')}}
          >
            <Typography color="inherit" variant="caption">
              platform
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='method'
          align='left'
          padding="default"
          sortDirection={orderBy === 'method' ? order : false}
        >
          {/* method */}
          <TableSortLabel
              active={orderBy === 'method'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'method')}}
          >
            <Typography color="inherit" variant="caption">
              method
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='study_id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'study_id' ? order : false}
        >
          {/* study_id */}
          <TableSortLabel
              active={orderBy === 'study_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'study_id')}}
          >
            <Typography color="inherit" variant="caption">
              study_id
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
AssayEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};