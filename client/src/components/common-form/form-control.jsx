import React from "react";
import { TextField, MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";

function FormControls({ formControls = [], formData, setFormData }) {
  // Function to render form control elements based on their type
  function renderComponentByType(controlItem) {
    const currentControlValue = formData[controlItem.name] || "";

    switch (controlItem.componentType) {
      case "input":
        return (
          <TextField
            id={controlItem.name}
            name={controlItem.name}
            label={controlItem.label}
            placeholder={controlItem.placeholder}
            type={controlItem.type || "text"}
            value={currentControlValue}
            fullWidth
            variant="outlined"
            onChange={(event) =>
              setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              })
            }
          />
        );

      case "select":
        return (
          <FormControl fullWidth variant="outlined">
            <InputLabel id={`${controlItem.name}-label`}>
              {controlItem.label}
            </InputLabel>
            <Select
              labelId={`${controlItem.name}-label`}
              id={controlItem.name}
              value={currentControlValue}
              label={controlItem.label}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [controlItem.name]: event.target.value,
                })
              }
            >
              {controlItem.options?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "textarea":
        return (
          <TextField
            id={controlItem.name}
            name={controlItem.name}
            label={controlItem.label}
            placeholder={controlItem.placeholder}
            value={currentControlValue}
            fullWidth
            variant="outlined"
            multiline
            rows={controlItem.rows || 4}
            onChange={(event) =>
              setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              })
            }
          />
        );

      default:
        return (
          <TextField
            id={controlItem.name}
            name={controlItem.name}
            label={controlItem.label}
            placeholder={controlItem.placeholder}
            type={controlItem.type || "text"}
            value={currentControlValue}
            fullWidth
            variant="outlined"
            onChange={(event) =>
              setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              })
            }
          />
        );
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {formControls.map((controlItem) => (
        <Box key={controlItem.name}>
          {renderComponentByType(controlItem)}
        </Box>
      ))}
    </Box>
  );
}

export default FormControls;
