import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Modal from "../../components/elements/Modal";
import { Button, ButtonLight } from "../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";
import Datatable from "../../components/Datatable";
import moment from "moment";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import { CSVLink } from "react-csv";

const Tr = styled.tr`
  :nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const DataBarangKeluar = () => {
  const initialStateFormDataDeleteBarangKeluar = { no_transaksi: "" };
  const [dataBarangKeluar, setDataBarangKeluar] = useState(null);
  const columns = [
    { label: "No", field: "created_at", disabled: true },
    { label: "No Transaksi", field: "no_transaksi" },
    { label: "Nama Barang", field: "nama_barang", disabled: true },
    { label: "Kuantitas", field: "kuantitas" },
    { label: "Harga Jual", field: "harga_jual", disabled: true },
    { label: "Total Harga", field: "total_harga", disabled: true },
    { label: "User", field: "username", disabled: true },
    { label: "Tgl Keluar", field: "created_at" },
    { label: "Aksi", field: "aksi", disabled: true },
  ];
  const headersCSV = [
    { label: "No Transaksi", key: "no_transaksi" },
    { label: "Nama Barang", key: "nama_barang" },
    { label: "Kuantitas", key: "kuantitas" },
    { label: "Harga Jual", key: "harga_jual" },
    { label: "Total Harga", key: "total_harga" },
    { label: "User", key: "username" },
    { label: "Tgl Keluar", key: "created_at" },
  ];
  const [dataCSV, setDataCSV] = useState([]);
  const [sortBy, setSortBy] = useState({
    field: "no_transaksi",
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
  const [showModalDeleteBarangKeluar, setShowModalDeleteBarangKeluar] =
    useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const [formDataDeleteBarangKeluar, setFormDataDeleteBarangKeluar] = useState(
    initialStateFormDataDeleteBarangKeluar
  );
  const history = useHistory();

  const fetchBarangKeluar = async () => {
    setShowLoading(true);

    await api
      .get("/barang_keluar", {
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
        setDataBarangKeluar(response.data);
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            data.push({
              no_transaksi: value.no_transaksi,
              nama_barang: value.barang_keluar.nama_barang,
              kuantitas: value.kuantitas,
              harga_jual: value.harga_jual,
              total_harga: value.harga_jual * value.kuantitas,
              username: value.user_input.nama,
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

  const handleSubmitDeleteBarangKeluar = async () => {
    setShowLoading(true);

    await api
      .delete(`/barang_keluar/${formDataDeleteBarangKeluar.no_transaksi}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchBarangKeluar();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalDeleteBarangKeluar(false); // hide modal
        setFormDataDeleteBarangKeluar(initialStateFormDataDeleteBarangKeluar); // reset form
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
    if (!dataBarangKeluar || dataBarangKeluar.data.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan={columns.length}>Data Kosong</td>
        </tr>
      );
    }

    return dataBarangKeluar.data.map((value, index) => {
      const no = (dataTable.page - 1) * dataTable.rowsPerPage;
      return (
        <Tr key={index}>
          <td className="border text-center">{no + (index + 1)}</td>
          <td className="border text-center font-lato">{value.no_transaksi}</td>
          <td className="border">{value.barang_keluar.nama_barang}</td>
          <td className="border text-center">{value.kuantitas}</td>
          <td className="border text-right">{`Rp ${value.harga_jual.toLocaleString(
            { style: "currency", currency: "IDR" }
          )}/${value.barang_keluar.id_satuan.nama_satuan}`}</td>
          <td className="border text-right">{`Rp ${(
            value.harga_jual * value.kuantitas
          ).toLocaleString({ style: "currency", currency: "IDR" })}`}</td>
          <td className="border text-center">{value.user_input.nama}</td>
          <td className="border text-center">
            {moment(value.created_at).format("YYYY-MM-DD")}
          </td>
          <td className="border">
            <div className="flex items-center justify-center text-xs space-x-1">
              <button
                className="border border-red-300 bg-red-50 hover:bg-red-200 text-red-600 rounded-full focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
                onClick={() => {
                  setShowModalDeleteBarangKeluar(true);
                  setFormDataDeleteBarangKeluar({
                    no_transaksi: value.no_transaksi,
                  });
                }}>
                Hapus
              </button>
            </div>
          </td>
        </Tr>
      );
    });
  };

  useEffect(() => {
    fetchBarangKeluar();
  }, [dataTable.q, dataTable.rowsPerPage, dataTable.page, sortBy]);

  return (
    <>
      <Helmet>
        <title>Data Barang Keluar | INVENTORY</title>
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
        show={showModalDeleteBarangKeluar}
        afterClose={() => setShowModalDeleteBarangKeluar(false)}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-4">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Hapus Transaksi Barang Keluar
            </div>
            <button
              onClick={() => {
                setShowModalDeleteBarangKeluar(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <div className="text-sm">
            Anda yakin ingin menghapus Transaksi{" "}
            <strong className="font-lato">
              {formDataDeleteBarangKeluar.no_transaksi}
            </strong>
            ?
          </div>
          <div className="flex justify-between text-sm space-x-2 mt-8">
            <button
              className="bg-red-500 hover:bg-red-400 text-red-100 rounded focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
              onClick={() => {
                setShowModalDeleteBarangKeluar(false);
              }}>
              Batal
            </button>
            <button
              className="bg-green-500 hover:bg-green-400 text-green-100 rounded focus:ring focus:ring-green-100 focus:outline-none px-4 py-1.5"
              onClick={handleSubmitDeleteBarangKeluar}>
              Ya
            </button>
          </div>
        </Card>
      </Modal>

      <Card className="font-montserrat">
        <div className="font-bold text-gray-500 text-xl mb-6">
          Data Barang Keluar
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 mr-2 mb-4"
          onClick={() => {
            history.push("/barang_keluar/tambah");
          }}>
          Tambah Barang Keluar
        </button>

        <CSVLink
          className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 ml-2"
          headers={headersCSV}
          data={dataCSV}
          filename="Data_Barang_Keluar_INVENTORY.csv"
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

export default DataBarangKeluar;
