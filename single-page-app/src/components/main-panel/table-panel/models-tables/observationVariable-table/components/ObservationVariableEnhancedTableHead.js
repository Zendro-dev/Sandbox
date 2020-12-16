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

export default function ObservationVariableEnhancedTableHead(props) {
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
          (permissions&&permissions.observationVariable&&Array.isArray(permissions.observationVariable)
          &&(permissions.observationVariable.includes('update') || permissions.observationVariable.includes('delete') || permissions.observationVariable.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.observationVariable.includes('update') || permissions.observationVariable.includes('*')) ? 1 : 0) 
                +
                ((permissions.observationVariable.includes('delete') || permissions.observationVariable.includes('*')) ? 1 : 0)
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

        {/* observationVariableDbId*/}
        <TableCell
          key='observationVariableDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'observationVariableDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'observationVariableDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'observationVariableDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                observationVariableDbId              </Typography>
            </Grid>
          </Grid>
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
          key='defaultValue'
          align='left'
          padding="default"
          sortDirection={orderBy === 'defaultValue' ? order : false}
        >
          {/* defaultValue */}
          <TableSortLabel
              active={orderBy === 'defaultValue'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'defaultValue')}}
          >
            <Typography color="inherit" variant="caption">
              defaultValue
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
          key='growthStage'
          align='left'
          padding="default"
          sortDirection={orderBy === 'growthStage' ? order : false}
        >
          {/* growthStage */}
          <TableSortLabel
              active={orderBy === 'growthStage'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'growthStage')}}
          >
            <Typography color="inherit" variant="caption">
              growthStage
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='institution'
          align='left'
          padding="default"
          sortDirection={orderBy === 'institution' ? order : false}
        >
          {/* institution */}
          <TableSortLabel
              active={orderBy === 'institution'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'institution')}}
          >
            <Typography color="inherit" variant="caption">
              institution
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='language'
          align='left'
          padding="default"
          sortDirection={orderBy === 'language' ? order : false}
        >
          {/* language */}
          <TableSortLabel
              active={orderBy === 'language'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'language')}}
          >
            <Typography color="inherit" variant="caption">
              language
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='scientist'
          align='left'
          padding="default"
          sortDirection={orderBy === 'scientist' ? order : false}
        >
          {/* scientist */}
          <TableSortLabel
              active={orderBy === 'scientist'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'scientist')}}
          >
            <Typography color="inherit" variant="caption">
              scientist
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='status'
          align='left'
          padding="default"
          sortDirection={orderBy === 'status' ? order : false}
        >
          {/* status */}
          <TableSortLabel
              active={orderBy === 'status'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'status')}}
          >
            <Typography color="inherit" variant="caption">
              status
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='submissionTimestamp'
          align='left'
          padding="default"
          sortDirection={orderBy === 'submissionTimestamp' ? order : false}
        >
          {/* submissionTimestamp */}
          <TableSortLabel
              active={orderBy === 'submissionTimestamp'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'submissionTimestamp')}}
          >
            <Typography color="inherit" variant="caption">
              submissionTimestamp
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='xref'
          align='left'
          padding="default"
          sortDirection={orderBy === 'xref' ? order : false}
        >
          {/* xref */}
          <TableSortLabel
              active={orderBy === 'xref'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'xref')}}
          >
            <Typography color="inherit" variant="caption">
              xref
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='observationVariableName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationVariableName' ? order : false}
        >
          {/* observationVariableName */}
          <TableSortLabel
              active={orderBy === 'observationVariableName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationVariableName')}}
          >
            <Typography color="inherit" variant="caption">
              observationVariableName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='methodDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'methodDbId' ? order : false}
        >
          {/* methodDbId */}
          <TableSortLabel
              active={orderBy === 'methodDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'methodDbId')}}
          >
            <Typography color="inherit" variant="caption">
              methodDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='scaleDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'scaleDbId' ? order : false}
        >
          {/* scaleDbId */}
          <TableSortLabel
              active={orderBy === 'scaleDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'scaleDbId')}}
          >
            <Typography color="inherit" variant="caption">
              scaleDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='traitDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'traitDbId' ? order : false}
        >
          {/* traitDbId */}
          <TableSortLabel
              active={orderBy === 'traitDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'traitDbId')}}
          >
            <Typography color="inherit" variant="caption">
              traitDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='ontologyDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'ontologyDbId' ? order : false}
        >
          {/* ontologyDbId */}
          <TableSortLabel
              active={orderBy === 'ontologyDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'ontologyDbId')}}
          >
            <Typography color="inherit" variant="caption">
              ontologyDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
ObservationVariableEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};