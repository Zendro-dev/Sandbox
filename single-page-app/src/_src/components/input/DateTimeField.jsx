import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import "moment/locale/es.js";
import "moment/locale/de.js";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: theme.spacing(0),
  },
  formControl: {
    marginRight: theme.spacing(1),
  },
  ajvError: {
    color: "red",
  },
}));

export default function DateTimeField(props) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const {
    itemKey,
    name,
    label,
    text,
    valueOk,
    valueAjv,
    autoFocus,
    handleSetValue,
    variant,
    inputVariant,
    readOnlyFlag,
    onChangeFlag,
    onBlurFlag,
    onKeyDownFlag,
  } = props;

  const [selectedDate, setSelectedDate] = useState(getInitialSelectedDate());
  const mdate = useRef(getInitialMdate());

  function getInitialSelectedDate() {
    moment.locale(i18n.language);

    if (
      text !== undefined &&
      text !== null &&
      typeof text === "string" &&
      text.trim() !== ""
    ) {
      let m = moment(text, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      if (m.isValid()) {
        return m;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  function getInitialMdate() {
    moment.locale(i18n.language);

    if (
      text !== undefined &&
      text !== null &&
      typeof text === "string" &&
      text.trim() !== ""
    ) {
      let m = moment(text, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      if (m.isValid()) {
        return m;
      } else {
        return moment.invalid();
      }
    } else {
      return moment.invalid();
    }
  }

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  let pickerParameters = {
    id: "DateTimeField-" + name,
    className: classes.input,
    label: label,
    format: "YYYY-MM-DD HH:mm:ss.SSS",
    value: selectedDate,
    margin: "normal",
    autoFocus: autoFocus === true ? true : false,
    autoOk: readOnlyFlag ? true : false,
    inputVariant: inputVariant,
    invalidDateMessage: t("modelPanels.invalidDate", "Invalid date format"),
    InputAdornmentProps: { id: "DateTimeField-input-inputAdornment-" + name },
    KeyboardButtonProps: {
      id: "DateTimeField-input-inputAdornment-button-" + name,
    },
    InputProps: {
      className: classnames({
        [classes.ajvError]:
          valueAjv !== undefined && valueAjv.errors.length > 0,
      }),
      readOnly: readOnlyFlag ? true : false,
    },
  };
  if (variant) {
    pickerParameters.variant = variant;
  }
  if (onChangeFlag) {
    pickerParameters.onChange = (date, value) => {
      setSelectedDate(date);

      if (date !== null) {
        mdate.current = date;

        if (mdate.current.isValid()) {
          handleSetValue(
            mdate.current.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            1,
            itemKey
          );
        } else {
          handleSetValue(null, -1, itemKey);
        }
      } else {
        mdate.current = moment.invalid();
        handleSetValue(null, 0, itemKey);
      }
    };
  } else {
    pickerParameters.onChange = () => {};
  }
  if (onBlurFlag) {
    pickerParameters.onBlur = (event) => {
      if (mdate.current.isValid()) {
        handleSetValue(
          mdate.current.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          1,
          itemKey
        );
      }
    };
  }

  if (onKeyDownFlag) {
    pickerParameters.onKeyDown = (event) => {
      if (event.key === "Enter") {
        if (mdate.current.isValid()) {
          handleSetValue(
            mdate.current.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            1,
            itemKey
          );
        }
      }
    };
  }

  return (
    <Grid container justify="flex-start" alignItems="center" spacing={0}>
      <Grid item>
        <MuiPickersUtilsProvider
          libInstance={moment}
          utils={MomentUtils}
          locale={i18n.language}
        >
          <FormControl className={classes.formControl}>
            <KeyboardDateTimePicker {...pickerParameters} />
          </FormControl>
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item>
        {valueOk !== undefined && valueOk === 1 ? (
          <Tooltip title={t("modelPanels.valueEntered", "Value entered")}>
            <Typography
              id={"DateTimeField-exists-" + name}
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
              id={"DateTimeField-notExists-" + name}
              variant="caption"
              color="textSecondary"
            >
              &#8708;
            </Typography>
          </Tooltip>
        )}
      </Grid>
      {valueAjv !== undefined && valueAjv.errors.length > 0 && (
        <Grid item id={"DateTimeField-ajvError-" + name} xs={12}>
          <Typography variant="caption" color="error">
            {valueAjv.errors.join(" & ")}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
