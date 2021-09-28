import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

function createData(
  name,
  type,
  description,
  example
) {
  return { name, type, description, example };
}

const registro = [
  createData(
    'conabio_id',
    'String',
    'Llave primaria. Clave única que identifica a cada alimento.',
    '3410'
  ),
  createData(
    'clave_original',
    'String',
    'Clave numérica, no única, asignada a los alimentos en la Base de datos de tabla de composción de alimentos mexicanos extendida 2019.',
    '13307'
  ),
  createData(
    'tipo_alimento',
    'String',
    'Categoría de alimento al que pertenece el registro.',
    'LECHE Y DERIVADOS'
  ),
  createData(
    'food_type',
    'String',
    'tipo_alimento en inglés.',
    'MILK AND DAIRY PRODUCTS'
  ),
  createData(
    'descripcion_alimento',
    'String',
    'Nombre y descripción corta del alimento.',
    'Chocolate En Barra'
  ),
  createData(
    'food_description',
    'String',
    'descripcion_alimento en inglés.',
    'Chocolate bar'
  ),
  createData(
    'procedencia',
    'String',
    'Lugar de origen de la muestra.',
    'México, Distrito Federal (mercado)'
  ),
  createData(
    'taxon_id',
    'String',
    'Llave foránea. Identificador único del taxon asociado al registro, que se vincula a los catálogos del SNIB, CONABIO.',
    '2723FUNGI'
  ),
  createData(
    'referencias_ids',
    'Array',
    'Llaves foráneas. Listado de los identificadores únicos de las referencias bibliográficas correspondientes a cada alimento.',
    '2::20::21'
  ),
];

const cuantitativa = [
  createData(
    'nombre',
    'String',
    'Nombre del nutriente, componente o característica que se midió del alimento.',
    'Isoleucina'
  ),
  createData(
    'nombre_corto',
    'String',
    'Nombre abreviado del nutriente, componente o característica que se midió del alimento.',
    'ILE'
  ),
  createData('valor', 'Float', 'Valor de la medición.', '4.3'),
  createData(
    'unidad',
    'String',
    'Unidad en que se reporta la medición.',
    'g / 100 g proteína'
  ),
  createData(
    'comentarios',
    'String',
    'Comentarios adicionales de la medición.',
    'Conversión de unidades usando el factor: 1 U.I. Vitamina A = 0.3 mcg retinol'
  ),
  createData(
    'metodo_id',
    'String',
    'Llave foránea. Identificador único del método que se usó para determinar la característica reportada.',
    '27'
  ),
  createData(
    'registro_id',
    'String',
    'Llave foránea. Identificador único del alimento.',
    '3410'
  ),
];

const metodo = [
  createData(
    'id',
    'String',
    'Llave primaria. Identificador único del método de medición.',
    '27'
  ),
  createData(
    'descripcion',
    'String',
    'Descripción del método.',
    'Análisis de almidón'
  ),
  createData(
    'referencia',
    'String',
    'Referencia bilbiográfica correspondiente al método.',
    'Aman, P. and Hessellmank. (1984). Analysis of starch and other main constituents of cereal grains. Swedish J. Agric. Res. 14, 135-139.'
  ),
  createData(
    'link_referencia',
    'String',
    'Enlace externo a las referencias citadas para el método.',
    'https://agris.fao.org/agris-search/search.do?recordID=SE8510401'
  ),
];

const referencia = [
  createData(
    'referencia_id',
    'String',
    'Llave primaria. Identificador único de la referencias bibliográficas correspondientes a los alimentos.',
    '20'
  ),
  createData(
    'referencia',
    'String',
    'Referencia bibliográfica correspondiente a los alimentos.',
    'Grijalva, H.M. y Valencia, M.E. (1969 - 1997). Informes de tesis realizadas en el ITESM y el CIAD. Sonora, México.'
  ),
  createData(
    'registros_ids',
    'Array',
    'Llaves foráneas. Listado de los identificadores únicos de los alimentos asociados a cada referencia.',
    '2822::2823'
  ),
];

const useStyles = makeStyles({
  custom: {
    color: 'white',
    fontWeight: 'bold',
    background: '#004d99',
  },
  space: {
    margin: '20px',
  },

  title: {
    paddingTop: '20px',
    paddingBottom: '20px',
  },
});

export default function Dictionary() {
  const classes = useStyles();
  return (
    <Paper>
      <div>
        <Typography variant="h4" align="center" className={classes.title}>
          Diccionario de Datos
        </Typography>
      </div>
      <div className={classes.space}>
        <Typography variant="h5" align="center" className={classes.custom}>
          Registro
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Nombre del atributo</TableCell>
                <TableCell align="center">Tipo de dato</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="center">Ejemplo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registro.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.type}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className={classes.space}>
        <Typography variant="h5" align="center" className={classes.custom}>
          Característica cuantitativa
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Nombre del atributo</TableCell>
                <TableCell align="center">Tipo de dato</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="center">Ejemplo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cuantitativa.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.type}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className={classes.space}>
        <Typography variant="h5" align="center" className={classes.custom}>
          Método
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Nombre del atributo</TableCell>
                <TableCell align="center">Tipo de dato</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="center">Ejemplo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metodo.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.type}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className={classes.space}>
        <Typography variant="h5" align="center" className={classes.custom}>
          Referencia
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Nombre del atributo</TableCell>
                <TableCell align="center">Tipo de dato</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="center">Ejemplo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {referencia.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.type}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
}

