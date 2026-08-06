import React from 'react';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { Inbox } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick
}: DataTableProps<T>) {
  if (loading) {
    return <SkeletonLoader type="table" rows={5} />;
  }

  if (data.length === 0) {
    return (
      <div className="py-12 border border-gray-200 rounded-lg bg-white">
        <EmptyState 
          icon={<Inbox className="w-12 h-12 text-gray-300" />} 
          title={emptyMessage} 
        />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className={`px-6 py-3 font-medium ${col.width ? `w-[${col.width}]` : ''} ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => onRowClick?.(row)}
              className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex} 
                  className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
