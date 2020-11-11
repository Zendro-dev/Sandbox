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

export default function FileAttachmentEnhancedTableHead(props) {
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
          (permissions&&permissions.fileAttachment&&Array.isArray(permissions.fileAttachment)
          &&(permissions.fileAttachment.includes('update') || permissions.fileAttachment.includes('delete') || permissions.fileAttachment.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.fileAttachment.includes('update') || permissions.fileAttachment.includes('*')) ? 1 : 0) 
                +
                ((permissions.fileAttachment.includes('delete') || permissions.fileAttachment.includes('*')) ? 1 : 0)
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

        {/* fileAttachment_id*/}
        <TableCell
          key='fileAttachment_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'fileAttachment_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'fileAttachment_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'fileAttachment_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                fileAttachment_id              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='fileName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'fileName' ? order : false}
        >
          {/* fileName */}
          <TableSortLabel
              active={orderBy === 'fileName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fileName')}}
          >
            <Typography color="inherit" variant="caption">
              fileName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mimeType'
          align='left'
          padding="default"
          sortDirection={orderBy === 'mimeType' ? order : false}
        >
          {/* mimeType */}
          <TableSortLabel
              active={orderBy === 'mimeType'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mimeType')}}
          >
            <Typography color="inherit" variant="caption">
              mimeType
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='fileSizeKb'
          align='right'
          padding="default"
          sortDirection={orderBy === 'fileSizeKb' ? order : false}
        >
          {/* fileSizeKb */}
          <TableSortLabel
              active={orderBy === 'fileSizeKb'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fileSizeKb')}}
          >
            <Typography color="inherit" variant="caption">
              fileSizeKb
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='fileURL'
          align='left'
          padding="default"
          sortDirection={orderBy === 'fileURL' ? order : false}
        >
          {/* fileURL */}
          <TableSortLabel
              active={orderBy === 'fileURL'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fileURL')}}
          >
            <Typography color="inherit" variant="caption">
              fileURL
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='isImage'
          align='left'
          padding="default"
          sortDirection={orderBy === 'isImage' ? order : false}
        >
          {/* isImage */}
          <TableSortLabel
              active={orderBy === 'isImage'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'isImage')}}
          >
            <Typography color="inherit" variant="caption">
              isImage
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='smallThumbnailURL'
          align='left'
          padding="default"
          sortDirection={orderBy === 'smallThumbnailURL' ? order : false}
        >
          {/* smallThumbnailURL */}
          <TableSortLabel
              active={orderBy === 'smallThumbnailURL'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'smallThumbnailURL')}}
          >
            <Typography color="inherit" variant="caption">
              smallThumbnailURL
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='bigThumbnailURL'
          align='left'
          padding="default"
          sortDirection={orderBy === 'bigThumbnailURL' ? order : false}
        >
          {/* bigThumbnailURL */}
          <TableSortLabel
              active={orderBy === 'bigThumbnailURL'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'bigThumbnailURL')}}
          >
            <Typography color="inherit" variant="caption">
              bigThumbnailURL
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

      </TableRow>
    </TableHead>
  );
}
FileAttachmentEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};