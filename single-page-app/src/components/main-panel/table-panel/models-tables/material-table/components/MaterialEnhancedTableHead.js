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

export default function MaterialEnhancedTableHead(props) {
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
          (permissions&&permissions.material&&Array.isArray(permissions.material)
          &&(permissions.material.includes('update') || permissions.material.includes('delete') || permissions.material.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.material.includes('update') || permissions.material.includes('*')) ? 1 : 0) 
                +
                ((permissions.material.includes('delete') || permissions.material.includes('*')) ? 1 : 0)
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

        {/* material_id*/}
        <TableCell
          key='material_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'material_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'material_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'material_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                material_id              </Typography>
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
          key='assay_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'assay_ids' ? order : false}
        >
          {/* assay_ids */}
          <TableSortLabel
              active={orderBy === 'assay_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'assay_ids')}}
          >
            <Typography color="inherit" variant="caption">
              assay_ids
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
          key='sourceSet_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'sourceSet_ids' ? order : false}
        >
          {/* sourceSet_ids */}
          <TableSortLabel
              active={orderBy === 'sourceSet_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'sourceSet_ids')}}
          >
            <Typography color="inherit" variant="caption">
              sourceSet_ids
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='element_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'element_ids' ? order : false}
        >
          {/* element_ids */}
          <TableSortLabel
              active={orderBy === 'element_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'element_ids')}}
          >
            <Typography color="inherit" variant="caption">
              element_ids
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
MaterialEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};