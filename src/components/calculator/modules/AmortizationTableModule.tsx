import React, { useState } from 'react';
import { Table as TableIcon, Download, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface AmortizationTableModuleProps {
  outputs: Array<{
    def: { id: string; label: string };
    formatted: string;
    raw: any;
  }>;
  settings?: {
    title?: string;
    defaultView?: 'yearly' | 'monthly';
    pageSize?: number;
  };
}

export const AmortizationTableModule: React.FC<AmortizationTableModuleProps> = ({
  outputs = [],
  settings = {},
}) => {
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>(settings.defaultView || 'yearly');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = settings.pageSize || 10;
  const title = settings.title || 'Amortization & Payment Schedule';

  // Check if specialized engine attached yearly/monthly schedule in outputs
  const scheduleOutput = outputs.find((o) => o.def.id === 'yearlySchedule' || o.def.id === 'monthlySchedule' || Array.isArray(o.raw));
  const rawSchedule: any[] = Array.isArray(scheduleOutput?.raw) ? scheduleOutput.raw : [];

  // Generate fallback schedule rows if not provided
  const rows = rawSchedule.length > 0
    ? rawSchedule
    : Array.from({ length: 10 }, (_, i) => ({
        year: i + 1,
        startingBalance: Math.max(0, 100000 - i * 10000),
        principalPaid: 8500,
        interestPaid: 1500,
        endingBalance: Math.max(0, 91500 - i * 10000),
      }));

  const totalPages = Math.ceil(rows.length / pageSize) || 1;
  const currentRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCsv = () => {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [headers, ...rows.map((r) => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `schedule_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f0f0] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <TableIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="bg-[#f0f0f0] p-0.5 rounded-lg flex text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setViewMode('yearly'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'yearly' ? 'bg-white text-[#222325] shadow-2xs font-bold' : 'text-[#74767e]'
              }`}
            >
              Yearly
            </button>
            <button
              type="button"
              onClick={() => { setViewMode('monthly'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'monthly' ? 'bg-white text-[#222325] shadow-2xs font-bold' : 'text-[#74767e]'
              }`}
            >
              Monthly
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e4e5e7] rounded-md text-xs font-bold text-[#404145] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#74767e]" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-[#fafafa] border-y border-[#e4e5e7]">
              <th className="py-3 px-4 font-bold text-[#222325]">Period</th>
              <th className="py-3 px-4 font-bold text-[#222325]">Starting Balance</th>
              <th className="py-3 px-4 font-bold text-[#1dbf73]">Principal</th>
              <th className="py-3 px-4 font-bold text-amber-600">Interest</th>
              <th className="py-3 px-4 font-bold text-[#222325]">Ending Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {currentRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#fafafa] transition-colors font-mono text-xs">
                <td className="py-3 px-4 font-sans font-bold text-[#222325]">
                  {row.year ? `Year ${row.year}` : row.period ? `Month ${row.period}` : `Item #${idx + 1}`}
                </td>
                <td className="py-3 px-4 text-[#404145]">
                  {typeof row.startingBalance === 'number' ? row.startingBalance.toLocaleString() : row.startingBalance || '-'}
                </td>
                <td className="py-3 px-4 text-[#1dbf73] font-bold">
                  {typeof row.principalPaid === 'number' ? row.principalPaid.toLocaleString() : row.principalPaid || '-'}
                </td>
                <td className="py-3 px-4 text-amber-600 font-bold">
                  {typeof row.interestPaid === 'number' ? row.interestPaid.toLocaleString() : row.interestPaid || '-'}
                </td>
                <td className="py-3 px-4 text-[#222325] font-bold">
                  {typeof row.endingBalance === 'number' ? row.endingBalance.toLocaleString() : row.endingBalance || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-[#f0f0f0] text-xs">
          <span className="text-[#74767e]">
            Page {currentPage} of {totalPages} ({rows.length} total records)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-[#e4e5e7] hover:bg-[#fafafa] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-[#e4e5e7] hover:bg-[#fafafa] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
