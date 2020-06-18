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

export default function SequencingExperimentEnhancedTableHead(props) {
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
          (permissions&&permissions.sequencing_experiment&&Array.isArray(permissions.sequencing_experiment)
          &&(permissions.sequencing_experiment.includes('update') || permissions.sequencing_experiment.includes('delete') || permissions.sequencing_experiment.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.sequencing_experiment.includes('update') || permissions.sequencing_experiment.includes('*')) ? 1 : 0) 
                +
                ((permissions.sequencing_experiment.includes('delete') || permissions.sequencing_experiment.includes('*')) ? 1 : 0)
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
          key='start_date'
          align='left'
          padding="default"
          sortDirection={orderBy === 'start_date' ? order : false}
        >
          {/* start_date */}
          <TableSortLabel
              active={orderBy === 'start_date'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'start_date')}}
          >
            <Typography color="inherit" variant="caption">
              start_date
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='end_date'
          align='left'
          padding="default"
          sortDirection={orderBy === 'end_date' ? order : false}
        >
          {/* end_date */}
          <TableSortLabel
              active={orderBy === 'end_date'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'end_date')}}
          >
            <Typography color="inherit" variant="caption">
              end_date
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='protocol'
          align='left'
          padding="default"
          sortDirection={orderBy === 'protocol' ? order : false}
        >
          {/* protocol */}
          <TableSortLabel
              active={orderBy === 'protocol'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'protocol')}}
          >
            <Typography color="inherit" variant="caption">
              protocol
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
          key='data_type'
          align='left'
          padding="default"
          sortDirection={orderBy === 'data_type' ? order : false}
        >
          {/* data_type */}
          <TableSortLabel
              active={orderBy === 'data_type'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'data_type')}}
          >
            <Typography color="inherit" variant="caption">
              data_type
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='library_type'
          align='left'
          padding="default"
          sortDirection={orderBy === 'library_type' ? order : false}
        >
          {/* library_type */}
          <TableSortLabel
              active={orderBy === 'library_type'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'library_type')}}
          >
            <Typography color="inherit" variant="caption">
              library_type
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='library_preparation'
          align='left'
          padding="default"
          sortDirection={orderBy === 'library_preparation' ? order : false}
        >
          {/* library_preparation */}
          <TableSortLabel
              active={orderBy === 'library_preparation'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'library_preparation')}}
          >
            <Typography color="inherit" variant="caption">
              library_preparation
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='aimed_coverage'
          align='right'
          padding="default"
          sortDirection={orderBy === 'aimed_coverage' ? order : false}
        >
          {/* aimed_coverage */}
          <TableSortLabel
              active={orderBy === 'aimed_coverage'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'aimed_coverage')}}
          >
            <Typography color="inherit" variant="caption">
              aimed_coverage
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='resulting_coverage'
          align='right'
          padding="default"
          sortDirection={orderBy === 'resulting_coverage' ? order : false}
        >
          {/* resulting_coverage */}
          <TableSortLabel
              active={orderBy === 'resulting_coverage'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'resulting_coverage')}}
          >
            <Typography color="inherit" variant="caption">
              resulting_coverage
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='insert_size'
          align='right'
          padding="default"
          sortDirection={orderBy === 'insert_size' ? order : false}
        >
          {/* insert_size */}
          <TableSortLabel
              active={orderBy === 'insert_size'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'insert_size')}}
          >
            <Typography color="inherit" variant="caption">
              insert_size
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='aimed_read_length'
          align='left'
          padding="default"
          sortDirection={orderBy === 'aimed_read_length' ? order : false}
        >
          {/* aimed_read_length */}
          <TableSortLabel
              active={orderBy === 'aimed_read_length'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'aimed_read_length')}}
          >
            <Typography color="inherit" variant="caption">
              aimed_read_length
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='genome_complexity_reduction'
          align='left'
          padding="default"
          sortDirection={orderBy === 'genome_complexity_reduction' ? order : false}
        >
          {/* genome_complexity_reduction */}
          <TableSortLabel
              active={orderBy === 'genome_complexity_reduction'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'genome_complexity_reduction')}}
          >
            <Typography color="inherit" variant="caption">
              genome_complexity_reduction
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='contamination'
          align='left'
          padding="default"
          sortDirection={orderBy === 'contamination' ? order : false}
        >
          {/* contamination */}
          <TableSortLabel
              active={orderBy === 'contamination'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'contamination')}}
          >
            <Typography color="inherit" variant="caption">
              contamination
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
SequencingExperimentEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};