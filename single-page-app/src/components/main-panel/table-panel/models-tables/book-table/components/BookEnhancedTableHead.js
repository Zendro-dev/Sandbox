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

export default function BookEnhancedTableHead(props) {
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
          (permissions&&permissions.book&&Array.isArray(permissions.book)
          &&(permissions.book.includes('update') || permissions.book.includes('delete') || permissions.book.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.book.includes('update') || permissions.book.includes('*')) ? 1 : 0) 
                +
                ((permissions.book.includes('delete') || permissions.book.includes('*')) ? 1 : 0)
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

        {/* book_id*/}
        <TableCell
          key='book_id'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'book_id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'book_id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'book_id') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                book_id              </Typography>
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
          key='fk_books_authors'
          align='left'
          padding="default"
          sortDirection={orderBy === 'fk_books_authors' ? order : false}
        >
          {/* fk_books_authors */}
          <TableSortLabel
              active={orderBy === 'fk_books_authors'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fk_books_authors')}}
          >
            <Typography color="inherit" variant="caption">
              fk_books_authors
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
BookEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};