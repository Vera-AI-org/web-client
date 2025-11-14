import { API_URL } from '@constants/AppContants';

export const fileUploadDataSource = {
  uploadFile: async ({
    file,
    token,
  }: {
    file: File;
    token?: string;
  }): Promise<{ document_md: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/document/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro no upload do arquivo: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro no uploadFile:', error);
      throw error;
    }
  },

  uploadMultiple: async ({
    template_ids,
    files,
    token,
  }: {
    template_ids: string[];
    files: File[];
    token?: string;
  }): Promise<{ results: any[] }> => {
    try {
      const formData = new FormData();
      template_ids.forEach((id) => formData.append('template_ids', id));
      files.forEach((file) => formData.append('files', file));

      const response = await fetch(`${API_URL}/document/process`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro no upload múltiplo: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro no uploadMultiple:', error);
      throw error;
    }
  },
};
