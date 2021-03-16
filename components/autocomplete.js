import React from "react";
import styles from "./styles/autocomplete.module.scss";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AutoComplete = ({ textFieldProps, ...props }) => {
  const {
    form: { setTouched, setFieldValue }
  } = props;
  const { error, helperText, ...field } = props;

  return (
    <Autocomplete
      required={true}
      className={styles.pms}
      multiple
      options={top100Films}
      disableCloseOnSelect
      getOptionLabel={option => option.toString()}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected}
          />
          {option}
        </React.Fragment>
      )}
      style={{ width: 500 }}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="TAs to be assigned reviews"
        />
      )}
      {...props}
      {...field}
      onChange={(_, value) => setFieldValue("TA", value)}
      onBlur={() => setTouched({ ["TA"]: true })}
      renderInput={props => (
        <TextField
          {...props}
          {...textFieldProps}
          helperText={helperText}
          error={error}
        />
      )}
    />
  );
};

export default AutoComplete;

const top100Films = [1, 2];
