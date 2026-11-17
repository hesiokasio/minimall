'use client';

import React from 'react';
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

interface TablePaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function TablePagination({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 20, 50],
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startEntry = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems);

  const getPaginationGroup = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  if (totalItems === 0) return null;
  
  return (
    <div className="px-5 py-3.5 border-t border-zinc-200/80 bg-zinc-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
      
      {/* سمت چپ: بج خلاصه وضعیت و انتخابگر تعداد ردیف در صفحه */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-zinc-200/80 shadow-2xs text-zinc-600">
          <span>Showing</span>
          <span className="font-semibold text-zinc-900 tabular-nums">{startEntry}–{endEntry}</span>
          <span>of</span>
          <span className="font-semibold text-zinc-900 tabular-nums">{totalItems}</span>
        </div>

        {onItemsPerPageChange && (
          <>
            <div className="hidden sm:block h-4 w-[1px] bg-zinc-200" />
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium">Rows per page</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    onItemsPerPageChange(Number(e.target.value));
                    onPageChange(1); // برگشت اتوماتیک به صفحه ۱ بعد از تغییر سایز
                  }}
                  className="appearance-none h-7 pl-2.5 pr-7 text-xs font-semibold text-zinc-800 bg-white border border-zinc-200/90 rounded-md shadow-2xs hover:border-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors cursor-pointer tabular-nums"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* سمت راست: نشانگر صفحه و دکمه‌های ناوبری یکپارچه */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-zinc-500 tabular-nums hidden md:inline-block">
          Page <strong className="text-zinc-900 font-semibold">{currentPage}</strong> of <strong className="text-zinc-900 font-semibold">{totalPages}</strong>
        </span>

        <div className="inline-flex items-center bg-white border border-zinc-200/90 rounded-lg p-0.5 shadow-2xs">
          {/* پرش به صفحه اول */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="First Page"
            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          {/* صفحه قبل */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            title="Previous Page"
            className="px-2 h-7 rounded-md flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="h-4 w-[1px] bg-zinc-200 mx-0.5" />

          {/* شماره صفحات */}
          <div className="flex items-center gap-0.5 px-0.5">
            {getPaginationGroup().map((item, index) =>
              item === '...' ? (
                <span key={`dots-${index}`} className="w-7 h-7 flex items-center justify-center text-zinc-400 text-xs select-none">
                  &hellip;
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => onPageChange(item as number)}
                  className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-semibold flex items-center justify-center transition-all tabular-nums ${
                    currentPage === item
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="h-4 w-[1px] bg-zinc-200 mx-0.5" />

          {/* صفحه بعد */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalItems === 0}
            title="Next Page"
            className="px-2 h-7 rounded-md flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* پرش به صفحه آخر */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalItems === 0}
            title="Last Page"
            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}