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
import moment from "moment";
import { CSVLink } from "react-csv";

const Tr = styled.tr`
  :nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const DataBarangMasuk = () => {
  const initialStateFormDataDeleteBarangMasuk = { no_transaksi: "" };
  const [dataBarangMasuk, setDataBarangMasuk] = useState(null);
  const columns = [
    { label: "No", field: "created_at", disabled: true },
    { label: "No Transaksi", field: "no_transaksi" },
    { label: "Supplier", field: "nama_supplier", disabled: true },
    { label: "Nama Barang", field: "nama_barang", disabled: true },
    { label: "Kuantitas", field: "kuantitas" },
    { label: "Harga Beli", field: "harga_beli", disabled: true },
    { label: "Total Harga", field: "total_harga", disabled: true },
    { label: "User", field: "username", disabled: true },
    { label: "Tgl Masuk", field: "created_at" },
    { label: "Aksi", field: "aksi", disabled: true },
  ];
  const headersCSV = [
    { label: "No Transaksi", key: "no_transaksi" },
    { label: "Supplier", key: "supplier" },
    { label: "Nama Barang", key: "nama_barang" },
    { label: "Kuantitas", key: "kuantitas" },
    { label: "Harga Beli", key: "harga_beli" },
    { label: "Total Harga", key: "total_harga" },
    { label: "User", key: "username" },
    { label: "Tgl Masuk", key: "created_at" },
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
  const [showModalDeleteBarangMasuk, setShowModalDeleteBarangMasuk] =
    useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: 200,
    message: "",
    error: false,
    duration: 3000,
  });
  const [formDataDeleteBarangMasuk, setFormDataDeleteBarangMasuk] = useState(
    initialStateFormDataDeleteBarangMasuk
  );
  const history = useHistory();

  const fetchBarangMasuk = async () => {
    await api
      .get("/barang_masuk", {
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
        setDataBarangMasuk(response.data);
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            data.push({
              no_transaksi: value.no_transaksi,
              supplier: value.id_supplier.nama_supplier,
              nama_barang: value.barang_masuk.nama_barang,
              kuantitas: value.kuantitas,
              harga_beli: value.harga_beli,
              total_harga: value.harga_beli * value.kuantitas,
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

  const handleSubmitDeleteBarangMasuk = async () => {
    setShowAlert(false);
    setShowLoading(true);

    await api
      .delete(`/barang_masuk/${formDataDeleteBarangMasuk.no_transaksi}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchBarangMasuk();
        setAlert({ ...alert, ...response.data });
        setShowAlert(true); // show alert
        setShowModalDeleteBarangMasuk(false); // hide modal
        setFormDataDeleteBarangMasuk(initialStateFormDataDeleteBarangMasuk); // reset form
      })
      .catch((error) => {
        // Unauthorized
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
    if (!dataBarangMasuk || dataBarangMasuk.data.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan={columns.length}>Data Kosong</td>
        </tr>
      );
    }

    return dataBarangMasuk.data.map((value, index) => {
      const no = (dataTable.page - 1) * dataTable.rowsPerPage;
      return (
        <Tr key={index}>
          <td className="border text-center">{no + (index + 1)}</td>
          <td className="border text-center font-lato">{value.no_transaksi}</td>
          <td className="border">{value.id_supplier.nama_supplier}</td>
          <td className="border">{value.barang_masuk.nama_barang}</td>
          <td className="border text-center">{value.kuantitas}</td>
          <td className="border text-right">{`Rp ${value.harga_beli.toLocaleString(
            { style: "currency", currency: "IDR" }
          )}/${value.barang_masuk.id_satuan.nama_satuan}`}</td>
          <td className="border text-right">{`Rp ${(
            value.harga_beli * value.kuantitas
          ).toLocaleString({ style: "currency", currency: "IDR" })}`}</td>
          <td className="border text-center">{value.user_input.nama}</td>
          <td className="border text-center">
            {moment(value.created_at).format("YYYY-MM-DD")}
          </td>
          <td className="border">
            <div className="flex items-center justify-center text-xs space-x-1">
              <ButtonLight
                theme="red"
                variant="pill"
                onClick={() => {
                  setShowModalDeleteBarangMasuk(true);
                  setFormDataDeleteBarangMasuk({
                    no_transaksi: value.no_transaksi,
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
    fetchBarangMasuk();
  }, [dataTable.q, dataTable.rowsPerPage, dataTable.page, sortBy]);

  return (
    <>
      <Helmet>
        <title>Data Barang Masuk | INVENTORY</title>
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
        show={showModalDeleteBarangMasuk}
        afterClose={() => setShowModalDeleteBarangMasuk(false)}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-4">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Hapus Transaksi Barang Masuk
            </div>
            <button
              onClick={() => {
                setShowModalDeleteBarangMasuk(false);
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
              {formDataDeleteBarangMasuk.no_transaksi}
            </strong>
            ?
          </div>
          <div className="flex justify-between text-sm space-x-2 mt-8">
            <Button
              theme="red"
              onClick={() => {
                setShowModalDeleteBarangMasuk(false);
              }}>
              Batal
            </Button>
            <Button theme="green" onClick={handleSubmitDeleteBarangMasuk}>
              Ya
            </Button>
          </div>
        </Card>
      </Modal>

      <Card>
        <div className="font-montserrat font-bold text-gray-500 text-xl mb-6">
          Data Barang Masuk
        </div>
        <Button
          className="mb-4"
          onClick={() => {
            history.push("/barang_masuk/tambah");
          }}>
          Tambah Barang Masuk
        </Button>

        <ButtonLight className="text-sm ml-4">
          <FontAwesomeIcon icon={faFileAlt} />
          <CSVLink
            className="ml-2"
            headers={headersCSV}
            data={dataCSV}
            filename="Data_Barang_Masuk_INVENTORY.csv"
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

export default DataBarangMasuk;
