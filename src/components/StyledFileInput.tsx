import * as React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface StyledFileInputProps {
  label: string;
  file: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
}

const StyledFileInput: React.FC<StyledFileInputProps> = ({
  label,
  file,
  onChange,
  accept = "image/*",
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState(file?.name || "");

  React.useEffect(() => {
    setFileName(file?.name || "");
  }, [file]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFileName(selectedFile?.name || "");
    onChange?.(selectedFile);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        variant="outlined"
        label={label}
        value={fileName}
        fullWidth
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          "& .MuiInputBase-input": {
            color: fileName ? "inherit" : "#999",
          },
        }}
      />
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      {fileName && (
        <Button
          onClick={() => {
            setFileName("");
            onChange?.(null);
          }}
        >
          Limpar
        </Button>
      )}
    </Box>
  );
};

export default StyledFileInput;
