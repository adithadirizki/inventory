import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Modal from "../../components/elements/Modal";
import { Button, ButtonLight } from "../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";
import Datatable from "../../components/Datatable";
import { CSVLink } from "react-csv";

const Tr = styled.tr`
  :nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const DataSupplier = () => {
  const initialStateFormDataDeleteSupplier = { _id: "", nama_supplier: "" };
  const [dataSupplier, setDataSupplier] = useState(null);
  const columns = [
    { label: "No", field: "_id" },
    { label: "Nama Supplier", field: "nama_supplier" },
    { label: "No telp", field: "no_telp" },
    { label: "Alamat", field: "alamat" },
    { label: "Aksi", field: "aksi", disabled: true },
  ];
  const headersCSV = [
    { label: "Supplier", key: "nama_supplier" },
    { label: "No telp", key: "no_telp" },
    { label: "Alamat", key: "alamat" },
  ];
  const [dataCSV, setDataCSV] = useState([]);
  const [sortBy, setSortBy] = useState({
    field: "_id",
    direction: "desc",
  });
  const [dataTable, setDataTable] = useState({
    q: "",
    page: 1,
    rowsPerPage: 10,
    totalPages: 0,
    totalRows: 0,
    totalPagesFiltered: 0,
    totalRowsFiltered: 0,
  });
  const [showModalDeleteSupplier, setShowModalDeleteSupplier] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: 200,
    message: "",
    error: false,
    duration: 3000,
  });
  const [formDataDeleteSupplier, setFormDataDeleteSupplier] = useState(
    initialStateFormDataDeleteSupplier
  );
  const history = useHistory();

  const fetchSupplier = async () => {
    await api
      .get("/supplier", {
        params: {
          q: dataTable.q,
          page: dataTable.page,
          rows: dataTable.rowsPerPage,
          sortby: `${sortBy.field}.${sortBy.direction}`,
        },
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataSupplier(response.data);
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            data.push({
              nama_supplier: value.nama_supplier,
              no_telp: `'${value.no_telp}`,
              alamat: value.alamat,
            });
          });
          return data;
        });
        setDataTable((state) => ({
          ...state,
          totalPages: Math.ceil(
            parseInt(response.data.total_rows) / state.rowsPerPage
          ),
          totalRows: parseInt(response.data.total_rows),
          totalPagesFiltered: Math.ceil(
            parseInt(response.data.total_rows_filtered) / state.rowsPerPage
          ),
          totalRowsFiltered: parseInt(response.data.total_rows_filtered),
        }));
      })
      .catch((error) => {
        // Unauthorized
        console.log(error);
        if (error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        setAlert({
          ...alert,
          status: 500,
          message: "Internal server error!",
          error: true,
        });
        setShowAlert(true);
      });
  };

  const handleSubmitDeleteSupplier = async () => {
    setShowAlert(false);
    setShowLoading(true);

    await api
      .delete(`/supplier/${formDataDeleteSupplier._id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchSupplier();
        setAlert({ ...alert, ...response.data });
        setShowAlert(true); // show alert
        setShowModalDeleteSupplier(false); // hide modal
        setFormDataDeleteSupplier(initialStateFormDataDeleteSupplier); // reset form
      })
      .catch((error) => {
        // Unauthorized
        console.log(error);
        if (error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        setAlert({
          ...alert,
          status: 500,
          message: "Internal server error!",
          error: true,
        });
        setShowAlert(true);
      });
    setShowLoading(false);
  };

  const DataRows = () => {
    if (!dataSupplier || dataSupplier.data.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan={columns.length}>Data Kosong</td>
        </tr>
      );
    }

    return dataSupplier.data.map((value, index) => {
      const no = (dataTable.page - 1) * dataTable.rowsPerPage;
      return (
        <Tr key={index}>
          <td className="border text-center">{no + (index + 1)}</td>
          <td className="border">{value.nama_supplier}</td>
          <td className="border text-center">{value.no_telp}</td>
          <td className="border">{value.alamat}</td>
          <td className="border">
            <div className="flex items-center justify-center text-xs space-x-1">
              <ButtonLight
                variant="pill"
                onClick={() => {
                  history.push(`/supplier/${value._id}/edit`);
                }}>
                Edit
              </ButtonLight>
              <ButtonLight
                theme="red"
                variant="pill"
                onClick={() => {
                  setShowModalDeleteSupplier(true);
                  setFormDataDeleteSupplier({
                    _id: value._id,
                    nama_supplier: value.nama_supplier,
                  });
                }}>
                Hapus
              </ButtonLight>
            </div>
          </td>
        </Tr>
      );
    });
  };

  useEffect(() => {
    fetchSupplier();
  }, [dataTable.q, dataTable.rowsPerPage, dataTable.page, sortBy]);

  return (
    <>
      <Helmet>
        <title>Data Supplier | INVENTORY</title>
      </Helmet>
      {showLoading ? (
        <div className="fixed bg-transparent w-full h-full z-30">
          <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <Loading>
              <div className="font-montserrat mt-2">loading...</div>
            </Loading>
          </div>
        </div>
      ) : null}
      <Alert
        show={showAlert}
        {...alert}
        afterClose={() => setShowAlert(false)}
      />
      <Modal
        show={showModalDeleteSupplier}
        afterClose={() => setShowModalDeleteSupplier(false)}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-4">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Hapus Supplier
            </div>
            <button
              onClick={() => {
                setShowModalDeleteSupplier(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <div className="text-sm">
            Anda yakin ingin menghapus supplier{" "}
            <strong>{formDataDeleteSupplier.nama_supplier}</strong>?
          </div>
          <div className="flex justify-between text-sm space-x-2 mt-8">
            <Button
              theme="red"
              onClick={() => {
                setShowModalDeleteSupplier(false);
              }}>
              Batal
            </Button>
            <Button theme="green" onClick={handleSubmitDeleteSupplier}>
              Ya
            </Button>
          </div>
        </Card>
      </Modal>

      <Card>
        <div className="font-montserrat font-bold text-gray-500 text-xl mb-6">
          Data Supplier
        </div>
        <Button
          className="mb-4"
          onClick={() => {
            history.push("/supplier/tambah");
          }}>
          Tambah Supplier
        </Button>

        <ButtonLight className="text-sm ml-4">
          <FontAwesomeIcon icon={faFileAlt} />
          <CSVLink
            className="ml-2"
            headers={headersCSV}
            data={dataCSV}
            filename="Data_Supplier_INVENTORY.csv"
            target="_blank">
            Export
          </CSVLink>
        </ButtonLight>

        <Datatable
          page={dataTable.page}
          rowsPerPage={dataTable.rowsPerPage}
          totalPages={dataTable.totalPages}
          totalRows={dataTable.totalRows}
          totalPagesFiltered={dataTable.totalPagesFiltered}
          totalRowsFiltered={dataTable.totalRowsFiltered}
          columns={columns}
          rows={DataRows}
          sortBy={sortBy}
          searchOnChange={(value) =>
            setDataTable((state) => ({
              ...state,
              q: value,
              page: 1,
            }))
          }
          pageOnChange={(value) =>
            setDataTable((state) => ({ ...state, page: value }))
          }
          rowsOnChange={(value) =>
            setDataTable((state) => ({
              ...state,
              page: 1,
              rowsPerPage: value,
            }))
          }
          sortByOnChange={(value) => setSortBy(value)}
        />
      </Card>
    </>
  );
};

export default DataSupplier;
