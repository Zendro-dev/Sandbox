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

export default function OntologyReferenceEnhancedTableHead(props) {
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
          (permissions&&permissions.ontologyReference&&Array.isArray(permissions.ontologyReference)
          &&(permissions.ontologyReference.includes('update') || permissions.ontologyReference.includes('delete') || permissions.ontologyReference.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.ontologyReference.includes('update') || permissions.ontologyReference.includes('*')) ? 1 : 0) 
                +
                ((permissions.ontologyReference.includes('delete') || permissions.ontologyReference.includes('*')) ? 1 : 0)
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

        {/* ontologyDbId*/}
        <TableCell
          key='ontologyDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'ontologyDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'ontologyDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'ontologyDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                ontologyDbId              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='documentationURL'
          align='left'
          padding="default"
          sortDirection={orderBy === 'documentationURL' ? order : false}
        >
          {/* documentationURL */}
          <TableSortLabel
              active={orderBy === 'documentationURL'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'documentationURL')}}
          >
            <Typography color="inherit" variant="caption">
              documentationURL
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='ontologyName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'ontologyName' ? order : false}
        >
          {/* ontologyName */}
          <TableSortLabel
              active={orderBy === 'ontologyName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'ontologyName')}}
          >
            <Typography color="inherit" variant="caption">
              ontologyName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='version'
          align='left'
          padding="default"
          sortDirection={orderBy === 'version' ? order : false}
        >
          {/* version */}
          <TableSortLabel
              active={orderBy === 'version'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'version')}}
          >
            <Typography color="inherit" variant="caption">
              version
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
OntologyReferenceEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};