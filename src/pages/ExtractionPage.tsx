import { useState } from 'react';
import {
  Container,
  Select,
  Stack,
  Typography,
  MenuItem,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FileUpload } from '@components/FileUpload';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { templateDataSources, Template } from '@datasources/template';
import { useSession } from '@hooks/useSession';
import imgPdf from '@assets/images/ImgPdf.png';
import { fileUploadDataSource } from '@datasources/upload';
import { useNotifications } from '@toolpad/core';

export const mockGetManyTemplates = async (): Promise<Template[]> => {
  return Promise.resolve([
    { id: 1, name: 'RG Frente', pattern_ids: ['p1', 'p2'] },
    { id: 2, name: 'RG Verso', pattern_ids: ['p3'] },
    { id: 3, name: 'CNH', pattern_ids: ['p7', 'p8'] },
  ]);
};

export const ExtractionPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const { session } = useSession();
  const token = session?.user.token;

  const notifications = useNotifications();

  const { data: templates } = useQuery<Template[], Error>(
    ['templates', token],
    async () => {
      if (!token) return [];
      return templateDataSources.getMany(token);
      // return mockGetManyTemplates();
    },
    { enabled: !!token }
  );

  const { mutate, isLoading: isSubmitting } = useMutation(
    async ({
      template_ids,
      files,
      token,
    }: {
      template_ids: string[];
      files: File[];
      token?: string;
    }) => {
      if (files.length === 0) throw new Error('Nenhum arquivo enviado');
      if (files.length > 2) throw new Error('Máximo de 2 arquivos permitidos');
      if (template_ids.length !== files.length)
        throw new Error('Cada documento precisa ter um template');

      return fileUploadDataSource.uploadMultiple({
        template_ids,
        files,
        token,
      });
    },
    {
      onSuccess: () => {
        setOpenDialog(true);
        setFiles([]);
        setSelectedTemplates([]);
        setOpen([]);

        notifications.show('Documentos enviados com sucesso!', {
          severity: 'success',
        });
      },
      onError: (err) =>
        notifications.show('Erro ao enviar documentos: ' + err.message, {
          severity: 'error',
        }),
    }
  );

  const handleAddFile = (file: File | null) => {
    if (!file) return;

    if (files.length >= 2) {
      notifications.show('Limite de 2 documentos atingido', {
        severity: 'warning',
      });
      return;
    }

    setFiles((prev) => [...prev, file]);
    setSelectedTemplates((prev) => [...prev, '']);
    setOpen((prev) => [...prev, true]);
  };

  const handleRemoveFile = (i: number) => {
    setOpen((prev) => {
      const copy = [...prev];
      copy[i] = false;
      return copy;
    });

    setTimeout(() => {
      setFiles((prev) => prev.filter((_, idx) => idx !== i));
      setSelectedTemplates((prev) => prev.filter((_, idx) => idx !== i));
      setOpen((prev) => prev.filter((_, idx) => idx !== i));
    }, 200);
  };

  const handleTemplateChange = (i: number, templateId: string) => {
    const updated = [...selectedTemplates];
    updated[i] = templateId;
    setSelectedTemplates(updated);
  };

  const handleSubmit = () => {
    if (
      files.length === 0 ||
      selectedTemplates.length !== files.length ||
      selectedTemplates.some((t) => !t)
    ) {
      notifications.show('Preencha todos os templates antes de enviar', {
        severity: 'warning',
      });
      return;
    }

    mutate({ template_ids: selectedTemplates, files, token });
  };

  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Stack
        alignItems="center"
        sx={{ width: '100%', maxWidth: 500, textAlign: 'center', mb: 10 }}
      >
        <Box
          sx={{
            width: 263,
            height: 263,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 0.5,
          }}
        >
          <img
            src={imgPdf}
            alt="Upload Pdf Image"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Selecione os documentos
        </Typography>

          <FileUpload
          file={null}
          onChange={handleAddFile}
          sx={{
            width: '100%',
            height: 49,
            backgroundColor: '#fff',
            borderRadius: 1,
            border: '1px solid #ccc',
            mb: 3,
          }}
        />

        <Box sx={{ width: '100%', mt: 1 }}>
          {files.map((file, i) => (
            <Collapse key={i} in={open[i]} timeout={200}>
              <Paper
                elevation={2}
                sx={{
                  width: '100%',
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  background: '#fafafa',
                  border: '1px solid #e3e3e3',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: 'left',
                      wordBreak: 'break-word',
                    }}
                  >
                    {file.name}
                  </Typography>

                  <IconButton size="small" onClick={() => handleRemoveFile(i)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Select
                  fullWidth
                  value={selectedTemplates[i] ?? ''}
                  displayEmpty
                  onChange={(e) => handleTemplateChange(i, e.target.value)}
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: 1,
                    height: 48,
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecionar template
                  </MenuItem>

                  {templates?.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </Paper>
            </Collapse>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={files.length === 0 || isSubmitting}
          sx={{
            width: '40%',
            height: 60,
            backgroundColor: '#7B57C2',
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: 1,
            mb: 1,
          }}
        >
          Enviar
        </Button>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Envio realizado</DialogTitle>
          <DialogContent>
            <Typography>
              Documentos enviados com sucesso! Você receberá um e-mail com os
              dados processados.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};
