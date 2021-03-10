import React, { Suspense, lazy } from 'react';
import { retry } from '../../../../../../../../../../utils.js';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../../../../../../../pages/ErrorBoundary';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
//lazy loading
const UniqueCapitalToAddTransferView = lazy(() => retry(() => import(/* webpackChunkName: "Create-TransferLists-ToAdd-UniqueCapital" */ './unique_capital-to-add-transfer-view/Unique_capitalToAddTransferView')));

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

export default function UniqueCapitalTransferLists(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    item,
    idsToAdd,
    idsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnCapitalRow,
  } = props;
  
  return (
    <div id='UniqueCapitalTransferLists-div-root' className={classes.root}>
      <Fade in={true} timeout={500}>
        <Grid
          className={classes.container} 
          container 
          justify='center'
          alignItems='flex-start'
          spacing={0}
        > 
          <Grid item xs={12}>
            <div className={classes.div}>
              <Typography variant="body2" display='inline'>
                { t('modelPanels.toAddHelperA', "Please select ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                {  t('modelPanels.theRecord', "the record ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                { t('modelPanels.toAddHelperB', " that you want to be associated with this ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                <b>{ 'Country.' }</b>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true}>
              <UniqueCapitalToAddTransferView
                item={item}
                idsToAdd={idsToAdd}
                idsToRemove={idsToRemove}
                handleDisassociateItem={handleTransferToRemove}
                handleReassociateItem={handleUntransferFromRemove}
                handleTransfer={handleTransferToAdd}
                handleUntransfer={handleUntransferFromAdd}
                handleClickOnCapitalRow={handleClickOnCapitalRow}
              />
            </ErrorBoundary></Suspense>
          </Grid>


        </Grid>
      </Fade>
    </div>
  );
}
UniqueCapitalTransferLists.propTypes = {
  item: PropTypes.object.isRequired,
  idsToAdd: PropTypes.array.isRequired,
  idsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnCapitalRow: PropTypes.func.isRequired,    
};