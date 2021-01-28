import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  textField: {
    margin: "auto",
  },
}));

export default function StringField(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    itemKey,
    name,
    label,
    text,
    valueOk,
    valueAjv,
    autoFocus,
    handleSetValue,
    errorFlag,
    valueType,
    onChangeFlag,
    onBlurFlag,
    onKeyDownFlag,
    readOnlyFlag,
    shrinkLabelFlag,
    spellCheckFlag,
  } = props;

  let containerParameters = {
    justify: "flex-start",
    alignItems: "center",
    spacing: 0,
  };
  const defaultValue = useRef(
    text !== undefined && typeof text === "string" ? text : ""
  );
  const textValue = useRef(
    text !== undefined && typeof text === "string" ? text : null
  );

  let textParameters = {
    id: "StringField-" + name,
    label: label,
    rowsMax: "4",
    className: classes.textField,
    margin: "normal",
    variant: "outlined",
    autoFocus: autoFocus !== undefined && autoFocus === true ? true : false,
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          {valueOk !== undefined && valueOk === 1 ? (
            <Tooltip title={t("modelPanels.valueEntered", "Value entered")}>
              <Typography
                id={"StringField-exists-" + name}
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
                id={"StringField-notExists-" + name}
                variant="caption"
                color="textSecondary"
              >
                &#8708;
              </Typography>
            </Tooltip>
          )}
        </InputAdornment>
      ),
      readOnly: readOnlyFlag ? true : false,
    },
  };

  if (valueType === "default") {
    textParameters.defaultValue = defaultValue.current;
  } else {
    textParameters.value =
      text !== undefined && text !== null && typeof text === "string"
        ? text
        : "";
  }
  if (errorFlag) {
    textParameters.error = valueAjv !== undefined && valueAjv.errors.length > 0;
  }
  if (onChangeFlag) {
    textParameters.onChange = (event) => {
      textValue.current = event.target.value;

      if (!textValue.current || typeof textValue.current !== "string") {
        handleSetValue(null, 0, itemKey);
      } else {
        //status is set to 1 only on blur or ctrl+Enter
        handleSetValue(textValue.current, 0, itemKey);
      }
    };
  }
  if (onBlurFlag) {
    textParameters.onBlur = (event) => {
      if (!textValue.current || typeof textValue.current !== "string") {
        handleSetValue(null, 0, itemKey);
      } else {
        handleSetValue(textValue.current, 1, itemKey);
      }
    };
  }
  if (onKeyDownFlag) {
    textParameters.onKeyDown = (event) => {
      if (event.ctrlKey && event.key === "Enter") {
        if (!textValue.current || typeof textValue.current !== "string") {
          handleSetValue(null, 0, itemKey);
        } else {
          handleSetValue(textValue.current, 1, itemKey);
        }
      }
    };
  }
  if (shrinkLabelFlag) {
    textParameters.InputLabelProps = { shrink: true };
  }
  if (spellCheckFlag === false) {
    textParameters.inputProps = { spellCheck: "false" };
  }

  return (
    <Grid container {...containerParameters}>
      <Grid item xs={12}>
        <TextField multiline fullWidth {...textParameters} />
      </Grid>
      {valueAjv !== undefined && valueAjv.errors.length > 0 && (
        <Grid item id={"StringField-ajvError-" + name} xs={12}>
          <Typography variant="caption" color="error">
            {valueAjv.errors.join(" & ")}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
