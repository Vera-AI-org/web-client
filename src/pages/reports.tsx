import { useParams } from "react-router";
import { Crud } from "@toolpad/core/Crud";
import { Report, reportsCache, reportsDataSource } from "../data/reports";
import { ptBR } from "@mui/x-data-grid/locales";
import { ptBR as pickersPtBr } from "@mui/x-date-pickers/locales";

export const ReportsCrudPage = () => {
  const { reportId } = useParams();

  return (
    <Crud<Report>
      dataSource={reportsDataSource}
      dataSourceCache={reportsCache}
      rootPath="/reports"
      initialPageSize={25}
      defaultValues={{
        itemCount: 1,
        createdAt: new Date().toString(),
      }}
      pageTitles={{
        show: `Relatório ${reportId}`,
        create: "Novo Relatório",
      }}
      slotProps={{
        form: {
          datePicker: {
            format: "DD/MM/YYYY",
            localeText:
              pickersPtBr.components.MuiLocalizationProvider.defaultProps
                .localeText,
          },
        },
        list: {
          dataGrid: {
            localText: ptBR.components.MuiDataGrid.defaultProps.localeText,
            initialState: {
              columns: {
                columnVisibilityModel: {
                  employees: false,
                  substitues: false,
                  paychecks: false,
                  receipts_paychecks: false,
                  receipts: false,
                },
              },
            },
          },
        },
      }}
    />
  );
};
