import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";

export default function BoolField(props) {
  const {
    itemKey,
    name,
    label,
    text,
    valueOk,
    valueAjv,
    autoFocus,
    handleSetValue,
    color,
    onChangeFlag,
    onKeyDownFlag,
  } = props;

  const useStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(0),
    },
    formControlLabel: {
      margin: theme.spacing(0),
    },
    checkbox: {
      padding: theme.spacing(2),
    },
  }));
  const classes = useStyles();
  const { t } = useTranslation();

  const [checked, setChecked] = useState(getInitialChecked());

  function getInitialChecked() {
    if (text !== undefined && text !== null) {
      if (typeof text === "string" && (text === "true" || text === "false")) {
        if (text === "true") {
          return true;
        } else if (text === "false") {
          return false;
        } else {
          return false;
        }
      } else if (typeof text === "boolean") {
        return text;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  let containerParameters = {
    justify: "flex-start",
    alignItems: "center",
    spacing: 0,
  };

  let checkboxParameters = {
    id: "BoolField-" + name,
    className: classes.checkbox,
    checked: checked,
    indeterminate: valueOk === 0,
    autoFocus: autoFocus !== undefined && autoFocus === true ? true : false,
  };
  if (color === "primary") {
    checkboxParameters.color = color;
  } else {
    checkboxParameters.color =
      valueAjv !== undefined && valueAjv.errors.length > 0
        ? "secondary"
        : "primary";
  }
  if (onChangeFlag) {
    checkboxParameters.onChange = (event) => {
      setChecked(event.target.checked);

      if (event.target.checked) {
        handleSetValue(true, 1, itemKey);
      } else {
        handleSetValue(false, 1, itemKey);
      }
    };
  }

  if (onKeyDownFlag) {
    checkboxParameters.onKeyDown = (event) => {
      if (event.key === "Delete") {
        handleSetValue(null, 0, itemKey);
        setChecked(false);
      }
    };
  }

  return (
    <Grid container {...containerParameters}>
      <Grid item>
        <FormControl className={classes.root} component="fieldset">
          <FormLabel component="legend">{label}</FormLabel>
          <FormControlLabel
            className={classes.formControlLabel}
            control={<Checkbox {...checkboxParameters} />}
          />
        </FormControl>
      </Grid>
      <Grid item>
        {valueOk !== undefined && valueOk === 1 ? (
          <Tooltip title={t("modelPanels.valueEntered", "Value entered")}>
            <Typography
              id={"BoolField-exists-" + name}
              variant="caption"
              color="primary"
            >
              &#8707;
            </Typography>
          </Tooltip>
        ) : (
          <Tooltip
            title={t("modelPanels.valueNotEntered", "Value not entered")}
          >
            <Typography
              id={"BoolField-notExists-" + name}
              variant="caption"
              color="textSecondary"
            >
              &#8708;
            </Typography>
          </Tooltip>
        )}
      </Grid>
      {valueAjv !== undefined && valueAjv.errors.length > 0 && (
        <Grid id={"BoolField-ajvError-" + name} item xs={12}>
          <Typography variant="caption" color="error">
            {valueAjv.errors.join(" & ")}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
