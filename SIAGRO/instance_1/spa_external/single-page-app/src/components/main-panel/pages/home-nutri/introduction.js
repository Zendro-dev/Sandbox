import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  text: {
    paddingRight: '40px',
    paddingLeft: '40px',
  },

  title: {
    paddingTop: '20px',
    paddingBottom: '20px',
  },
});

export default function Introduction() {
  const classes = useStyles();
  return (
    <Paper elevation={3}>
      <div>
        <Typography variant="h4" align="center" className={classes.title}>
          Introducción
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          La Base de datos de la “Tabla de composición de alimentos extendida
          2019”, consiste en una compilación realizada por el INCMNSZ. Esta base
          se enfoca en la composición de los alimentos consumidos en México, la
          mayor parte resultado de análisis realizados en el Instituto y otros
          recopilados de distintas fuentes citadas. Los datos incluidos son el
          producto de un gran número de personas, desde la labor pionera del Dr.
          R. Cravioto, hasta los análisis más recientes realizados en la
          Dirección de Nutrición del INCMNSZ.
        </Typography>
        <Typography align={'justify'} paragraph={true} className={classes.text}>
          La presente información puede ser de utilidad para los nutriólogos, el
          sector industrial, los investigadores, organizaciones de la sociedad
          civil, e incluso para las autoridades como información guía en la toma
          de decisiones sobre temas de nutrición en la población mexicana actual
          y teniendo como objetivo el fomentar una cultura alimentaria cada vez
          más adecuada.
        </Typography>
        <Typography align={'justify'} paragraph={true} className={classes.text}>
          Los datos de composición de alimentos tienen amplia utilidad práctica.
          Además de constituir el fundamento químico para la caracterización de
          los diferentes alimentos, se emplean, entre otros usos en la
          evaluación del aporte nutrimental de platillos y dietas, en la
          dietoterapia, en la investigación clínica y epidemiológica, en el
          desarrollo de nuevos productos en la industria de los alimentos y en
          diversos aspectos de la regulación sanitaria de los alimentos. Por
          ello, el análisis de la composición de alimentos constituye una
          actividad a la que se dedican grandes esfuerzos y recursos en muchos
          países del mundo.
        </Typography>
        <Typography align={'justify'} paragraph={true} className={classes.text}>
          Actualmente, la “Tabla de composición de alimentos extendida 2019”,
          consta de 3928 número de registros de alimentos. Los alimentos que
          integran la base de datos se encuentran clasificados en 17 grupos:
          <br /> 1) Semillas de cereales y derivados
          <br /> 2) Semillas de leguminosas y derivados
          <br /> 3) Otras semillas
          <br /> 4) Algas y hongos
          <br /> 5) Frutas
          <br /> 6) Verduras
          <br /> 7) Tubérculos, bulbos y raíces
          <br /> 8) Leche y derivados
          <br /> 9) Huevo (Aves y reptiles)
          <br /> 10) Carnes, vísceras y derivados
          <br /> 11) Pescados y mariscos
          <br /> 12) Azucares, mieles y dulces
          <br /> 13) Alimentos infantiles
          <br /> 14) Aderezos
          <br /> 15) Bebidas alcohólicas y no alcohólicas
          <br /> 16) Insectos
          <br /> 17) Varios
          <br />
        </Typography>
      </div>
    </Paper>
  );
}

