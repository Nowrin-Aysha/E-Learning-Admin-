import React from "react";
import { Button, Box } from "@mui/material";
import FormControls from "./form-controls";

function CommonForm({
  handleSubmit,
  buttonText = "Submit",
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) {
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        mt: 3,
        width: "100%",
      }}
    >
      {/* Render form controls */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Submit button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isButtonDisabled}
        sx={{
          mt: 2,
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
}

export default CommonForm;
