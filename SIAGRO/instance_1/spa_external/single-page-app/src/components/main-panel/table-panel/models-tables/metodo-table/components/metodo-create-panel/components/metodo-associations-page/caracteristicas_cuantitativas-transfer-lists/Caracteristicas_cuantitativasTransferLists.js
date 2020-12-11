import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
//lazy loading
const CaracteristicasCuantitativasToAddTransferView = lazy(() => import(/* webpackChunkName: "Create-TransferLists-ToAdd-CaracteristicasCuantitativas" */ './caracteristicas_cuantitativas-to-add-transfer-view/Caracteristicas_cuantitativasToAddTransferView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  container: {
    margin: theme.spacing(0),
  },
  div: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function CaracteristicasCuantitativasTransferLists(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    idsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnCaracteristica_cuantitativaRow,
  } = props;
  
  return (
    <div id='CaracteristicasCuantitativasTransferLists-div-root' className={classes.root}>
      <Fade in={true} timeout={500}>
        <Grid
          className={classes.container} 
          container 
          justify='center'
          alignItems='flex-start'
          alignContent='flex-start'
          spacing={0}
        > 
          <Grid item xs={12}>
            <div className={classes.div}>
              <Typography variant="body2" display='inline'>
                { t('modelPanels.toAddHelperA', "Please select ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                {  t('modelPanels.theRecords', "the records ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                { t('modelPanels.toAddHelperB', " that you want to be associated with this ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                <b>{ 'Metodo.' }</b>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Suspense fallback={<div />}>
              <CaracteristicasCuantitativasToAddTransferView
                idsToAdd={idsToAdd}
                handleTransfer={handleTransferToAdd}
                handleUntransfer={handleUntransferFromAdd}
                handleClickOnCaracteristica_cuantitativaRow={handleClickOnCaracteristica_cuantitativaRow}
              />
            </Suspense>
          </Grid>

        </Grid>
      </Fade>
    </div>
  );
}
CaracteristicasCuantitativasTransferLists.propTypes = {
  idsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnCaracteristica_cuantitativaRow: PropTypes.func.isRequired,
};