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

export default function EjemplarEnhancedTableHead(props) {
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
          (permissions&&permissions.ejemplar&&Array.isArray(permissions.ejemplar)
          &&(permissions.ejemplar.includes('update') || permissions.ejemplar.includes('delete') || permissions.ejemplar.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.ejemplar.includes('update') || permissions.ejemplar.includes('*')) ? 1 : 0) 
                +
                ((permissions.ejemplar.includes('delete') || permissions.ejemplar.includes('*')) ? 1 : 0)
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
          key='region'
          align='left'
          padding="default"
          sortDirection={orderBy === 'region' ? order : false}
        >
          {/* region */}
          <TableSortLabel
              active={orderBy === 'region'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'region')}}
          >
            <Typography color="inherit" variant="caption">
              region
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='localidad'
          align='left'
          padding="default"
          sortDirection={orderBy === 'localidad' ? order : false}
        >
          {/* localidad */}
          <TableSortLabel
              active={orderBy === 'localidad'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'localidad')}}
          >
            <Typography color="inherit" variant="caption">
              localidad
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='longitud'
          align='right'
          padding="default"
          sortDirection={orderBy === 'longitud' ? order : false}
        >
          {/* longitud */}
          <TableSortLabel
              active={orderBy === 'longitud'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'longitud')}}
          >
            <Typography color="inherit" variant="caption">
              longitud
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='latitud'
          align='right'
          padding="default"
          sortDirection={orderBy === 'latitud' ? order : false}
        >
          {/* latitud */}
          <TableSortLabel
              active={orderBy === 'latitud'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'latitud')}}
          >
            <Typography color="inherit" variant="caption">
              latitud
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='datum'
          align='left'
          padding="default"
          sortDirection={orderBy === 'datum' ? order : false}
        >
          {/* datum */}
          <TableSortLabel
              active={orderBy === 'datum'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'datum')}}
          >
            <Typography color="inherit" variant="caption">
              datum
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='validacionambiente'
          align='left'
          padding="default"
          sortDirection={orderBy === 'validacionambiente' ? order : false}
        >
          {/* validacionambiente */}
          <TableSortLabel
              active={orderBy === 'validacionambiente'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'validacionambiente')}}
          >
            <Typography color="inherit" variant="caption">
              validacionambiente
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='geovalidacion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'geovalidacion' ? order : false}
        >
          {/* geovalidacion */}
          <TableSortLabel
              active={orderBy === 'geovalidacion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'geovalidacion')}}
          >
            <Typography color="inherit" variant="caption">
              geovalidacion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='paismapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'paismapa' ? order : false}
        >
          {/* paismapa */}
          <TableSortLabel
              active={orderBy === 'paismapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'paismapa')}}
          >
            <Typography color="inherit" variant="caption">
              paismapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='estadomapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'estadomapa' ? order : false}
        >
          {/* estadomapa */}
          <TableSortLabel
              active={orderBy === 'estadomapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'estadomapa')}}
          >
            <Typography color="inherit" variant="caption">
              estadomapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='claveestadomapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'claveestadomapa' ? order : false}
        >
          {/* claveestadomapa */}
          <TableSortLabel
              active={orderBy === 'claveestadomapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'claveestadomapa')}}
          >
            <Typography color="inherit" variant="caption">
              claveestadomapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mt24nombreestadomapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'mt24nombreestadomapa' ? order : false}
        >
          {/* mt24nombreestadomapa */}
          <TableSortLabel
              active={orderBy === 'mt24nombreestadomapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mt24nombreestadomapa')}}
          >
            <Typography color="inherit" variant="caption">
              mt24nombreestadomapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mt24claveestadomapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'mt24claveestadomapa' ? order : false}
        >
          {/* mt24claveestadomapa */}
          <TableSortLabel
              active={orderBy === 'mt24claveestadomapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mt24claveestadomapa')}}
          >
            <Typography color="inherit" variant="caption">
              mt24claveestadomapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='municipiomapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'municipiomapa' ? order : false}
        >
          {/* municipiomapa */}
          <TableSortLabel
              active={orderBy === 'municipiomapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'municipiomapa')}}
          >
            <Typography color="inherit" variant="caption">
              municipiomapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='clavemunicipiomapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'clavemunicipiomapa' ? order : false}
        >
          {/* clavemunicipiomapa */}
          <TableSortLabel
              active={orderBy === 'clavemunicipiomapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'clavemunicipiomapa')}}
          >
            <Typography color="inherit" variant="caption">
              clavemunicipiomapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mt24nombremunicipiomapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'mt24nombremunicipiomapa' ? order : false}
        >
          {/* mt24nombremunicipiomapa */}
          <TableSortLabel
              active={orderBy === 'mt24nombremunicipiomapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mt24nombremunicipiomapa')}}
          >
            <Typography color="inherit" variant="caption">
              mt24nombremunicipiomapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mt24clavemunicipiomapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'mt24clavemunicipiomapa' ? order : false}
        >
          {/* mt24clavemunicipiomapa */}
          <TableSortLabel
              active={orderBy === 'mt24clavemunicipiomapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mt24clavemunicipiomapa')}}
          >
            <Typography color="inherit" variant="caption">
              mt24clavemunicipiomapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='incertidumbrexy'
          align='left'
          padding="default"
          sortDirection={orderBy === 'incertidumbrexy' ? order : false}
        >
          {/* incertidumbrexy */}
          <TableSortLabel
              active={orderBy === 'incertidumbrexy'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'incertidumbrexy')}}
          >
            <Typography color="inherit" variant="caption">
              incertidumbrexy
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='altitudmapa'
          align='left'
          padding="default"
          sortDirection={orderBy === 'altitudmapa' ? order : false}
        >
          {/* altitudmapa */}
          <TableSortLabel
              active={orderBy === 'altitudmapa'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'altitudmapa')}}
          >
            <Typography color="inherit" variant="caption">
              altitudmapa
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='usvserieI'
          align='left'
          padding="default"
          sortDirection={orderBy === 'usvserieI' ? order : false}
        >
          {/* usvserieI */}
          <TableSortLabel
              active={orderBy === 'usvserieI'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'usvserieI')}}
          >
            <Typography color="inherit" variant="caption">
              usvserieI
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='usvserieII'
          align='left'
          padding="default"
          sortDirection={orderBy === 'usvserieII' ? order : false}
        >
          {/* usvserieII */}
          <TableSortLabel
              active={orderBy === 'usvserieII'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'usvserieII')}}
          >
            <Typography color="inherit" variant="caption">
              usvserieII
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='usvserieIII'
          align='left'
          padding="default"
          sortDirection={orderBy === 'usvserieIII' ? order : false}
        >
          {/* usvserieIII */}
          <TableSortLabel
              active={orderBy === 'usvserieIII'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'usvserieIII')}}
          >
            <Typography color="inherit" variant="caption">
              usvserieIII
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='usvserieIV'
          align='left'
          padding="default"
          sortDirection={orderBy === 'usvserieIV' ? order : false}
        >
          {/* usvserieIV */}
          <TableSortLabel
              active={orderBy === 'usvserieIV'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'usvserieIV')}}
          >
            <Typography color="inherit" variant="caption">
              usvserieIV
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='usvserieV'
          align='left'
          padding="default"
          sortDirection={orderBy === 'usvserieV' ? order : false}
        >
          {/* usvserieV */}
          <TableSortLabel
              active={orderBy === 'usvserieV'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'usvserieV')}}
          >
            <Typography color="inherit" variant="caption">
              usvserieV
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='usvserieVI'
          align='left'
          padding="default"
          sortDirection={orderBy === 'usvserieVI' ? order : false}
        >
          {/* usvserieVI */}
          <TableSortLabel
              active={orderBy === 'usvserieVI'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'usvserieVI')}}
          >
            <Typography color="inherit" variant="caption">
              usvserieVI
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='anp'
          align='left'
          padding="default"
          sortDirection={orderBy === 'anp' ? order : false}
        >
          {/* anp */}
          <TableSortLabel
              active={orderBy === 'anp'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'anp')}}
          >
            <Typography color="inherit" variant="caption">
              anp
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='grupobio'
          align='left'
          padding="default"
          sortDirection={orderBy === 'grupobio' ? order : false}
        >
          {/* grupobio */}
          <TableSortLabel
              active={orderBy === 'grupobio'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'grupobio')}}
          >
            <Typography color="inherit" variant="caption">
              grupobio
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='subgrupobio'
          align='left'
          padding="default"
          sortDirection={orderBy === 'subgrupobio' ? order : false}
        >
          {/* subgrupobio */}
          <TableSortLabel
              active={orderBy === 'subgrupobio'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'subgrupobio')}}
          >
            <Typography color="inherit" variant="caption">
              subgrupobio
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='taxon'
          align='left'
          padding="default"
          sortDirection={orderBy === 'taxon' ? order : false}
        >
          {/* taxon */}
          <TableSortLabel
              active={orderBy === 'taxon'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'taxon')}}
          >
            <Typography color="inherit" variant="caption">
              taxon
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='autor'
          align='left'
          padding="default"
          sortDirection={orderBy === 'autor' ? order : false}
        >
          {/* autor */}
          <TableSortLabel
              active={orderBy === 'autor'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'autor')}}
          >
            <Typography color="inherit" variant="caption">
              autor
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='estatustax'
          align='left'
          padding="default"
          sortDirection={orderBy === 'estatustax' ? order : false}
        >
          {/* estatustax */}
          <TableSortLabel
              active={orderBy === 'estatustax'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'estatustax')}}
          >
            <Typography color="inherit" variant="caption">
              estatustax
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='reftax'
          align='left'
          padding="default"
          sortDirection={orderBy === 'reftax' ? order : false}
        >
          {/* reftax */}
          <TableSortLabel
              active={orderBy === 'reftax'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'reftax')}}
          >
            <Typography color="inherit" variant="caption">
              reftax
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='taxonvalido'
          align='left'
          padding="default"
          sortDirection={orderBy === 'taxonvalido' ? order : false}
        >
          {/* taxonvalido */}
          <TableSortLabel
              active={orderBy === 'taxonvalido'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'taxonvalido')}}
          >
            <Typography color="inherit" variant="caption">
              taxonvalido
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='autorvalido'
          align='left'
          padding="default"
          sortDirection={orderBy === 'autorvalido' ? order : false}
        >
          {/* autorvalido */}
          <TableSortLabel
              active={orderBy === 'autorvalido'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'autorvalido')}}
          >
            <Typography color="inherit" variant="caption">
              autorvalido
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='reftaxvalido'
          align='left'
          padding="default"
          sortDirection={orderBy === 'reftaxvalido' ? order : false}
        >
          {/* reftaxvalido */}
          <TableSortLabel
              active={orderBy === 'reftaxvalido'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'reftaxvalido')}}
          >
            <Typography color="inherit" variant="caption">
              reftaxvalido
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='taxonvalidado'
          align='left'
          padding="default"
          sortDirection={orderBy === 'taxonvalidado' ? order : false}
        >
          {/* taxonvalidado */}
          <TableSortLabel
              active={orderBy === 'taxonvalidado'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'taxonvalidado')}}
          >
            <Typography color="inherit" variant="caption">
              taxonvalidado
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='endemismo'
          align='left'
          padding="default"
          sortDirection={orderBy === 'endemismo' ? order : false}
        >
          {/* endemismo */}
          <TableSortLabel
              active={orderBy === 'endemismo'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'endemismo')}}
          >
            <Typography color="inherit" variant="caption">
              endemismo
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='taxonextinto'
          align='left'
          padding="default"
          sortDirection={orderBy === 'taxonextinto' ? order : false}
        >
          {/* taxonextinto */}
          <TableSortLabel
              active={orderBy === 'taxonextinto'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'taxonextinto')}}
          >
            <Typography color="inherit" variant="caption">
              taxonextinto
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='ambiente'
          align='left'
          padding="default"
          sortDirection={orderBy === 'ambiente' ? order : false}
        >
          {/* ambiente */}
          <TableSortLabel
              active={orderBy === 'ambiente'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'ambiente')}}
          >
            <Typography color="inherit" variant="caption">
              ambiente
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='nombrecomun'
          align='left'
          padding="default"
          sortDirection={orderBy === 'nombrecomun' ? order : false}
        >
          {/* nombrecomun */}
          <TableSortLabel
              active={orderBy === 'nombrecomun'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'nombrecomun')}}
          >
            <Typography color="inherit" variant="caption">
              nombrecomun
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='formadecrecimiento'
          align='left'
          padding="default"
          sortDirection={orderBy === 'formadecrecimiento' ? order : false}
        >
          {/* formadecrecimiento */}
          <TableSortLabel
              active={orderBy === 'formadecrecimiento'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'formadecrecimiento')}}
          >
            <Typography color="inherit" variant="caption">
              formadecrecimiento
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='prioritaria'
          align='left'
          padding="default"
          sortDirection={orderBy === 'prioritaria' ? order : false}
        >
          {/* prioritaria */}
          <TableSortLabel
              active={orderBy === 'prioritaria'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'prioritaria')}}
          >
            <Typography color="inherit" variant="caption">
              prioritaria
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='nivelprioridad'
          align='left'
          padding="default"
          sortDirection={orderBy === 'nivelprioridad' ? order : false}
        >
          {/* nivelprioridad */}
          <TableSortLabel
              active={orderBy === 'nivelprioridad'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'nivelprioridad')}}
          >
            <Typography color="inherit" variant="caption">
              nivelprioridad
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='exoticainvasora'
          align='left'
          padding="default"
          sortDirection={orderBy === 'exoticainvasora' ? order : false}
        >
          {/* exoticainvasora */}
          <TableSortLabel
              active={orderBy === 'exoticainvasora'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'exoticainvasora')}}
          >
            <Typography color="inherit" variant="caption">
              exoticainvasora
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='nom059'
          align='left'
          padding="default"
          sortDirection={orderBy === 'nom059' ? order : false}
        >
          {/* nom059 */}
          <TableSortLabel
              active={orderBy === 'nom059'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'nom059')}}
          >
            <Typography color="inherit" variant="caption">
              nom059
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='cites'
          align='left'
          padding="default"
          sortDirection={orderBy === 'cites' ? order : false}
        >
          {/* cites */}
          <TableSortLabel
              active={orderBy === 'cites'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'cites')}}
          >
            <Typography color="inherit" variant="caption">
              cites
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='iucn'
          align='left'
          padding="default"
          sortDirection={orderBy === 'iucn' ? order : false}
        >
          {/* iucn */}
          <TableSortLabel
              active={orderBy === 'iucn'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'iucn')}}
          >
            <Typography color="inherit" variant="caption">
              iucn
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='categoriaresidenciaaves'
          align='left'
          padding="default"
          sortDirection={orderBy === 'categoriaresidenciaaves' ? order : false}
        >
          {/* categoriaresidenciaaves */}
          <TableSortLabel
              active={orderBy === 'categoriaresidenciaaves'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'categoriaresidenciaaves')}}
          >
            <Typography color="inherit" variant="caption">
              categoriaresidenciaaves
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='probablelocnodecampo'
          align='left'
          padding="default"
          sortDirection={orderBy === 'probablelocnodecampo' ? order : false}
        >
          {/* probablelocnodecampo */}
          <TableSortLabel
              active={orderBy === 'probablelocnodecampo'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'probablelocnodecampo')}}
          >
            <Typography color="inherit" variant="caption">
              probablelocnodecampo
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='obsusoinfo'
          align='left'
          padding="default"
          sortDirection={orderBy === 'obsusoinfo' ? order : false}
        >
          {/* obsusoinfo */}
          <TableSortLabel
              active={orderBy === 'obsusoinfo'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'obsusoinfo')}}
          >
            <Typography color="inherit" variant="caption">
              obsusoinfo
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='coleccion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'coleccion' ? order : false}
        >
          {/* coleccion */}
          <TableSortLabel
              active={orderBy === 'coleccion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'coleccion')}}
          >
            <Typography color="inherit" variant="caption">
              coleccion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='institucion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'institucion' ? order : false}
        >
          {/* institucion */}
          <TableSortLabel
              active={orderBy === 'institucion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'institucion')}}
          >
            <Typography color="inherit" variant="caption">
              institucion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='paiscoleccion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'paiscoleccion' ? order : false}
        >
          {/* paiscoleccion */}
          <TableSortLabel
              active={orderBy === 'paiscoleccion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'paiscoleccion')}}
          >
            <Typography color="inherit" variant="caption">
              paiscoleccion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='numcatalogo'
          align='left'
          padding="default"
          sortDirection={orderBy === 'numcatalogo' ? order : false}
        >
          {/* numcatalogo */}
          <TableSortLabel
              active={orderBy === 'numcatalogo'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'numcatalogo')}}
          >
            <Typography color="inherit" variant="caption">
              numcatalogo
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='numcolecta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'numcolecta' ? order : false}
        >
          {/* numcolecta */}
          <TableSortLabel
              active={orderBy === 'numcolecta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'numcolecta')}}
          >
            <Typography color="inherit" variant="caption">
              numcolecta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='procedenciaejemplar'
          align='left'
          padding="default"
          sortDirection={orderBy === 'procedenciaejemplar' ? order : false}
        >
          {/* procedenciaejemplar */}
          <TableSortLabel
              active={orderBy === 'procedenciaejemplar'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'procedenciaejemplar')}}
          >
            <Typography color="inherit" variant="caption">
              procedenciaejemplar
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='determinador'
          align='left'
          padding="default"
          sortDirection={orderBy === 'determinador' ? order : false}
        >
          {/* determinador */}
          <TableSortLabel
              active={orderBy === 'determinador'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'determinador')}}
          >
            <Typography color="inherit" variant="caption">
              determinador
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='aniodeterminacion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'aniodeterminacion' ? order : false}
        >
          {/* aniodeterminacion */}
          <TableSortLabel
              active={orderBy === 'aniodeterminacion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'aniodeterminacion')}}
          >
            <Typography color="inherit" variant="caption">
              aniodeterminacion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mesdeterminacion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'mesdeterminacion' ? order : false}
        >
          {/* mesdeterminacion */}
          <TableSortLabel
              active={orderBy === 'mesdeterminacion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mesdeterminacion')}}
          >
            <Typography color="inherit" variant="caption">
              mesdeterminacion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='diadeterminacion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'diadeterminacion' ? order : false}
        >
          {/* diadeterminacion */}
          <TableSortLabel
              active={orderBy === 'diadeterminacion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'diadeterminacion')}}
          >
            <Typography color="inherit" variant="caption">
              diadeterminacion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='fechadeterminacion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'fechadeterminacion' ? order : false}
        >
          {/* fechadeterminacion */}
          <TableSortLabel
              active={orderBy === 'fechadeterminacion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fechadeterminacion')}}
          >
            <Typography color="inherit" variant="caption">
              fechadeterminacion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='calificadordeterminacion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'calificadordeterminacion' ? order : false}
        >
          {/* calificadordeterminacion */}
          <TableSortLabel
              active={orderBy === 'calificadordeterminacion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'calificadordeterminacion')}}
          >
            <Typography color="inherit" variant="caption">
              calificadordeterminacion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='colector'
          align='left'
          padding="default"
          sortDirection={orderBy === 'colector' ? order : false}
        >
          {/* colector */}
          <TableSortLabel
              active={orderBy === 'colector'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'colector')}}
          >
            <Typography color="inherit" variant="caption">
              colector
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='aniocolecta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'aniocolecta' ? order : false}
        >
          {/* aniocolecta */}
          <TableSortLabel
              active={orderBy === 'aniocolecta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'aniocolecta')}}
          >
            <Typography color="inherit" variant="caption">
              aniocolecta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='mescolecta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'mescolecta' ? order : false}
        >
          {/* mescolecta */}
          <TableSortLabel
              active={orderBy === 'mescolecta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'mescolecta')}}
          >
            <Typography color="inherit" variant="caption">
              mescolecta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='diacolecta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'diacolecta' ? order : false}
        >
          {/* diacolecta */}
          <TableSortLabel
              active={orderBy === 'diacolecta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'diacolecta')}}
          >
            <Typography color="inherit" variant="caption">
              diacolecta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='fechacolecta'
          align='left'
          padding="default"
          sortDirection={orderBy === 'fechacolecta' ? order : false}
        >
          {/* fechacolecta */}
          <TableSortLabel
              active={orderBy === 'fechacolecta'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fechacolecta')}}
          >
            <Typography color="inherit" variant="caption">
              fechacolecta
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='tipo'
          align='left'
          padding="default"
          sortDirection={orderBy === 'tipo' ? order : false}
        >
          {/* tipo */}
          <TableSortLabel
              active={orderBy === 'tipo'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'tipo')}}
          >
            <Typography color="inherit" variant="caption">
              tipo
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='ejemplarfosil'
          align='left'
          padding="default"
          sortDirection={orderBy === 'ejemplarfosil' ? order : false}
        >
          {/* ejemplarfosil */}
          <TableSortLabel
              active={orderBy === 'ejemplarfosil'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'ejemplarfosil')}}
          >
            <Typography color="inherit" variant="caption">
              ejemplarfosil
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='proyecto'
          align='left'
          padding="default"
          sortDirection={orderBy === 'proyecto' ? order : false}
        >
          {/* proyecto */}
          <TableSortLabel
              active={orderBy === 'proyecto'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'proyecto')}}
          >
            <Typography color="inherit" variant="caption">
              proyecto
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='fuente'
          align='left'
          padding="default"
          sortDirection={orderBy === 'fuente' ? order : false}
        >
          {/* fuente */}
          <TableSortLabel
              active={orderBy === 'fuente'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'fuente')}}
          >
            <Typography color="inherit" variant="caption">
              fuente
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='formadecitar'
          align='left'
          padding="default"
          sortDirection={orderBy === 'formadecitar' ? order : false}
        >
          {/* formadecitar */}
          <TableSortLabel
              active={orderBy === 'formadecitar'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'formadecitar')}}
          >
            <Typography color="inherit" variant="caption">
              formadecitar
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='licenciauso'
          align='left'
          padding="default"
          sortDirection={orderBy === 'licenciauso' ? order : false}
        >
          {/* licenciauso */}
          <TableSortLabel
              active={orderBy === 'licenciauso'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'licenciauso')}}
          >
            <Typography color="inherit" variant="caption">
              licenciauso
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='urlproyecto'
          align='left'
          padding="default"
          sortDirection={orderBy === 'urlproyecto' ? order : false}
        >
          {/* urlproyecto */}
          <TableSortLabel
              active={orderBy === 'urlproyecto'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'urlproyecto')}}
          >
            <Typography color="inherit" variant="caption">
              urlproyecto
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='urlorigen'
          align='left'
          padding="default"
          sortDirection={orderBy === 'urlorigen' ? order : false}
        >
          {/* urlorigen */}
          <TableSortLabel
              active={orderBy === 'urlorigen'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'urlorigen')}}
          >
            <Typography color="inherit" variant="caption">
              urlorigen
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='urlejemplar'
          align='left'
          padding="default"
          sortDirection={orderBy === 'urlejemplar' ? order : false}
        >
          {/* urlejemplar */}
          <TableSortLabel
              active={orderBy === 'urlejemplar'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'urlejemplar')}}
          >
            <Typography color="inherit" variant="caption">
              urlejemplar
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='ultimafechaactualizacion'
          align='left'
          padding="default"
          sortDirection={orderBy === 'ultimafechaactualizacion' ? order : false}
        >
          {/* ultimafechaactualizacion */}
          <TableSortLabel
              active={orderBy === 'ultimafechaactualizacion'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'ultimafechaactualizacion')}}
          >
            <Typography color="inherit" variant="caption">
              ultimafechaactualizacion
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='cuarentena'
          align='left'
          padding="default"
          sortDirection={orderBy === 'cuarentena' ? order : false}
        >
          {/* cuarentena */}
          <TableSortLabel
              active={orderBy === 'cuarentena'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'cuarentena')}}
          >
            <Typography color="inherit" variant="caption">
              cuarentena
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

        <TableCell
          key='especie'
          align='left'
          padding="default"
          sortDirection={orderBy === 'especie' ? order : false}
        >
          {/* especie */}
          <TableSortLabel
              active={orderBy === 'especie'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'especie')}}
          >
            <Typography color="inherit" variant="caption">
              especie
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='especievalida'
          align='left'
          padding="default"
          sortDirection={orderBy === 'especievalida' ? order : false}
        >
          {/* especievalida */}
          <TableSortLabel
              active={orderBy === 'especievalida'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'especievalida')}}
          >
            <Typography color="inherit" variant="caption">
              especievalida
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='especievalidabusqueda'
          align='left'
          padding="default"
          sortDirection={orderBy === 'especievalidabusqueda' ? order : false}
        >
          {/* especievalidabusqueda */}
          <TableSortLabel
              active={orderBy === 'especievalidabusqueda'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'especievalidabusqueda')}}
          >
            <Typography color="inherit" variant="caption">
              especievalidabusqueda
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
EjemplarEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};