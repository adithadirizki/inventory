import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Modal from "../../components/elements/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";
import Datatable from "../../components/Datatable";
import moment from "moment";
import { CSVLink } from "react-csv";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";

const Tr = styled.tr`
  :nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const DataPengguna = () => {
  const initialStateFormDataDeletePengguna = { username: "", nama: "" };
  const [dataPengguna, setDataPengguna] = useState(null);
  const columns = [
    { label: "No", field: "created_at", disabled: true },
    { label: "Username", field: "username" },
    { label: "Nama", field: "nama" },
    { label: "Email", field: "email" },
    { label: "No telp", field: "no_telp" },
    { label: "Role", field: "role" },
    { label: "Status", field: "status" },
    { label: "Tgl terdaftar", field: "created_at" },
    { label: "Aksi", field: "aksi", disabled: true },
  ];
  const headersCSV = [
    { label: "Username", key: "username" },
    { label: "Nama", key: "nama" },
    { label: "Email", key: "email" },
    { label: "No telp", key: "no_telp" },
    { label: "Role", key: "role" },
    { label: "Status", key: "status" },
    { label: "Tgl terdaftar", key: "created_at" },
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
  const [showModalDeletePengguna, setShowModalDeletePengguna] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const [formDataDeletePengguna, setFormDataDeletePengguna] = useState(
    initialStateFormDataDeletePengguna
  );
  const history = useHistory();

  const fetchPengguna = async () => {
    setShowLoading(true);

    await api
      .get("/pengguna", {
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
        setDataPengguna(response.data);
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            data.push({
              username: value.username,
              nama: value.nama,
              email: value.email,
              no_telp: `'${value.no_telp}`,
              role: value.role,
              status: value.status === 1 ? "Aktif" : "Nonaktif",
              created_at: moment(value.created_at).format("YYYY MM DD"),
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
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        setAlert({ message: "Internal server error!", error: true });
        setShowAlert(true);
      });

    setShowLoading(false);
  };

  const handleSubmitDeletePengguna = async () => {
    setShowLoading(true);

    await api
      .delete(`/pengguna/${formDataDeletePengguna.username}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchPengguna();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalDeletePengguna(false); // hide modal
        setFormDataDeletePengguna(initialStateFormDataDeletePengguna); // reset form
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        setAlert({ message: "Internal server error!", error: true });
        setShowAlert(true);
      });

    setShowLoading(false);
  };

  const DataRows = () => {
    if (!dataPengguna || dataPengguna.data.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan={columns.length}>Data Kosong</td>
        </tr>
      );
    }

    return dataPengguna.data.map((value, index) => {
      const no = (dataTable.page - 1) * dataTable.rowsPerPage;
      return (
        <Tr key={index}>
          <td className="border text-center">{no + (index + 1)}</td>
          <td className="border">{value.username}</td>
          <td className="border">{value.nama}</td>
          <td className="border">{value.email}</td>
          <td className="border text-center">{value.no_telp}</td>
          <td className="border text-center">{value.role}</td>
          <td className="border text-center">
            {value.status === 1 ? "Aktif" : "Non-aktif"}
          </td>
          <td className="border text-center">
            {moment(value.created_at).format("YYYY-MM-DD")}
          </td>
          <td className="border">
            <div className="flex items-center justify-center text-xs space-x-1">
              <button
                className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
                onClick={() => {
                  history.push(`/pengguna/${value.username}/edit`);
                }}>
                Edit
              </button>
              {value.role === "staff" ||
              value.username !== sessionStorage.getItem("username") ? (
                <button
                  className="border border-red-300 bg-red-50 hover:bg-red-200 text-red-600 rounded-full focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
                  onClick={() => {
                    setShowModalDeletePengguna(true);
                    setFormDataDeletePengguna({
                      username: value.username,
                      nama: value.nama,
                    });
                  }}>
                  Hapus
                </button>
              ) : null}
            </div>
          </td>
        </Tr>
      );
    });
  };

  useEffect(() => {
    fetchPengguna();
  }, [dataTable.q, dataTable.rowsPerPage, dataTable.page, sortBy]);

  return (
    <>
      <Helmet>
        <title>Data Pengguna | INVENTORY</title>
      </Helmet>
      {showLoading ? (
        <div className="fixed bg-transparent w-full h-full z-30">
          <div
            className="fixed top-1/2 left-1/2 text-white transform -translate-y-1/2 -translate-x-1/2 rounded-lg px-8 py-3"
            style={{ backgroundColor: "#00000097" }}>
            <Loading>
              <div className="font-montserrat text-gray-300 mt-2">
                Loading...
              </div>
            </Loading>
          </div>
        </div>
      ) : null}
      <Alert
        show={showAlert}
        afterClose={() => {
          setShowAlert(false);
        }}>
        {alert.error ? (
          <div
            className={`bg-red-300 font-bold text-sm text-white rounded-lg px-8 py-3`}>
            {alert.message}
          </div>
        ) : (
          <div
            className={`bg-green-300 font-bold text-sm text-white rounded-lg px-8 py-3`}>
            {alert.message}
          </div>
        )}
      </Alert>

      <Modal
        show={showModalDeletePengguna}
        afterClose={() => setShowModalDeletePengguna(false)}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-4">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Hapus Pengguna
            </div>
            <button
              onClick={() => {
                setShowModalDeletePengguna(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <div className="text-sm">
            Anda yakin ingin menghapus pengguna{" "}
            <strong className="font-lato">{formDataDeletePengguna.nama}</strong>
            ?
          </div>
          <div className="flex justify-between text-sm space-x-2 mt-8">
            <button
              className="bg-red-500 hover:bg-red-400 text-red-100 rounded focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
              onClick={() => {
                setShowModalDeletePengguna(false);
              }}>
              Batal
            </button>
            <button
              className="bg-green-500 hover:bg-green-400 text-green-100 rounded focus:ring focus:ring-green-100 focus:outline-none px-4 py-1.5"
              onClick={handleSubmitDeletePengguna}>
              Ya
            </button>
          </div>
        </Card>
      </Modal>

      <Card className="font-montserrat">
        <div className="font-bold text-gray-500 text-xl mb-6">
          Data Pengguna
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 mr-2 mb-4"
          onClick={() => {
            history.push("/pengguna/tambah");
          }}>
          Tambah Pengguna
        </button>

        <CSVLink
          className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 ml-2"
          headers={headersCSV}
          data={dataCSV}
          filename="Data_Pengguna_INVENTORY.csv"
          target="_blank">
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          Export
        </CSVLink>

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

export default DataPengguna;
