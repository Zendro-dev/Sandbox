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

export default function NucAcidLibraryResultEnhancedTableHead(props) {
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
          (permissions&&permissions.nuc_acid_library_result&&Array.isArray(permissions.nuc_acid_library_result)
          &&(permissions.nuc_acid_library_result.includes('update') || permissions.nuc_acid_library_result.includes('delete') || permissions.nuc_acid_library_result.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.nuc_acid_library_result.includes('update') || permissions.nuc_acid_library_result.includes('*')) ? 1 : 0) 
                +
                ((permissions.nuc_acid_library_result.includes('delete') || permissions.nuc_acid_library_result.includes('*')) ? 1 : 0)
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
          key='file_name'
          align='left'
          padding="default"
          sortDirection={orderBy === 'file_name' ? order : false}
        >
          {/* file_name */}
          <TableSortLabel
              active={orderBy === 'file_name'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'file_name')}}
          >
            <Typography color="inherit" variant="caption">
              file_name
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='file_uri'
          align='left'
          padding="default"
          sortDirection={orderBy === 'file_uri' ? order : false}
        >
          {/* file_uri */}
          <TableSortLabel
              active={orderBy === 'file_uri'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'file_uri')}}
          >
            <Typography color="inherit" variant="caption">
              file_uri
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
          key='technical_replicate'
          align='right'
          padding="default"
          sortDirection={orderBy === 'technical_replicate' ? order : false}
        >
          {/* technical_replicate */}
          <TableSortLabel
              active={orderBy === 'technical_replicate'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'technical_replicate')}}
          >
            <Typography color="inherit" variant="caption">
              technical_replicate
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='trimmed'
          align='left'
          padding="default"
          sortDirection={orderBy === 'trimmed' ? order : false}
        >
          {/* trimmed */}
          <TableSortLabel
              active={orderBy === 'trimmed'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'trimmed')}}
          >
            <Typography color="inherit" variant="caption">
              trimmed
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
NucAcidLibraryResultEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};