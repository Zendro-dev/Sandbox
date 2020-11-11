import React from 'react';
import PropTypes from 'prop-types';
import OntologyAnnotationAttributesFormView from './ontologyAnnotation-attributes-form-view/OntologyAnnotationAttributesFormView'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
}));

export default function OntologyAnnotationAttributesPage(props) {
  const classes = useStyles();
  const {
    item,
    valueOkStates,
  } = props;

  return (
    <Fade in={true} timeout={500}>
      <Grid
        className={classes.root} 
        container justify='center' 
        alignItems='flex-start'
        spacing={0}
      > 
        {/* Attributes Form View */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
          <OntologyAnnotationAttributesFormView
            item={item}
            valueOkStates={valueOkStates}
          />
        </Grid>
      </Grid>
    </Fade>
  );
}
OntologyAnnotationAttributesPage.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};