import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pagination = ({
  page = 0,
  rowsPerPage = 0,
  totalPages = 0,
  totalRows = 0,
  totalPagesFiltered = 0,
  totalRowsFiltered = 0,
  pageOnChange = () => {},
}) => {
  const paging = Array.from(Array(totalPagesFiltered).keys());
  const step = 3;

  const slice = () => {
    if (totalPagesFiltered >= step) {
      if (page + step > totalPagesFiltered) {
        return paging.slice(totalPagesFiltered - step);
      } else {
        return paging.slice(page - 1, step + (page - 1));
      }
    } else {
      return paging;
    }
  };

  const showRows = () => {
    const start = (page - 1) * rowsPerPage;
    const left = totalRowsFiltered % rowsPerPage;
    if (page === totalPagesFiltered && totalRowsFiltered % rowsPerPage !== 0) {
      if (totalRowsFiltered === totalRows) {
        return `${start + 1} - ${start + left} dari ${totalRowsFiltered} data`;
      }

      return `${start + 1} - ${
        start + left
      } dari ${totalRowsFiltered} data (total ${totalRows} data)`;
    } else {
      // if total rows filtered === 0
      if (totalRowsFiltered === 0) {
        return `${0} - ${0} dari ${totalRowsFiltered} data (total ${totalRows} data)`;
      } else if (totalRowsFiltered === totalRows) {
        // if total rows === 0
        if (totalRows === 0) {
          return `${0} - ${0} dari ${totalRowsFiltered} data`;
        }

        return `${start + 1} - ${
          start + rowsPerPage
        } dari ${totalRowsFiltered} data`;
      }

      return `${start + 1} - ${
        start + rowsPerPage
      } dari ${totalRowsFiltered} data (total ${totalRows} data)`;
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 items-center font-montserrat text-sm">
        <div className="col-span-full md:col-span-4 text-center md:text-left mb-1 md:mb-0">
          <div className="font-montserrat font-bold text-base tracking-wide text-gray-500">
            {showRows()}
          </div>
        </div>

        <div className="col-span-full md:col-span-8 flex justify-center md:justify-end space-x-1">
          <button
            className="border border-indigo-300 hover:bg-indigo-50 text-indigo-600 rounded disabled:opacity-50 disabled:cursor-default focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
            onClick={() => pageOnChange(1)}
            disabled={page <= 1 ? true : false}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <button
            className="border border-indigo-300 hover:bg-indigo-50 text-indigo-600 rounded disabled:opacity-50 disabled:cursor-default focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
            onClick={() => pageOnChange(page - 1)}
            disabled={page <= 1 ? true : false}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          {slice().map((value, index) => {
            // active page
            if (page === value + 1) {
              return (
                <button
                  key={value}
                  className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
                  onClick={() => pageOnChange(value + 1)}>
                  {value + 1}
                </button>
              );
            } else {
              return (
                <button
                  key={value}
                  className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
                  onClick={() => pageOnChange(value + 1)}>
                  {value + 1}
                </button>
              );
            }
          })}
          <button
            className="border border-indigo-300 hover:bg-indigo-50 text-indigo-600 rounded disabled:opacity-50 disabled:cursor-default focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
            onClick={() => pageOnChange(page + 1)}
            disabled={page >= totalPagesFiltered ? true : false}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button
            className="border border-indigo-300 hover:bg-indigo-50 text-indigo-600 rounded disabled:opacity-50 disabled:cursor-default focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
            onClick={() => pageOnChange(totalPagesFiltered)}
            disabled={page >= totalPagesFiltered ? true : false}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination;
