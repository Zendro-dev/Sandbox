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

export default function ObservationTreatmentEnhancedTableHead(props) {
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
          (permissions&&permissions.observationTreatment&&Array.isArray(permissions.observationTreatment)
          &&(permissions.observationTreatment.includes('update') || permissions.observationTreatment.includes('delete') || permissions.observationTreatment.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.observationTreatment.includes('update') || permissions.observationTreatment.includes('*')) ? 1 : 0) 
                +
                ((permissions.observationTreatment.includes('delete') || permissions.observationTreatment.includes('*')) ? 1 : 0)
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

        {/* observationTreatmentDbId*/}
        <TableCell
          key='observationTreatmentDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'observationTreatmentDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'observationTreatmentDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'observationTreatmentDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                observationTreatmentDbId              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='factor'
          align='left'
          padding="default"
          sortDirection={orderBy === 'factor' ? order : false}
        >
          {/* factor */}
          <TableSortLabel
              active={orderBy === 'factor'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'factor')}}
          >
            <Typography color="inherit" variant="caption">
              factor
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='modality'
          align='left'
          padding="default"
          sortDirection={orderBy === 'modality' ? order : false}
        >
          {/* modality */}
          <TableSortLabel
              active={orderBy === 'modality'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'modality')}}
          >
            <Typography color="inherit" variant="caption">
              modality
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationUnitDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationUnitDbId' ? order : false}
        >
          {/* observationUnitDbId */}
          <TableSortLabel
              active={orderBy === 'observationUnitDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationUnitDbId')}}
          >
            <Typography color="inherit" variant="caption">
              observationUnitDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
ObservationTreatmentEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};