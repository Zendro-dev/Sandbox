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

export default function StudyEnhancedTableHead(props) {
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
          (permissions&&permissions.study&&Array.isArray(permissions.study)
          &&(permissions.study.includes('update') || permissions.study.includes('delete') || permissions.study.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.study.includes('update') || permissions.study.includes('*')) ? 1 : 0) 
                +
                ((permissions.study.includes('delete') || permissions.study.includes('*')) ? 1 : 0)
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

        {/* studyDbId*/}
        <TableCell
          key='studyDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'studyDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'studyDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'studyDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                studyDbId              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='active'
          align='left'
          padding="default"
          sortDirection={orderBy === 'active' ? order : false}
        >
          {/* active */}
          <TableSortLabel
              active={orderBy === 'active'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'active')}}
          >
            <Typography color="inherit" variant="caption">
              active
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='commonCropName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'commonCropName' ? order : false}
        >
          {/* commonCropName */}
          <TableSortLabel
              active={orderBy === 'commonCropName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'commonCropName')}}
          >
            <Typography color="inherit" variant="caption">
              commonCropName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='culturalPractices'
          align='left'
          padding="default"
          sortDirection={orderBy === 'culturalPractices' ? order : false}
        >
          {/* culturalPractices */}
          <TableSortLabel
              active={orderBy === 'culturalPractices'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'culturalPractices')}}
          >
            <Typography color="inherit" variant="caption">
              culturalPractices
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
          key='endDate'
          align='left'
          padding="default"
          sortDirection={orderBy === 'endDate' ? order : false}
        >
          {/* endDate */}
          <TableSortLabel
              active={orderBy === 'endDate'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'endDate')}}
          >
            <Typography color="inherit" variant="caption">
              endDate
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='license'
          align='left'
          padding="default"
          sortDirection={orderBy === 'license' ? order : false}
        >
          {/* license */}
          <TableSortLabel
              active={orderBy === 'license'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'license')}}
          >
            <Typography color="inherit" variant="caption">
              license
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationUnitsDescription'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationUnitsDescription' ? order : false}
        >
          {/* observationUnitsDescription */}
          <TableSortLabel
              active={orderBy === 'observationUnitsDescription'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationUnitsDescription')}}
          >
            <Typography color="inherit" variant="caption">
              observationUnitsDescription
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='startDate'
          align='left'
          padding="default"
          sortDirection={orderBy === 'startDate' ? order : false}
        >
          {/* startDate */}
          <TableSortLabel
              active={orderBy === 'startDate'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'startDate')}}
          >
            <Typography color="inherit" variant="caption">
              startDate
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='studyDescription'
          align='left'
          padding="default"
          sortDirection={orderBy === 'studyDescription' ? order : false}
        >
          {/* studyDescription */}
          <TableSortLabel
              active={orderBy === 'studyDescription'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'studyDescription')}}
          >
            <Typography color="inherit" variant="caption">
              studyDescription
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='studyName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'studyName' ? order : false}
        >
          {/* studyName */}
          <TableSortLabel
              active={orderBy === 'studyName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'studyName')}}
          >
            <Typography color="inherit" variant="caption">
              studyName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='studyType'
          align='left'
          padding="default"
          sortDirection={orderBy === 'studyType' ? order : false}
        >
          {/* studyType */}
          <TableSortLabel
              active={orderBy === 'studyType'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'studyType')}}
          >
            <Typography color="inherit" variant="caption">
              studyType
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='trialDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'trialDbId' ? order : false}
        >
          {/* trialDbId */}
          <TableSortLabel
              active={orderBy === 'trialDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'trialDbId')}}
          >
            <Typography color="inherit" variant="caption">
              trialDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='locationDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'locationDbId' ? order : false}
        >
          {/* locationDbId */}
          <TableSortLabel
              active={orderBy === 'locationDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'locationDbId')}}
          >
            <Typography color="inherit" variant="caption">
              locationDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='contactDbIds'
          align='left'
          padding="default"
          sortDirection={orderBy === 'contactDbIds' ? order : false}
        >
          {/* contactDbIds */}
          <TableSortLabel
              active={orderBy === 'contactDbIds'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'contactDbIds')}}
          >
            <Typography color="inherit" variant="caption">
              contactDbIds
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='seasonDbIds'
          align='left'
          padding="default"
          sortDirection={orderBy === 'seasonDbIds' ? order : false}
        >
          {/* seasonDbIds */}
          <TableSortLabel
              active={orderBy === 'seasonDbIds'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'seasonDbIds')}}
          >
            <Typography color="inherit" variant="caption">
              seasonDbIds
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
StudyEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};