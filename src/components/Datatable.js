import {
  faLongArrowAltDown,
  faLongArrowAltUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "./elements/Pagination";

const Datatable = ({
  page = 1,
  rowsPerPage = 0,
  totalPages = 0,
  totalRows = 0,
  totalPagesFiltered = 0,
  totalRowsFiltered = 0,
  columns = [],
  rows = () => {},
  sortBy = [],
  searchOnChange = () => {},
  pageOnChange = () => {},
  rowsOnChange = () => {},
  sortByOnChange = () => {},
}) => {
  const handleSortedTable = (e) => {
    const active = e.currentTarget.getElementsByClassName("text-black");
    const firstChild = e.currentTarget.firstElementChild;
    const lastChild = e.currentTarget.lastElementChild;
    if (active.length > 0) {
      if (firstChild.classList.contains("text-black")) {
        sortByOnChange(lastChild.dataset);
      } else {
        sortByOnChange(firstChild.dataset);
      }
    } else {
      sortByOnChange(firstChild.dataset);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-y-2 items-center font-montserrat text-sm text-gray-500">
        <div className="col-span-full md:col-span-6 font-bold text-center md:text-left tracking-wide">
          Baris per halaman:
          <select
            className="appearance-none bg-white text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-100 px-3.5 py-1.5 ml-2"
            value={rowsPerPage}
            onChange={(e) => rowsOnChange(parseInt(e.target.value))}>
            <option value="2">2</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
          </select>
        </div>

        <div className="col-span-full md:col-span-6 flex items-center justify-center md:justify-end">
          <div className="font-bold mr-2">Cari</div>
          <input
            type="text"
            className="text-sm border rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full md:w-auto px-2 py-1.5"
            placeholder="Masukkan kata kunci..."
            onChange={(e) => searchOnChange(e.target.value) }
          />
        </div>
      </div>

      <div className="relative overflow-x-auto pb-4 my-4">
        <table
          className="font-montserrat text-sm border w-full"
          cellPadding="10">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => {
                return (
                  <th key={index} className="border">
                    <div className="relative items-center justify-between space-x-2">
                      <span className="text-gray-600">{column.label}</span>
                      {column.disabled ? null : (
                        <div
                          className="absolute -top-2.5 -right-2 text-gray-400 cursor-pointer space-x-0.5"
                          style={{ fontSize: "10px" }}
                          onClick={handleSortedTable}>
                          <FontAwesomeIcon
                            icon={faLongArrowAltUp}
                            data-field={column.field}
                            data-direction="asc"
                            className={
                              sortBy.field === column.field &&
                              sortBy.direction === "asc"
                                ? "text-black"
                                : ""
                            }
                          />
                          <FontAwesomeIcon
                            icon={faLongArrowAltDown}
                            data-field={column.field}
                            data-direction="desc"
                            className={
                              sortBy.field === column.field &&
                              sortBy.direction === "desc"
                                ? "text-black"
                                : ""
                            }
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </table>
      </div>

      <Pagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        totalRows={totalRows}
        totalPagesFiltered={totalPagesFiltered}
        totalRowsFiltered={totalRowsFiltered}
        pageOnChange={(value) => pageOnChange(value)}
      />
    </>
  );
};

export default Datatable;
