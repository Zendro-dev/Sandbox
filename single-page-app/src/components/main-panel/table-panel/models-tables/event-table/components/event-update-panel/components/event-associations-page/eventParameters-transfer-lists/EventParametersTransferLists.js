import React from 'react';
import PropTypes from 'prop-types';
import EventParametersToAddTransferView from './eventParameters-to-add-transfer-view/EventParametersToAddTransferView'
import EventParametersToRemoveTransferView from './eventParameters-to-remove-transfer-view/EventParametersToRemoveTransferView'
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

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
  divider: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0),
  },
}));

export default function EventParametersTransferLists(props) {
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
    handleClickOnEventParameterRow,
  } = props;
  
  return (
    <div id='EventParametersTransferLists-div-root' className={classes.root}>
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
                {  t('modelPanels.theRecords', "the records ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                { t('modelPanels.toAddHelperB', " that you want to be associated with this ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                <b>{ 'Event.' }</b>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <EventParametersToAddTransferView
              item={item}
              idsToAdd={idsToAdd}
              handleTransfer={handleTransferToAdd}
              handleUntransfer={handleUntransferFromAdd}
              handleClickOnEventParameterRow={handleClickOnEventParameterRow}
            />
          </Grid>

          <Grid item xs={12}>
            <div className={classes.divider}>
              <Divider />
            </div>
          </Grid>
          
          <Grid item xs={12}>
            <div className={classes.div}>
              <Typography variant="body2" display='inline'>
                { t('modelPanels.toRemoveHelperA', "Please select ") }
              </Typography>

              <Typography variant="body2" display='inline'>
                {  t('modelPanels.theRecords', "the records ") }
              </Typography>

              <Typography variant="body2" display='inline'>
                { t('modelPanels.toRemoveHelperB', " that you no longer want to be associated with this ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                <b>{ 'Event.' }</b>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <EventParametersToRemoveTransferView
              item={item}
              idsToRemove={idsToRemove}
              handleTransfer={handleTransferToRemove}
              handleUntransfer={handleUntransferFromRemove}
              handleClickOnEventParameterRow={handleClickOnEventParameterRow}
            />
          </Grid>

        </Grid>
      </Fade>
    </div>
  );
}
EventParametersTransferLists.propTypes = {
  item: PropTypes.object.isRequired,
  idsToAdd: PropTypes.array.isRequired,
  idsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnEventParameterRow: PropTypes.func.isRequired,    
};