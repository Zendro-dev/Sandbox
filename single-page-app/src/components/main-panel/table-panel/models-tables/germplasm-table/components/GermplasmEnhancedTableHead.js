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

export default function GermplasmEnhancedTableHead(props) {
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
          (permissions&&permissions.germplasm&&Array.isArray(permissions.germplasm)
          &&(permissions.germplasm.includes('update') || permissions.germplasm.includes('delete') || permissions.germplasm.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.germplasm.includes('update') || permissions.germplasm.includes('*')) ? 1 : 0) 
                +
                ((permissions.germplasm.includes('delete') || permissions.germplasm.includes('*')) ? 1 : 0)
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

        {/* germplasmDbId*/}
        <TableCell
          key='germplasmDbId'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'germplasmDbId' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'germplasmDbId'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'germplasmDbId') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                germplasmDbId              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='accessionNumber'
          align='left'
          padding="default"
          sortDirection={orderBy === 'accessionNumber' ? order : false}
        >
          {/* accessionNumber */}
          <TableSortLabel
              active={orderBy === 'accessionNumber'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'accessionNumber')}}
          >
            <Typography color="inherit" variant="caption">
              accessionNumber
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='acquisitionDate'
          align='left'
          padding="default"
          sortDirection={orderBy === 'acquisitionDate' ? order : false}
        >
          {/* acquisitionDate */}
          <TableSortLabel
              active={orderBy === 'acquisitionDate'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'acquisitionDate')}}
          >
            <Typography color="inherit" variant="caption">
              acquisitionDate
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='breedingMethodDbId'
          align='left'
          padding="default"
          sortDirection={orderBy === 'breedingMethodDbId' ? order : false}
        >
          {/* breedingMethodDbId */}
          <TableSortLabel
              active={orderBy === 'breedingMethodDbId'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'breedingMethodDbId')}}
          >
            <Typography color="inherit" variant="caption">
              breedingMethodDbId
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
          key='countryOfOriginCode'
          align='left'
          padding="default"
          sortDirection={orderBy === 'countryOfOriginCode' ? order : false}
        >
          {/* countryOfOriginCode */}
          <TableSortLabel
              active={orderBy === 'countryOfOriginCode'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'countryOfOriginCode')}}
          >
            <Typography color="inherit" variant="caption">
              countryOfOriginCode
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='defaultDisplayName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'defaultDisplayName' ? order : false}
        >
          {/* defaultDisplayName */}
          <TableSortLabel
              active={orderBy === 'defaultDisplayName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'defaultDisplayName')}}
          >
            <Typography color="inherit" variant="caption">
              defaultDisplayName
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
          key='germplasmGenus'
          align='left'
          padding="default"
          sortDirection={orderBy === 'germplasmGenus' ? order : false}
        >
          {/* germplasmGenus */}
          <TableSortLabel
              active={orderBy === 'germplasmGenus'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'germplasmGenus')}}
          >
            <Typography color="inherit" variant="caption">
              germplasmGenus
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='germplasmName'
          align='left'
          padding="default"
          sortDirection={orderBy === 'germplasmName' ? order : false}
        >
          {/* germplasmName */}
          <TableSortLabel
              active={orderBy === 'germplasmName'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'germplasmName')}}
          >
            <Typography color="inherit" variant="caption">
              germplasmName
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='germplasmPUI'
          align='left'
          padding="default"
          sortDirection={orderBy === 'germplasmPUI' ? order : false}
        >
          {/* germplasmPUI */}
          <TableSortLabel
              active={orderBy === 'germplasmPUI'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'germplasmPUI')}}
          >
            <Typography color="inherit" variant="caption">
              germplasmPUI
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='germplasmPreprocessing'
          align='left'
          padding="default"
          sortDirection={orderBy === 'germplasmPreprocessing' ? order : false}
        >
          {/* germplasmPreprocessing */}
          <TableSortLabel
              active={orderBy === 'germplasmPreprocessing'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'germplasmPreprocessing')}}
          >
            <Typography color="inherit" variant="caption">
              germplasmPreprocessing
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='germplasmSpecies'
          align='left'
          padding="default"
          sortDirection={orderBy === 'germplasmSpecies' ? order : false}
        >
          {/* germplasmSpecies */}
          <TableSortLabel
              active={orderBy === 'germplasmSpecies'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'germplasmSpecies')}}
          >
            <Typography color="inherit" variant="caption">
              germplasmSpecies
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='germplasmSubtaxa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'germplasmSubtaxa' ? order : false}
        >
          {/* germplasmSubtaxa */}
          <TableSortLabel
              active={orderBy === 'germplasmSubtaxa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'germplasmSubtaxa')}}
          >
            <Typography color="inherit" variant="caption">
              germplasmSubtaxa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='instituteCode'
          align='left'
          padding="default"
          sortDirection={orderBy === 'instituteCode' ? order : false}
        >
          {/* instituteCode */}
          <TableSortLabel
              active={orderBy === 'instituteCode'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'instituteCode')}}
          >
            <Typography color="inherit" variant="caption">
              instituteCode
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
          key='pedigree'
          align='left'
          padding="default"
          sortDirection={orderBy === 'pedigree' ? order : false}
        >
          {/* pedigree */}
          <TableSortLabel
              active={orderBy === 'pedigree'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'pedigree')}}
          >
            <Typography color="inherit" variant="caption">
              pedigree
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='seedSource'
          align='left'
          padding="default"
          sortDirection={orderBy === 'seedSource' ? order : false}
        >
          {/* seedSource */}
          <TableSortLabel
              active={orderBy === 'seedSource'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'seedSource')}}
          >
            <Typography color="inherit" variant="caption">
              seedSource
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='seedSourceDescription'
          align='left'
          padding="default"
          sortDirection={orderBy === 'seedSourceDescription' ? order : false}
        >
          {/* seedSourceDescription */}
          <TableSortLabel
              active={orderBy === 'seedSourceDescription'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'seedSourceDescription')}}
          >
            <Typography color="inherit" variant="caption">
              seedSourceDescription
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='speciesAuthority'
          align='left'
          padding="default"
          sortDirection={orderBy === 'speciesAuthority' ? order : false}
        >
          {/* speciesAuthority */}
          <TableSortLabel
              active={orderBy === 'speciesAuthority'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'speciesAuthority')}}
          >
            <Typography color="inherit" variant="caption">
              speciesAuthority
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='subtaxaAuthority'
          align='left'
          padding="default"
          sortDirection={orderBy === 'subtaxaAuthority' ? order : false}
        >
          {/* subtaxaAuthority */}
          <TableSortLabel
              active={orderBy === 'subtaxaAuthority'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'subtaxaAuthority')}}
          >
            <Typography color="inherit" variant="caption">
              subtaxaAuthority
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
          key='biologicalStatusOfAccessionCode'
          align='left'
          padding="default"
          sortDirection={orderBy === 'biologicalStatusOfAccessionCode' ? order : false}
        >
          {/* biologicalStatusOfAccessionCode */}
          <TableSortLabel
              active={orderBy === 'biologicalStatusOfAccessionCode'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'biologicalStatusOfAccessionCode')}}
          >
            <Typography color="inherit" variant="caption">
              biologicalStatusOfAccessionCode
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
GermplasmEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};