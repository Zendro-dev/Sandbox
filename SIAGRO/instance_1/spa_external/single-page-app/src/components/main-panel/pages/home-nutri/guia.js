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

export default function Guia() {
  const classes = useStyles();
  return (
    <Paper elevation={3}>
      <div>
        <Typography variant="h4" align="center" className={classes.title}>
          Guía y consideraciones adicionales para el uso de la base de datos
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          1. En el título de las tablas se hace referencia a la composición de
          alimentos y productos alimenticios y no al “valor nutritivo” ya que
          este concepto no depende únicamente de la composición nutrimental sino
          que incluye otros elementos de juicio ajenos a la naturaleza y
          composición del alimento.
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          2. Los usuarios de la información sobre composición de alimentos deben
          estar conscientes de que, en el mejor de los casos, los datos que
          encuentran en las tablas se refieren estrictamente a la muestra(s)
          específica(s) analizada(s) y que otras muestras podrían diferir,
          debido a su variedad, lugar de origen, suelo y clima de la zona
          cultivo, prácticas agrícolas, estado de maduración, tratamientos
          culinarios o industriales, entre otros factores.
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          3. En cada registro se mantuvo la “clave” original que lo refiere a la
          base de datos de la Dirección de Nutrición del INCMNSZ, y se agregó un
          identificador “conabio_id” que corresponde a un identificador único
          dentro de la base de datos en el SiAgroBD.
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          4. Los valores de todos los componentes se expresan por 100 g de
          porción comestible, la cual es 100% en alimentos como la leche, el
          queso, la tortilla, el pan, el frijol, la mayonesa, etc., pero
          inferior al 100% en frutas, verduras, raíces, huevo y algunas carnes
          (pollo, pescados, mariscos) debido a que las cáscaras, semillas,
          huesos y “espinas” suelen eliminarse antes de su consumo. En este
          último caso, si se desea conocer la composición del alimento tal como
          se adquiere habrá que realizar un cálculo multiplicando los valores de
          cada componente por el factor de porción comestible.
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          5. Debido a su utilidad operativa y para facilitar el trabajo del
          usuario en estas tablas se incluyen los factores promedio de “porción
          comestible” medidos en los laboratorios de la Dirección de Nutrición,
          así como los valores informados en tablas previas del Instituto.
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          6. Con excepción de los alimentos que por su preparación, obviamente
          son cocidos (ejemplo arroz con leche, tortilla, pan, tacos, enlatados,
          etc.) los valores presentados corresponden a los del alimento crudo,
          que casi siempre son diferentes a los del mismo alimento ya cocido.
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          7. La proteína bruta se calculó a partir del nitrógeno cuantificado
          por el método de Kjeldahl.
        </Typography>
        <Typography
          align={'justify'}
          paragraph={true}
          className={classes.text}
          gutterBottom
        >
          8. En general los hidratos de carbono se calcularon por diferencia a
          100 g de la suma de los valores obtenidos para humedad, fibra bruta,
          proteína bruta, cenizas y extracto etéreo. En algunos casos se dan
          valores para almidón y azúcares.
        </Typography>
      </div>
    </Paper>
  );
}
