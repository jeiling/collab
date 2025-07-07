import React from "react";

type Column<T, K extends keyof T = keyof T> = {
  title: string;
  dataIndex?: K;
  key: string;
  render?: (value: T[K], record: T, index: number) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  dataSource: T[];
  rowKey: (record: T) => string | number;
  loading?: boolean;
  className?: string;
  emptyText?: string;
};

export default function EnhancedTable<T>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  className = "",
  emptyText = "無資料",
}: Props<T>) {
  return (
    <div
      className={`w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}
    >
      <div className="max-h-[500px] overflow-y-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left font-medium text-gray-600 tracking-wide"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  <span className="animate-pulse">載入中...</span>
                </td>
              </tr>
            ) : dataSource.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              dataSource.map((record, index) => (
                <tr
                  key={rowKey(record)}
                  className="hover:bg-gray-50 border-b border-gray-100 transition"
                >
                  {columns.map((col) => {
                    const value = col.dataIndex
                      ? record[col.dataIndex]
                      : undefined;
                    return (
                      <td key={col.key} className="px-6 py-4 align-middle">
                        {col.render
                          ? col.render(value as T[keyof T], record, index)
                          : (value as React.ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
