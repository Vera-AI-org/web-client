import { DataModel, DataSource, DataSourceCache } from "@toolpad/core/Crud";
import { z } from "zod";
import StyledFileInput from "../components/StyledFileInput";
import { Chip } from "@mui/material";

type ReportSeverity = "LOW" | "MEDIUM" | "HIGH";

type Issue = {
  id: number;
  severity: ReportSeverity;
  code: string;
};

export interface Report extends DataModel {
  id: number;
  companyName: string;
  severity: ReportSeverity;
  issues: Issue[];
  createdAt: string;

  employees?: File | null;
  substitues?: File | null;
  paychecks?: File | null;
  receipts_paychecks?: File | null;
  receipts?: File | null;
}

// Dados iniciais
const INITIAL_REPORT_STORE = [
  {
    id: 1,
    companyName: "ACME Corp",
    severity: "HIGH",
    createdAt: "2025-07-17T10:30:00Z",
    issues: [
      { id: 101, severity: "HIGH", code: "ERR001" },
      { id: 102, severity: "MEDIUM", code: "WRN001" },
    ],
  },
  {
    id: 2,
    companyName: "Beta Ltda",
    severity: "MEDIUM",
    createdAt: "2025-07-16T14:20:00Z",
    issues: [
      { id: 201, severity: "MEDIUM", code: "WRN002" },
      { id: 202, severity: "LOW", code: "INF001" },
    ],
  },
  {
    id: 3,
    companyName: "Zeta Inc",
    severity: "LOW",
    createdAt: "2025-07-15T09:10:00Z",
    issues: [{ id: 301, severity: "LOW", code: "INF002" }],
  },
];

// Armazenamento local
const getReportsStore = (): Report[] => {
  const value = localStorage.getItem("reports-store");
  const parsed = value ? JSON.parse(value) : INITIAL_REPORT_STORE;

  return parsed.map((report: any) => ({
    ...report,
    createdAt: new Date(report.createdAt),
  }));
};

const setReportsStore = (value: Report[]) => {
  return localStorage.setItem("reports-store", JSON.stringify(value));
};

const renderSeverityCell = (value: ReportSeverity) => {
  const colorMap = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "error",
  } as const;

  return <Chip label={value} color={colorMap[value]} size="small" />;
};

// DataSource
export const reportsDataSource: DataSource<Report> = {
  fields: [
    { field: "id", headerName: "ID" },
    {
      field: "createdAt",
      headerName: "Data de criação",
      type: "date",
      renderCell: ({ value }) => new Date(value).toLocaleDateString("pt-BR"),
      flex: 1,
    },
    {
      field: "companyName",
      headerName: "Empresa",
      type: "singleSelect",
      valueOptions: ["ACME Corp", "Beta Ltda", "Zeta Inc"],
      flex: 1,
    },
    {
      field: "employees",
      headerName: "Funcionários",
      hideable: true,
      renderFormField: ({ value, onChange }) => (
        <StyledFileInput
          label="Funcionários"
          file={value as File | null}
          onChange={onChange}
          accept=".pdf"
        />
      ),
    },
    {
      field: "substitues",
      headerName: "Substitutos",
      hideable: true,
      renderFormField: ({ value, onChange }) => (
        <StyledFileInput
          label="Substitutos"
          file={value as File | null}
          onChange={onChange}
          accept=".pdf"
        />
      ),
    },
    {
      field: "paychecks",
      headerName: "Contracheques",
      hideable: true,
      renderFormField: ({ value, onChange }) => (
        <StyledFileInput
          label="Contracheques"
          file={value as File | null}
          onChange={onChange}
          accept=".pdf"
        />
      ),
    },
    {
      field: "receipts_paychecks",
      headerName: "Comprovantes de pagamento",
      hideable: true,
      renderFormField: ({ value, onChange }) => (
        <StyledFileInput
          label="Comprovantes de Pagamentos"
          file={value as File | null}
          onChange={onChange}
          accept=".pdf"
        />
      ),
    },
    {
      field: "receipts",
      headerName: "Recibos de Cesta Básica",
      hideable: true,
      renderFormField: ({ value, onChange }) => (
        <StyledFileInput
          label="Recibos de Cesta Básica"
          file={value as File | null}
          onChange={onChange}
          accept=".pdf"
        />
      ),
      flex: 1,
    },
    {
      field: "severity",
      headerName: "Severidade",
      renderFormField: () => <></>,
      renderCell: ({ value }) => renderSeverityCell(value),
    },
  ],

  getMany: async () => {
    const reports = getReportsStore();
    return {
      items: reports,
      itemCount: reports.length,
    };
  },

  getOne: async (id) => {
    const reports = getReportsStore();
    const report = reports.find((r) => r.id === Number(id));
    if (!report) throw new Error("Report not found");
    return report;
  },

  createOne: async (data) => {
    const reports = getReportsStore();

    const newReport: Report = {
      id: reports.reduce((max, r) => Math.max(max, r.id), 0) + 1,
      companyName: data.companyName ?? "Empresa Exemplo",
      severity: "MEDIUM",
      createdAt: data.createdAt ?? new Date().toLocaleDateString("pt-BR"),
      issues: [{ id: 999, severity: "MEDIUM", code: "SIMULADO01" }],

      employees: data.employees ?? null,
      substitues: data.substitues ?? null,
      paychecks: data.paychecks ?? null,
      receipts_paychecks: data.receipts_paychecks ?? null,
      receipts: data.receipts ?? null,
    };

    setReportsStore([...reports, newReport]);
    return newReport;
  },
  validate: z.object({
    companyName: z.string().min(1, "Nome da empresa é obrigatório"),
    createdAt: z.string().min(1, "Data de criação é obrigatória"),
    employees: z.instanceof(File),
    substitues: z.instanceof(File),
    paychecks: z.instanceof(File),
    receipts_paychecks: z.instanceof(File),
    receipts: z.instanceof(File),

    severity: z.string().optional(),
    issues: z.array(z.any()).optional(),
    id: z.number().optional(),
  })["~standard"].validate,
};

export const reportsCache = new DataSourceCache();
