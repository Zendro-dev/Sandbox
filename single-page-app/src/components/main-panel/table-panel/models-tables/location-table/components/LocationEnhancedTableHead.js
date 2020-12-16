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

export default function LocationEnhancedTableHead(props) {
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
          (permissions&&permissions.location&&Array.isArray(permissions.location)
          &&(permissions.location.includes('update') || permissions.location.includes('delete') || permissions.location.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.location.includes('update') || permissions.location.includes('*')) ? 1 : 0) 
                +
                ((permissions.location.includes('delete') || permissions.location.includes('*')) ? 1 : 0)
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

        {/* locationDbId*/}
        <TableCell
          key='locationDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'locationDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'locationDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'locationDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                locationDbId              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='abbreviation'
          align='left'
          padding="default"
          sortDirection={orderBy === 'abbreviation' ? order : false}
        >
          {/* abbreviation */}
          <TableSortLabel
              active={orderBy === 'abbreviation'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'abbreviation')}}
          >
            <Typography color="inherit" variant="caption">
              abbreviation
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='coordinateDescription'
          align='left'
          padding="default"
          sortDirection={orderBy === 'coordinateDescription' ? order : false}
        >
          {/* coordinateDescription */}
          <TableSortLabel
              active={orderBy === 'coordinateDescription'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'coordinateDescription')}}
          >
            <Typography color="inherit" variant="caption">
              coordinateDescription
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='countryCode'
          align='left'
          padding="default"
          sortDirection={orderBy === 'countryCode' ? order : false}
        >
          {/* countryCode */}
          <TableSortLabel
              active={orderBy === 'countryCode'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'countryCode')}}
          >
            <Typography color="inherit" variant="caption">
              countryCode
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='countryName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'countryName' ? order : false}
        >
          {/* countryName */}
          <TableSortLabel
              active={orderBy === 'countryName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'countryName')}}
          >
            <Typography color="inherit" variant="caption">
              countryName
            </Typography>
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
          key='environmentType'
          align='left'
          padding="default"
          sortDirection={orderBy === 'environmentType' ? order : false}
        >
          {/* environmentType */}
          <TableSortLabel
              active={orderBy === 'environmentType'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'environmentType')}}
          >
            <Typography color="inherit" variant="caption">
              environmentType
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='exposure'
          align='left'
          padding="default"
          sortDirection={orderBy === 'exposure' ? order : false}
        >
          {/* exposure */}
          <TableSortLabel
              active={orderBy === 'exposure'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'exposure')}}
          >
            <Typography color="inherit" variant="caption">
              exposure
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='instituteAddress'
          align='left'
          padding="default"
          sortDirection={orderBy === 'instituteAddress' ? order : false}
        >
          {/* instituteAddress */}
          <TableSortLabel
              active={orderBy === 'instituteAddress'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'instituteAddress')}}
          >
            <Typography color="inherit" variant="caption">
              instituteAddress
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='instituteName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'instituteName' ? order : false}
        >
          {/* instituteName */}
          <TableSortLabel
              active={orderBy === 'instituteName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'instituteName')}}
          >
            <Typography color="inherit" variant="caption">
              instituteName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='locationName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'locationName' ? order : false}
        >
          {/* locationName */}
          <TableSortLabel
              active={orderBy === 'locationName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'locationName')}}
          >
            <Typography color="inherit" variant="caption">
              locationName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='locationType'
          align='left'
          padding="default"
          sortDirection={orderBy === 'locationType' ? order : false}
        >
          {/* locationType */}
          <TableSortLabel
              active={orderBy === 'locationType'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'locationType')}}
          >
            <Typography color="inherit" variant="caption">
              locationType
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='siteStatus'
          align='left'
          padding="default"
          sortDirection={orderBy === 'siteStatus' ? order : false}
        >
          {/* siteStatus */}
          <TableSortLabel
              active={orderBy === 'siteStatus'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'siteStatus')}}
          >
            <Typography color="inherit" variant="caption">
              siteStatus
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='slope'
          align='left'
          padding="default"
          sortDirection={orderBy === 'slope' ? order : false}
        >
          {/* slope */}
          <TableSortLabel
              active={orderBy === 'slope'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'slope')}}
          >
            <Typography color="inherit" variant="caption">
              slope
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='topography'
          align='left'
          padding="default"
          sortDirection={orderBy === 'topography' ? order : false}
        >
          {/* topography */}
          <TableSortLabel
              active={orderBy === 'topography'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'topography')}}
          >
            <Typography color="inherit" variant="caption">
              topography
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
LocationEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};