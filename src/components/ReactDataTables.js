import React, { useEffect, useRef } from "react";
import $ from "jquery"; // Import jQuery
import "datatables.net"; // Import DataTables
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css"; // Import CSS file for DataTables with Bootstrap 4 styling

function ReactDataTables(props) {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      dataTableRef.current = $(tableRef.current).DataTable();
    } else {
      dataTableRef.current = $(tableRef.current).DataTable();
    }

    return () => {
      dataTableRef.current.destroy();
    };
  }, [props]);

  return <table ref={tableRef}></table>;
}

export default ReactDataTables;
