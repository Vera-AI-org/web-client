// ALTERAÇÃO: Mantidas as props antigas, inclusive sx.
// Alterado layout para ser apenas um Button que seleciona ou limpa o arquivo.

import { FC } from 'react';
import { Button } from '@mui/material';
import { SxProps, Theme } from '@mui/material';

interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  sx?: SxProps<Theme>;
}

export const FileUpload: FC<FileUploadProps> = ({ file, onChange, sx }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onChange(selectedFile);
  };

  const handleClearFile = () => {
    onChange(null);
  };

  return (
    <>
      <input
        type="file"
        accept="application/pdf"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* ALTERAÇÃO: único botão controlando selecionar/limpar */}
      {!file ? (
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            sx={{
              bgcolor: '#6750A4',
              '&:hover': { bgcolor: '#6750A4' },
              textTransform: 'none',
              ...sx,
            }}
          >
            Selecionar PDF
          </Button>
        </label>
      ) : (
        <Button
          variant="outlined"
          onClick={handleClearFile}
          sx={{
            textTransform: 'none',
            ...sx,
          }}
        >
          Remover: {file.name}
        </Button>
      )}
    </>
  );
};
