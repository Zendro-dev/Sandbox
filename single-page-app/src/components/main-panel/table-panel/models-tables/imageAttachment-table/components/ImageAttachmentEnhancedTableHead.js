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

export default function ImageAttachmentEnhancedTableHead(props) {
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
          (permissions&&permissions.imageAttachment&&Array.isArray(permissions.imageAttachment)
          &&(permissions.imageAttachment.includes('update') || permissions.imageAttachment.includes('delete') || permissions.imageAttachment.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.imageAttachment.includes('update') || permissions.imageAttachment.includes('*')) ? 1 : 0) 
                +
                ((permissions.imageAttachment.includes('delete') || permissions.imageAttachment.includes('*')) ? 1 : 0)
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


{/* #imgs */}
        {/* thumbnail */}
        <TableCell
          key='thumbnail'
          align='center'
          padding="checkbox"
        >
          <Typography color="inherit" variant="caption">
            { t('modelPanels.image', 'image') }
          </Typography>
        </TableCell>
{/* imgs# */}



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
          key='fileType'
          align='left'
          padding="default"
          sortDirection={orderBy === 'fileType' ? order : false}
        >
          {/* fileType */}
          <TableSortLabel
              active={orderBy === 'fileType'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fileType')}}
          >
            <Typography color="inherit" variant="caption">
              fileType
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='filePath'
          align='left'
          padding="default"
          sortDirection={orderBy === 'filePath' ? order : false}
        >
          {/* filePath */}
          <TableSortLabel
              active={orderBy === 'filePath'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'filePath')}}
          >
            <Typography color="inherit" variant="caption">
              filePath
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='smallTnPath'
          align='left'
          padding="default"
          sortDirection={orderBy === 'smallTnPath' ? order : false}
        >
          {/* smallTnPath */}
          <TableSortLabel
              active={orderBy === 'smallTnPath'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'smallTnPath')}}
          >
            <Typography color="inherit" variant="caption">
              smallTnPath
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mediumTnPath'
          align='left'
          padding="default"
          sortDirection={orderBy === 'mediumTnPath' ? order : false}
        >
          {/* mediumTnPath */}
          <TableSortLabel
              active={orderBy === 'mediumTnPath'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mediumTnPath')}}
          >
            <Typography color="inherit" variant="caption">
              mediumTnPath
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='licence'
          align='left'
          padding="default"
          sortDirection={orderBy === 'licence' ? order : false}
        >
          {/* licence */}
          <TableSortLabel
              active={orderBy === 'licence'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'licence')}}
          >
            <Typography color="inherit" variant="caption">
              licence
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
          key='personId'
          align='right'
          padding="default"
          sortDirection={orderBy === 'personId' ? order : false}
        >
          {/* personId */}
          <TableSortLabel
              active={orderBy === 'personId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'personId')}}
          >
            <Typography color="inherit" variant="caption">
              personId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
ImageAttachmentEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};