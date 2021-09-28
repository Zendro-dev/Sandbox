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

export default function LinkConabio() {
  const classes = useStyles();
  return (
    <Paper elevation={3}>
      <div>
        <Typography variant="h4" align="center" className={classes.title}>
          Vinculación con bases de datos de CONABIO
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          La integración de la importante información contenida en la base de
          datos “Tabla de composición de alimentos extendida” al SiAgroBD
          (Sistema de Agrobiodiversidad), permitirá poder vincularla con otros
          datos existentes de CONABIO. Actualmente los registros que cuentan con
          un nombre científico están vinculados al Catálogo de Autoridades
          Taxonómicas de la CONABIO, por lo que la información sobre los
          alimentos se complementa con información taxonómica detallada.
        </Typography>
      </div>
    </Paper>
  );
}
