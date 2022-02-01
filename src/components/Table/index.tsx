import React, { useMemo } from "react";
import { useTable, usePagination } from "react-table";
import "./styles.css";

const Table = ({ haveFile, data }: any) => {
  const columns = useMemo(
    () => [
      {
        // first group - TV Show
        Header: "Produtos",
        // First group columns
        columns: [
          {
            Header: "Nome",
            accessor: "ProductName",
          },
        ],
      },
      {
        // first group - TV Show
        Header: "ID",
        // First group columns
        columns: [
          {
            Header: "ID - Vendedor",
            accessor: "SellerId",
          },
          {
            Header: "ID - Item",
            accessor: "ItemId",
          },
        ],
      },
      {
        // first group - TV Show
        Header: "Status",
        // First group columns
        columns: [
          {
            Header: "Status",
            accessor: "status",
          },
        ],
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    setPageSize,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any, i: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Página{" "}
          <strong>
            {haveFile ? pageIndex + 1 : pageIndex} de {pageOptions.length}
          </strong>{" "}
        </span>
      </div>
    </>
  );
};

export default Table;
