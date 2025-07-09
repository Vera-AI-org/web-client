// DataGrid.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type {
  DataField,
  DataSource,
  DataModel,
  FilterModel,
} from "@customTypes/data";
import { DataGrid } from "@components/datagrid/DataGrid";

interface Row extends DataModel {
  id: number;
  name: string;
  age: number;
}

const rows: Row[] = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 },
  { id: 3, name: "Charlie", age: 35 },
  { id: 4, name: "Daniel", age: 28 },
  { id: 5, name: "Eve", age: 32 },
];

const dataSource: DataSource<Row> = {
  fields: [],
  getMany: async ({ paginationModel, sortModel, filterModel = [] }) => {
    let items = [...rows];

    // Filtragem com tipagem segura
    filterModel.forEach(({ field, operator, value }: FilterModel) => {
      items = items.filter((item) => {
        const cell = item[field as keyof Row];
        const stringValue = String(value);
        const numericValue = Number(value);

        switch (operator) {
          case "contains":
            return String(cell).includes(stringValue);
          case "startsWith":
            return String(cell).startsWith(stringValue);
          case "equals":
            return cell === value;
          case "gt":
            return Number(cell) > numericValue;
          case "lt":
            return Number(cell) < numericValue;
          case "before":
          case "after": {
            const cellDate = new Date(String(cell));
            const valueDate = new Date(stringValue);
            return operator === "before"
              ? cellDate < valueDate
              : cellDate > valueDate;
          }
          default:
            return true;
        }
      });
    });

    // Ordenação tipada
    if (sortModel.length) {
      const { field, sort } = sortModel[0];
      items.sort((a, b) => {
        const va = a[field as keyof Row];
        const vb = b[field as keyof Row];

        if (va === undefined || vb === undefined) return 0;

        if (typeof va === "number" && typeof vb === "number") {
          return sort === "asc" ? va - vb : vb - va;
        }

        const strA = String(va);
        const strB = String(vb);
        return sort === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }

    // Paginação
    const start = paginationModel.page * paginationModel.pageSize;
    const paged = items.slice(start, start + paginationModel.pageSize);

    return {
      items: paged,
      itemCount: items.length,
    };
  },
};

const meta = {
  title: "Components/DataGrid",
  component: DataGrid,
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns: DataField[] = [
  { field: "id", headerName: "ID", width: 70, type: "number" },
  { field: "name", headerName: "Nome", width: 150, type: "string" },
  { field: "age", headerName: "Idade", width: 100, type: "number" },
];

export const ServerWithInitialState: Story = {
  args: {
    columns,
    dataSource,
    title: "Usuários (modo servidor)",
    initialState: {
      paginationModel: { page: 0, pageSize: 5 },
      sortModel: [{ field: "name", sort: "asc" }],
      filterModel: [],
    },
  },
};

export const ClientAllRows: Story = {
  args: {
    columns,
    rows,
    title: "Usuários (modo cliente)",
  },
};
