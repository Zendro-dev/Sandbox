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

export default function SampleEnhancedTableHead(props) {
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
          (permissions&&permissions.sample&&Array.isArray(permissions.sample)
          &&(permissions.sample.includes('update') || permissions.sample.includes('delete') || permissions.sample.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.sample.includes('update') || permissions.sample.includes('*')) ? 1 : 0) 
                +
                ((permissions.sample.includes('delete') || permissions.sample.includes('*')) ? 1 : 0)
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

        {/* id*/}
        <TableCell
          key='id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                id              </Typography>
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
          key='sampling_date'
          align='left'
          padding="default"
          sortDirection={orderBy === 'sampling_date' ? order : false}
        >
          {/* sampling_date */}
          <TableSortLabel
              active={orderBy === 'sampling_date'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'sampling_date')}}
          >
            <Typography color="inherit" variant="caption">
              sampling_date
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
          key='biological_replicate_no'
          align='right'
          padding="default"
          sortDirection={orderBy === 'biological_replicate_no' ? order : false}
        >
          {/* biological_replicate_no */}
          <TableSortLabel
              active={orderBy === 'biological_replicate_no'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'biological_replicate_no')}}
          >
            <Typography color="inherit" variant="caption">
              biological_replicate_no
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='lab_code'
          align='left'
          padding="default"
          sortDirection={orderBy === 'lab_code' ? order : false}
        >
          {/* lab_code */}
          <TableSortLabel
              active={orderBy === 'lab_code'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'lab_code')}}
          >
            <Typography color="inherit" variant="caption">
              lab_code
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='treatment'
          align='left'
          padding="default"
          sortDirection={orderBy === 'treatment' ? order : false}
        >
          {/* treatment */}
          <TableSortLabel
              active={orderBy === 'treatment'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'treatment')}}
          >
            <Typography color="inherit" variant="caption">
              treatment
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='tissue'
          align='left'
          padding="default"
          sortDirection={orderBy === 'tissue' ? order : false}
        >
          {/* tissue */}
          <TableSortLabel
              active={orderBy === 'tissue'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'tissue')}}
          >
            <Typography color="inherit" variant="caption">
              tissue
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='individual_id'
          align='right'
          padding="default"
          sortDirection={orderBy === 'individual_id' ? order : false}
        >
          {/* individual_id */}
          <TableSortLabel
              active={orderBy === 'individual_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'individual_id')}}
          >
            <Typography color="inherit" variant="caption">
              individual_id
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='sequencing_experiment_id'
          align='right'
          padding="default"
          sortDirection={orderBy === 'sequencing_experiment_id' ? order : false}
        >
          {/* sequencing_experiment_id */}
          <TableSortLabel
              active={orderBy === 'sequencing_experiment_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'sequencing_experiment_id')}}
          >
            <Typography color="inherit" variant="caption">
              sequencing_experiment_id
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
SampleEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};