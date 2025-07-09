// DataGrid.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Popover,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectItem,
  TextField,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableSortLabel,
  Chip,
  Button,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GetAppIcon from "@mui/icons-material/GetApp";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import type {
  DataModel,
  DataField,
  DataSource,
  PaginationModel,
  SortModel,
  FilterModel,
  FilterOperator,
} from "@customTypes/data";

export interface DataGridProps<D extends DataModel> {
  columns: DataField[];
  rows?: D[];
  dataSource?: DataSource<D>;
  initialState?: {
    paginationModel?: PaginationModel;
    sortModel?: SortModel[];
    filterModel?: FilterModel[];
  };
  title?: React.ReactNode;
  paginationOptions?: number[];
}

export const DataGrid = <D extends DataModel>({
  columns,
  rows: clientRows,
  dataSource,
  initialState = {},
  title,
  paginationOptions = [5, 10, 25],
}: DataGridProps<D>) => {
  const isClientMode = Array.isArray(clientRows);

  // State management
  const [pagination, setPagination] = useState<PaginationModel>({
    page: initialState.paginationModel?.page || 0,
    pageSize: initialState.paginationModel?.pageSize || paginationOptions[0],
  });

  const [sortModel, setSortModel] = useState<SortModel[]>(
    initialState.sortModel ?? []
  );
  const [filterModel, setFilterModel] = useState<FilterModel[]>(
    initialState.filterModel ?? []
  );
  const [rows, setRows] = useState<D[]>(clientRows ?? []);
  const [rowCount, setRowCount] = useState(clientRows ? clientRows.length : 0);
  const [loading, setLoading] = useState(false);

  // Menu and popover states
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuField, setMenuField] = useState<string>("");
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [toolbarFilterAnchor, setToolbarFilterAnchor] =
    useState<HTMLElement | null>(null);
  const [columnsAnchorEl, setColumnsAnchorEl] = useState<HTMLElement | null>(
    null
  );

  // Filter and column management
  const [tempOperator, setTempOperator] = useState<FilterOperator>("contains");
  const [tempValue, setTempValue] = useState<string | number | boolean | Date>(
    ""
  );
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [editingFilterField, setEditingFilterField] = useState<string | null>(
    null
  );
  const [newFilterField, setNewFilterField] = useState<string>(
    columns[0]?.field || ""
  );

  // Fetch data when dependencies change
  useEffect(() => {
    if (isClientMode) {
      let data = [...clientRows!];

      // Apply filters
      filterModel.forEach(({ field, operator, value }) => {
        data = data.filter((item) => {
          const cell = item[field as keyof D];
          switch (operator) {
            case "contains":
              return String(cell).includes(String(value));
            case "startsWith":
              return String(cell).startsWith(String(value));
            case "equals":
              return cell === value;
            case "gt":
              return (cell as number) > (value as number);
            case "lt":
              return (cell as number) < (value as number);
            case "before":
              return new Date(cell as string) < new Date(value as string);
            case "after":
              return new Date(cell as string) > new Date(value as string);
            default:
              return true;
          }
        });
      });

      // Apply sorting
      if (sortModel.length) {
        const { field, sort } = sortModel[0];
        data.sort((a, b) => {
          const va = a[field as keyof D];
          const vb = b[field as keyof D];
          if (va == null || vb == null) return 0;
          if (va > vb) return sort === "asc" ? 1 : -1;
          if (va < vb) return sort === "asc" ? -1 : 1;
          return 0;
        });
      }

      setRowCount(data.length);
      setRows(data);
      return;
    }

    // Server-side data fetching
    const fetchData = async () => {
      if (!dataSource?.getMany) return;
      setLoading(true);
      try {
        const result = await dataSource.getMany({
          paginationModel: pagination,
          sortModel,
          filterModel,
        });
        setRows(result.items);
        setRowCount(result.itemCount);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    isClientMode,
    clientRows,
    dataSource,
    pagination,
    sortModel,
    filterModel,
  ]);

  // Column visibility management
  const toggleColumnVisibility = (field: string) => {
    setHiddenColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  };

  const visibleColumns = columns.filter((c) => !hiddenColumns.has(c.field));

  // Pagination handlers
  const handleChangePage = (_: unknown, newPage: number) =>
    setPagination((p) => ({ ...p, page: newPage }));

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPagination({ page: 0, pageSize: +e.target.value });

  // Sorting handlers
  const handleColumnSortClick = (field: string) => {
    const existing = sortModel.find((s) => s.field === field);
    if (!existing) {
      setSortModel([{ field, sort: "asc" }]);
    } else if (existing.sort === "asc") {
      setSortModel([{ field, sort: "desc" }]);
    } else {
      setSortModel([]);
    }
  };

  // Column menu handlers
  const openColumnMenu = (field: string, anchor: HTMLElement) => {
    setMenuField(field);
    setMenuAnchor(anchor);
  };

  const closeColumnMenu = () => setMenuAnchor(null);

  const applySort = (direction: "asc" | "desc" | "clear") => {
    if (direction === "clear") {
      setSortModel((m) => m.filter((s) => s.field !== menuField));
    } else {
      setSortModel([{ field: menuField, sort: direction }]);
    }
    closeColumnMenu();
  };

  // Filter management
  const openFilterPopover = () => {
    const existing = filterModel.find((f) => f.field === menuField);
    setTempOperator(existing?.operator ?? "contains");
    setTempValue(existing?.value ?? "");
    setFilterAnchor(menuAnchor);
    setEditingFilterField(menuField);
    closeColumnMenu();
  };

  const applyFilter = () => {
    if (!editingFilterField) return;

    setFilterModel((m) => {
      const others = m.filter((f) => f.field !== editingFilterField);
      if (
        tempValue === "" ||
        tempValue === false ||
        (tempValue instanceof Date && isNaN(tempValue.getTime()))
      ) {
        return others;
      }
      return [
        ...others,
        { field: editingFilterField, operator: tempOperator, value: tempValue },
      ];
    });
    setFilterAnchor(null);
    setToolbarFilterAnchor(null);
    setEditingFilterField(null);
  };

  const removeFilter = (field: string) => {
    setFilterModel((m) => m.filter((f) => f.field !== field));
  };

  const clearFilters = () => setFilterModel([]);

  const openToolbarFilter = (event: React.MouseEvent<HTMLElement>) => {
    setToolbarFilterAnchor(event.currentTarget);
    setEditingFilterField(null);
    setTempOperator("contains");
    setTempValue("");
  };

  const hasFilterOnColumn = (field: string) =>
    filterModel.some((f) => f.field === field);

  // Operator utilities
  const getOperatorsForType = (type?: string) => {
    if (type === "number") return ["equals", "gt", "lt"] as FilterOperator[];
    if (type === "boolean") return ["equals"] as FilterOperator[];
    if (type === "date")
      return ["equals", "before", "after"] as FilterOperator[];
    return ["contains", "equals", "startsWith"] as FilterOperator[];
  };

  const operatorLabels: Record<string, string> = {
    contains: "Contém",
    equals: "Igual",
    startsWith: "Inicia com",
    gt: "Maior que",
    lt: "Menor que",
    before: "Antes de",
    after: "Depois de",
  };

  // New filter management
  const addNewFilter = () => {
    if (!newFilterField) return;
    if (
      tempValue === "" ||
      tempValue === false ||
      (tempValue instanceof Date && isNaN(tempValue.getTime()))
    )
      return;

    setFilterModel((m) => {
      const others = m.filter((f) => f.field !== newFilterField);
      return [
        ...others,
        { field: newFilterField, operator: tempOperator, value: tempValue },
      ];
    });
    setTempValue("");
  };

  return (
    <Paper>
      {title && (
        <Toolbar>
          <Box
            flexGrow={1}
            textAlign="left"
            display="flex"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
          >
            <Typography variant="h6">{title}</Typography>
          </Box>

          <IconButton title="Filtros" onClick={openToolbarFilter}>
            <Badge
              badgeContent={filterModel.length}
              color="primary"
              invisible={filterModel.length === 0}
            >
              <FilterListIcon
                color={filterModel.length > 0 ? "primary" : "inherit"}
              />
            </Badge>
          </IconButton>

          <IconButton
            title="Gerenciar colunas"
            onClick={(e) => setColumnsAnchorEl(e.currentTarget)}
          >
            <ViewColumnIcon />
          </IconButton>

          <IconButton title="Exportar" onClick={() => alert("Exportar")}>
            <GetAppIcon />
          </IconButton>
        </Toolbar>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumns.map((col) => {
                const sortItem = sortModel.find((s) => s.field === col.field);
                const filtered = hasFilterOnColumn(col.field);

                return (
                  <TableCell key={col.field} style={{ width: col.width }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <TableSortLabel
                        active={!!sortItem}
                        direction={sortItem?.sort ?? "asc"}
                        onClick={() => handleColumnSortClick(col.field)}
                      >
                        {col.headerName || col.field}
                        {filtered && (
                          <FilterListIcon
                            fontSize="small"
                            color="primary"
                            sx={{
                              ml: 0.5,
                              opacity: 0.8,
                            }}
                          />
                        )}
                      </TableSortLabel>
                      <IconButton
                        size="small"
                        onClick={(e) =>
                          openColumnMenu(col.field, e.currentTarget)
                        }
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} align="center">
                  Carregando…
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={String(row.id)}>
                  {visibleColumns.map((col) => (
                    <TableCell key={col.field}>
                      {
                        (row as Record<string, unknown>)[
                          col.field
                        ] as React.ReactNode
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} align="center">
                  Nenhum dado
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {!isClientMode && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={rowCount}
                  page={pagination.page}
                  rowsPerPage={pagination.pageSize}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={paginationOptions}
                  labelRowsPerPage={"Itens por página"}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>

      {/* Column menu */}
      <Menu
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={closeColumnMenu}
      >
        <MenuItem onClick={() => applySort("asc")}>Ordenar ↑</MenuItem>
        <MenuItem onClick={() => applySort("desc")}>Ordenar ↓</MenuItem>
        <MenuItem onClick={() => applySort("clear")}>Limpar ordenação</MenuItem>

        <Divider />

        <MenuItem onClick={openFilterPopover}>Filtrar…</MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            toggleColumnVisibility(menuField);
            closeColumnMenu();
          }}
        >
          {hiddenColumns.has(menuField) ? "Mostrar coluna" : "Ocultar coluna"}
        </MenuItem>
      </Menu>

      {/* Column filter popover */}
      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => {
          setFilterAnchor(null);
          setEditingFilterField(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box p={2} display="flex" flexDirection="column" width={260}>
          <FormControl margin="dense" fullWidth>
            <InputLabel shrink>Operador</InputLabel>
            <Select
              value={tempOperator}
              label="Operador"
              onChange={(e) =>
                setTempOperator(e.target.value as FilterOperator)
              }
            >
              {getOperatorsForType(
                editingFilterField
                  ? columns.find((c) => c.field === editingFilterField)?.type
                  : undefined
              ).map((op) => (
                <SelectItem key={op} value={op}>
                  {operatorLabels[op]}
                </SelectItem>
              ))}
            </Select>
          </FormControl>

          {(() => {
            const type = editingFilterField
              ? columns.find((c) => c.field === editingFilterField)?.type
              : undefined;

            if (type === "number") {
              return (
                <TextField
                  margin="dense"
                  label="Valor"
                  type="number"
                  value={tempValue as number}
                  onChange={(e) => setTempValue(+e.target.value)}
                />
              );
            }
            if (type === "boolean") {
              return (
                <Box display="flex" alignItems="center" mt={1}>
                  <Checkbox
                    checked={Boolean(tempValue)}
                    onChange={(e) => setTempValue(e.target.checked)}
                  />
                  <Typography>Verdadeiro?</Typography>
                </Box>
              );
            }
            if (type === "date") {
              return (
                <TextField
                  margin="dense"
                  label="Data"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={
                    tempValue instanceof Date
                      ? tempValue.toISOString().substring(0, 10)
                      : ""
                  }
                  onChange={(e) => setTempValue(new Date(e.target.value))}
                />
              );
            }
            return (
              <TextField
                margin="dense"
                label="Valor"
                value={tempValue as string}
                onChange={(e) => setTempValue(e.target.value)}
              />
            );
          })()}

          <Box mt={2} textAlign="right">
            <Button
              variant="contained"
              size="small"
              onClick={applyFilter}
              disabled={tempValue === "" || tempValue === false}
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Toolbar filter popover */}
      <Popover
        open={Boolean(toolbarFilterAnchor)}
        anchorEl={toolbarFilterAnchor}
        onClose={() => setToolbarFilterAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ p: 2 }}
      >
        <Box p={2} width={320} maxWidth="100%">
          <Typography variant="subtitle1" mb={1}>
            Filtros ativos
          </Typography>

          <Stack spacing={1} mb={2} direction="row" flexWrap="wrap">
            {filterModel.length === 0 && (
              <Typography color="textSecondary" fontSize="0.875rem">
                Nenhum filtro aplicado
              </Typography>
            )}
            {filterModel.map((f) => {
              const col = columns.find((c) => c.field === f.field);
              if (!col) return null;
              return (
                <Chip
                  key={f.field}
                  label={`${col.headerName ?? f.field} ${
                    operatorLabels[f.operator]
                  } ${String(f.value)}`}
                  onDelete={() => removeFilter(f.field)}
                  onClick={(e) => {
                    setMenuField(f.field);
                    setTempOperator(f.operator);
                    setTempValue(f.value);
                    setEditingFilterField(f.field);
                    setFilterAnchor(e.currentTarget);
                    setToolbarFilterAnchor(null);
                  }}
                  color="primary"
                  variant="outlined"
                />
              );
            })}
          </Stack>

          <Divider />

          <Typography variant="subtitle1" mt={2} mb={1}>
            Adicionar filtro
          </Typography>

          <FormControl margin="dense" fullWidth>
            <InputLabel>Coluna</InputLabel>
            <Select
              value={newFilterField}
              label="Coluna"
              onChange={(e) => setNewFilterField(e.target.value)}
            >
              {columns.map((col) => (
                <SelectItem key={col.field} value={col.field}>
                  {col.headerName ?? col.field}
                </SelectItem>
              ))}
            </Select>
          </FormControl>

          <FormControl margin="dense" fullWidth>
            <InputLabel>Operador</InputLabel>
            <Select
              value={tempOperator}
              label="Operador"
              onChange={(e) =>
                setTempOperator(e.target.value as FilterOperator)
              }
            >
              {getOperatorsForType(
                columns.find((c) => c.field === newFilterField)?.type
              ).map((op) => (
                <SelectItem key={op} value={op}>
                  {operatorLabels[op]}
                </SelectItem>
              ))}
            </Select>
          </FormControl>

          {(() => {
            const type = columns.find((c) => c.field === newFilterField)?.type;
            if (type === "number") {
              return (
                <TextField
                  margin="dense"
                  label="Valor"
                  type="number"
                  value={tempValue as number}
                  onChange={(e) => setTempValue(+e.target.value)}
                />
              );
            }
            if (type === "boolean") {
              return (
                <Box display="flex" alignItems="center" mt={1}>
                  <Checkbox
                    checked={Boolean(tempValue)}
                    onChange={(e) => setTempValue(e.target.checked)}
                  />
                  <Typography>Verdadeiro?</Typography>
                </Box>
              );
            }
            if (type === "date") {
              return (
                <TextField
                  margin="dense"
                  label="Data"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={
                    tempValue instanceof Date
                      ? tempValue.toISOString().substring(0, 10)
                      : ""
                  }
                  onChange={(e) => setTempValue(new Date(e.target.value))}
                />
              );
            }
            return (
              <TextField
                margin="dense"
                label="Valor"
                value={tempValue as string}
                onChange={(e) => setTempValue(e.target.value)}
              />
            );
          })()}

          <Box mt={2} textAlign="right">
            <Button
              variant="contained"
              size="small"
              onClick={addNewFilter}
              disabled={tempValue === "" || tempValue === false}
            >
              Adicionar
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={clearFilters}
              sx={{ ml: 1 }}
              disabled={filterModel.length === 0}
            >
              Limpar todos
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Column management popover */}
      <Popover
        open={Boolean(columnsAnchorEl)}
        anchorEl={columnsAnchorEl}
        onClose={() => setColumnsAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="subtitle1" gutterBottom>
            Colunas visíveis
          </Typography>
          <List dense>
            {columns.map((column) => (
              <ListItem key={column.field} disablePadding>
                <ListItemButton
                  onClick={() => toggleColumnVisibility(column.field)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={!hiddenColumns.has(column.field)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={column.headerName || column.field}
                    secondary={column.type}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setHiddenColumns(new Set());
                setColumnsAnchorEl(null);
              }}
            >
              Mostrar todas
            </Button>
          </Box>
        </Box>
      </Popover>
    </Paper>
  );
};
