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

export default function OntologyAnnotationEnhancedTableHead(props) {
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
          (permissions&&permissions.ontologyAnnotation&&Array.isArray(permissions.ontologyAnnotation)
          &&(permissions.ontologyAnnotation.includes('update') || permissions.ontologyAnnotation.includes('delete') || permissions.ontologyAnnotation.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.ontologyAnnotation.includes('update') || permissions.ontologyAnnotation.includes('*')) ? 1 : 0) 
                +
                ((permissions.ontologyAnnotation.includes('delete') || permissions.ontologyAnnotation.includes('*')) ? 1 : 0)
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

        {/* ontologyAnnotation_id*/}
        <TableCell
          key='ontologyAnnotation_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'ontologyAnnotation_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'ontologyAnnotation_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'ontologyAnnotation_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                ontologyAnnotation_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='ontology'
          align='left'
          padding="default"
          sortDirection={orderBy === 'ontology' ? order : false}
        >
          {/* ontology */}
          <TableSortLabel
              active={orderBy === 'ontology'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'ontology')}}
          >
            <Typography color="inherit" variant="caption">
              ontology
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='ontologyURL'
          align='left'
          padding="default"
          sortDirection={orderBy === 'ontologyURL' ? order : false}
        >
          {/* ontologyURL */}
          <TableSortLabel
              active={orderBy === 'ontologyURL'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'ontologyURL')}}
          >
            <Typography color="inherit" variant="caption">
              ontologyURL
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='term'
          align='left'
          padding="default"
          sortDirection={orderBy === 'term' ? order : false}
        >
          {/* term */}
          <TableSortLabel
              active={orderBy === 'term'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'term')}}
          >
            <Typography color="inherit" variant="caption">
              term
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='termURL'
          align='left'
          padding="default"
          sortDirection={orderBy === 'termURL' ? order : false}
        >
          {/* termURL */}
          <TableSortLabel
              active={orderBy === 'termURL'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'termURL')}}
          >
            <Typography color="inherit" variant="caption">
              termURL
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
          key='assayResult_ids'
          align='left'
          padding="default"
          sortDirection={orderBy === 'assayResult_ids' ? order : false}
        >
          {/* assayResult_ids */}
          <TableSortLabel
              active={orderBy === 'assayResult_ids'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'assayResult_ids')}}
          >
            <Typography color="inherit" variant="caption">
              assayResult_ids
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

      </TableRow>
    </TableHead>
  );
}
OntologyAnnotationEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};