import type { StandardSchemaV1 } from "@standard-schema/spec";

export type DataModelId = string | number;

export interface DataModel {
  id: DataModelId;
  [key: PropertyKey]: unknown;
}

type RemappedOmit<T, K extends PropertyKey> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

export type OmitId<D extends DataModel> = RemappedOmit<D, "id">;

export type DataFieldFormValue =
  | string
  | string[]
  | number
  | boolean
  | File
  | null;

export type DataFieldRenderFormField<
  F extends DataFieldFormValue = DataFieldFormValue
> = ({
  value,
  onChange,
  error,
}: {
  value: F;
  onChange: (value: F) => void | Promise<void>;
  error: string | null;
}) => React.ReactNode;

export type DataField<F extends DataFieldFormValue = DataFieldFormValue> = {
  field: string;
  headerName?: string;
  width?: number;
  /**
   * Define o tipo de dado para filtragem/edição:
   * - "string"
   * - "number"
   * - "boolean"
   * - "date"
   * - "file"
   */
  type?: "string" | "number" | "boolean" | "date" | "file";
  renderFormField?: DataFieldRenderFormField<F>;
};

export interface PaginationModel {
  page: number;
  pageSize: number;
}

export interface SortModel {
  field: string;
  sort: "asc" | "desc";
}

/** Operadores de filtro, variam conforme o tipo da coluna */
export type FilterOperatorString = "contains" | "equals" | "startsWith";
export type FilterOperatorNumber = "equals" | "gt" | "lt";
export type FilterOperatorBoolean = "equals";
export type FilterOperatorDate = "equals" | "before" | "after";

export type FilterOperator =
  | FilterOperatorString
  | FilterOperatorNumber
  | FilterOperatorBoolean
  | FilterOperatorDate;

/**
 * Modelo de filtro:
 * - field: nome do campo
 * - operator: tipo específico de operador
 * - value: valor (string, number, boolean ou Date)
 */
export interface FilterModel {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | Date;
}

export interface DataSource<D extends DataModel> {
  fields: DataField[];
  getMany?: (params: {
    paginationModel: PaginationModel;
    sortModel: SortModel[];
    filterModel: FilterModel[];
  }) =>
    | { items: D[]; itemCount: number }
    | Promise<{ items: D[]; itemCount: number }>;
  getOne?: (id: DataModelId) => D | Promise<D>;
  createOne?: (data: Partial<OmitId<D>>) => D | Promise<D>;
  updateOne?: (id: DataModelId, data: Partial<OmitId<D>>) => D | Promise<D>;
  deleteOne?: (id: DataModelId) => void | Promise<void>;
  validate?: (
    value: Partial<OmitId<D>>
  ) => ReturnType<
    StandardSchemaV1<Partial<OmitId<D>>>["~standard"]["validate"]
  >;
}
