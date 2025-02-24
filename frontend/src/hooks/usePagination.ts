import { useState } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialRowsPerPage?: number;
  totalCount: number;
}

export function usePagination({
  initialPage = 0,
  initialRowsPerPage = 10,
  totalCount
}: UsePaginationProps) {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    totalPages: Math.ceil(totalCount / rowsPerPage)
  };
} 
