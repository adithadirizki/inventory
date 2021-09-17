import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonOutline } from "./Button";

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
          <ButtonOutline
            onClick={() => pageOnChange(1)}
            disabled={page <= 1 ? true : false}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </ButtonOutline>
          <ButtonOutline
            onClick={() => pageOnChange(page - 1)}
            disabled={page <= 1 ? true : false}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </ButtonOutline>
          {slice().map((value, index) => {
            if (page === value + 1) {
              return (
                <Button key={value} onClick={() => pageOnChange(value + 1)}>
                  {value + 1}
                </Button>
              );
            } else {
              return (
                <ButtonOutline
                  key={value}
                  onClick={() => pageOnChange(value + 1)}>
                  {value + 1}
                </ButtonOutline>
              );
            }
          })}
          <ButtonOutline
            onClick={() => pageOnChange(page + 1)}
            disabled={page >= totalPagesFiltered ? true : false}>
            <FontAwesomeIcon icon={faAngleRight} />
          </ButtonOutline>
          <ButtonOutline
            onClick={() => pageOnChange(totalPagesFiltered)}
            disabled={page === totalPagesFiltered ? true : false}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </ButtonOutline>
        </div>
      </div>
    </>
  );
};

export default Pagination;
