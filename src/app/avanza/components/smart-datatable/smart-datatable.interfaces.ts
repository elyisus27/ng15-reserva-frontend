export interface DataTableColumn {
  name: string;
  title: string;
  width?: string;
  align?: string;
  template?: (row: any) => string;
}

export interface DataTableAction {
  icon?: string;
  label?: string;
  tooltip?: string;
  color?: 'primary' | 'danger' | 'success' | 'secondary' | 'warning';
  fn: (row: any) => void;
}

export interface DataTableResponse {
  success: boolean;
  data: {
    items: any[];
    totalItems: number;
  };
}
