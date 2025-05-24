// AppTextField.jsx
import TextField from "@mui/material/TextField";

const AppTextField = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 1,
  className = "",
  ...props
}) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    multiline={multiline}
    rows={rows}
    margin="normal"
    variant="outlined"
    className={`bg-white dark:bg-[#271243] text-indigo-900 dark:text-gray-100 border border-purple-300 dark:border-purple-700 rounded ${className}`}
    InputLabelProps={{
      className: "text-indigo-700 dark:text-purple-300",
      shrink: true,
    }}
    {...props}
  />
);

export default AppTextField;
