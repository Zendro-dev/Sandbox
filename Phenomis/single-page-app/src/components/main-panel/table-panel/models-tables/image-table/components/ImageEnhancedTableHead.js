import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function ImageEnhancedTableHead(props) {
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
          (permissions&&permissions.image&&Array.isArray(permissions.image)
          &&(permissions.image.includes('update') || permissions.image.includes('delete') || permissions.image.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.image.includes('update') || permissions.image.includes('*')) ? 1 : 0) 
                +
                ((permissions.image.includes('delete') || permissions.image.includes('*')) ? 1 : 0)
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


        <TableCell
          key='copyright'
          align='left'
          padding="default"
          sortDirection={orderBy === 'copyright' ? order : false}
        >
          {/* copyright */}
          <TableSortLabel
              active={orderBy === 'copyright'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'copyright')}}
          >
            <Typography color="inherit" variant="caption">
              copyright
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
          key='imageFileName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'imageFileName' ? order : false}
        >
          {/* imageFileName */}
          <TableSortLabel
              active={orderBy === 'imageFileName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'imageFileName')}}
          >
            <Typography color="inherit" variant="caption">
              imageFileName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='imageFileSize'
          align='right'
          padding="default"
          sortDirection={orderBy === 'imageFileSize' ? order : false}
        >
          {/* imageFileSize */}
          <TableSortLabel
              active={orderBy === 'imageFileSize'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'imageFileSize')}}
          >
            <Typography color="inherit" variant="caption">
              imageFileSize
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='imageHeight'
          align='right'
          padding="default"
          sortDirection={orderBy === 'imageHeight' ? order : false}
        >
          {/* imageHeight */}
          <TableSortLabel
              active={orderBy === 'imageHeight'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'imageHeight')}}
          >
            <Typography color="inherit" variant="caption">
              imageHeight
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='imageName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'imageName' ? order : false}
        >
          {/* imageName */}
          <TableSortLabel
              active={orderBy === 'imageName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'imageName')}}
          >
            <Typography color="inherit" variant="caption">
              imageName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='imageTimeStamp'
          align='left'
          padding="default"
          sortDirection={orderBy === 'imageTimeStamp' ? order : false}
        >
          {/* imageTimeStamp */}
          <TableSortLabel
              active={orderBy === 'imageTimeStamp'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'imageTimeStamp')}}
          >
            <Typography color="inherit" variant="caption">
              imageTimeStamp
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='imageURL'
          align='left'
          padding="default"
          sortDirection={orderBy === 'imageURL' ? order : false}
        >
          {/* imageURL */}
          <TableSortLabel
              active={orderBy === 'imageURL'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'imageURL')}}
          >
            <Typography color="inherit" variant="caption">
              imageURL
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='imageWidth'
          align='right'
          padding="default"
          sortDirection={orderBy === 'imageWidth' ? order : false}
        >
          {/* imageWidth */}
          <TableSortLabel
              active={orderBy === 'imageWidth'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'imageWidth')}}
          >
            <Typography color="inherit" variant="caption">
              imageWidth
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
          key='observationUnitDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'observationUnitDbId' ? order : false}
        >
          {/* observationUnitDbId */}
          <TableSortLabel
              active={orderBy === 'observationUnitDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'observationUnitDbId')}}
          >
            <Typography color="inherit" variant="caption">
              observationUnitDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='imageDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'imageDbId' ? order : false}
        >
          {/* imageDbId */}
          <TableSortLabel
              active={orderBy === 'imageDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'imageDbId')}}
          >
            <Typography color="inherit" variant="caption">
              imageDbId
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
ImageEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};