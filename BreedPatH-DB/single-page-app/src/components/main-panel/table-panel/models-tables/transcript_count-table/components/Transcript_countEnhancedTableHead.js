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

export default function TranscriptCountEnhancedTableHead(props) {
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
          (permissions&&permissions.transcript_count&&Array.isArray(permissions.transcript_count)
          &&(permissions.transcript_count.includes('update') || permissions.transcript_count.includes('delete') || permissions.transcript_count.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.transcript_count.includes('update') || permissions.transcript_count.includes('*')) ? 1 : 0) 
                +
                ((permissions.transcript_count.includes('delete') || permissions.transcript_count.includes('*')) ? 1 : 0)
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
          key='gene'
          align='left'
          padding="default"
          sortDirection={orderBy === 'gene' ? order : false}
        >
          {/* gene */}
          <TableSortLabel
              active={orderBy === 'gene'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'gene')}}
          >
            <Typography color="inherit" variant="caption">
              gene
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='value'
          align='right'
          padding="default"
          sortDirection={orderBy === 'value' ? order : false}
        >
          {/* value */}
          <TableSortLabel
              active={orderBy === 'value'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'value')}}
          >
            <Typography color="inherit" variant="caption">
              value
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
          key='reference_genome'
          align='left'
          padding="default"
          sortDirection={orderBy === 'reference_genome' ? order : false}
        >
          {/* reference_genome */}
          <TableSortLabel
              active={orderBy === 'reference_genome'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'reference_genome')}}
          >
            <Typography color="inherit" variant="caption">
              reference_genome
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='sample_id'
          align='right'
          padding="default"
          sortDirection={orderBy === 'sample_id' ? order : false}
        >
          {/* sample_id */}
          <TableSortLabel
              active={orderBy === 'sample_id'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'sample_id')}}
          >
            <Typography color="inherit" variant="caption">
              sample_id
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
TranscriptCountEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};