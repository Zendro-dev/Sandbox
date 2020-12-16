import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: 'auto',
    width: '100%',
    maxWidth: 300,
    minWidth: 200,
  },
}));

export default function IntField(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    name,
    label,
    text,
    valueOk,
    autoFocus,
    isForeignKey,
  } = props;

  function getInitialValue() {
    if(text !== undefined && text !== null) {
      
      if(typeof text === 'string' && text.trim() !== '') {
        return Math.round(parseFloat(text));
      
      } else if(typeof text === 'number') {
        return text;
      
      } else {
        return '';
      
      }
    } else {
      return  '';

    }
  }

  return (
      <Grid container justify='flex-start' alignItems='center' spacing={2}>
        <Grid item>
          <TextField
          id={'IntField-Study-'+name}
          label={label}
          type="number"
          value={getInitialValue()}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          placeholder=""
          autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                {(valueOk!==undefined&&valueOk===1) 
                  ? 
                  <Tooltip title={ t('modelPanels.valueEntered', "Value entered") }>
                    <Typography id={'IntField-Study-exists-'+name} variant="caption" color="primary">
                      &#8707;
                    </Typography>
                  </Tooltip>
                  : 
                  <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
                    <Typography id={'IntField-Study-notExists-'+name} variant="caption" color="textSecondary">
                      &#8708;
                    </Typography>
                  </Tooltip>
                }
              </InputAdornment>,
            readOnly: true
          }}
          InputLabelProps={{ 
            shrink: true
          }}
          inputProps={{ 
            spellCheck: 'false'
          }}
        />
        </Grid>
        {(isForeignKey) && (
          <Grid item>
            <Typography variant="caption" color='textSecondary'>
              Foreing key
            </Typography>
        </Grid>
        )}
      </Grid>
  );
}
IntField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  valueOk: PropTypes.number.isRequired,
  autoFocus: PropTypes.bool,
  isForeignKey: PropTypes.bool,
};