import React from "react";
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import LabTabs from './home-nutri/panel';

const useStyles = makeStyles({
    title: {
    color: 'black',
    fontWeight: 'bold',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '50px'
  },
  content: {
    flex: '0 1 auto',
  },
  img: {
    maxWidth: '50%',
    height: 'auto',
    paddingTop: '10px',
    paddingLeft: '10px',
  },
});

export default function Home() {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.root}>
        <CardMedia title="something">
          <img
            className={classes.img}
            src="/nutri.png"
            alt="nutricion banner"
          />
        </CardMedia>
        <CardContent className={classes.content}>
          <Typography
            align="center"
            component="h4"
            variant="h4"
            className={classes.title}
          >
            Base de datos
          </Typography>
          <Typography component="h4" variant="h4" className={classes.title}>
            Tabla de composición de alimentos extendida 2019
          </Typography>
        </CardContent>
      </Card>
      <LabTabs></LabTabs>
    </>    
  );
}
