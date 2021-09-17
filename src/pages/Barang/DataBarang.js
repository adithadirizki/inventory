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

const DataBarang = () => {
  const initialStateFormDataDeleteBarang = { _id: "", nama_barang: "" };
  const [dataBarang, setDataBarang] = useState({});
  const [showModalDeleteBarang, setShowModalDeleteBarang] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: 200,
    message: "",
    error: false,
    duration: 3000,
  });
  const [formDataDeleteBarang, setFormDataDeleteBarang] = useState(
    initialStateFormDataDeleteBarang
  );
  const columns = [
    { label: "No", field: "created_at" },
    { label: "Kode Barang", field: "kode_barang" },
    { label: "Nama Barang", field: "nama_barang" },
    { label: "Stok", field: "stok" },
    { label: "Harga Jual", field: "harga_jual" },
    { label: "Harga Beli", field: "harga_beli" },
    { label: "Kategori", field: "id_kategori" },
    { label: "Satuan", field: "id_satuan" },
    { label: "Tanggal", field: "created_at" },
    { label: "Aksi", field: "aksi", disabled: true },
  ];
  const headersCSV = [
    { label: "Kode Barang", key: "kode_barang" },
    { label: "Nama Barang", key: "nama_barang" },
    { label: "Stok", key: "stok" },
    { label: "Harga Jual", key: "harga_jual" },
    { label: "Harga Beli", key: "harga_beli" },
    { label: "Kategori", key: "kategori" },
    { label: "Satuan", key: "satuan" },
  ];
  const [dataCSV, setDataCSV] = useState([]);
  const [sortBy, setSortBy] = useState({
    field: "created_at",
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
  const history = useHistory();

  const fetchBarang = async () => {
    setShowLoading(true);
    await api
      .get("/barang", {
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
        setDataBarang(response.data);
        response.data.data.forEach((value, index) => {
          return value;
        });
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            data.push({
              kode_barang: value.kode_barang,
              nama_barang: value.nama_barang,
              stok: value.stok,
              harga_jual: value.harga_jual,
              harga_beli: value.harga_beli,
              kategori: value.id_kategori.nama_kategori,
              satuan: value.id_satuan.nama_satuan,
            })
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
    setShowLoading(false);
  };

  const handleSubmitDeleteBarang = async (e) => {
    e.preventDefault();
    setShowAlert(false);
    setShowLoading(true);

    await api
      .delete(`/barang/${formDataDeleteBarang._id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchBarang();
        setAlert({ ...alert, ...response.data });
        setShowAlert(true);
        setShowModalDeleteBarang(false);
        setFormDataDeleteBarang(initialStateFormDataDeleteBarang); // reset form
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
    if (!dataBarang.data || dataBarang.data.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan={columns.length}>Data Kosong</td>
        </tr>
      );
    }

    return dataBarang.data.map((value, index) => {
      const no = (dataTable.page - 1) * dataTable.rowsPerPage;
      return (
        <Tr key={index}>
          <td className="border text-center">{no + (index + 1)}</td>
          <td className="border">{value.kode_barang}</td>
          <td className="border">{value.nama_barang}</td>
          <td className="border text-center">{value.stok}</td>
          <td className="border text-right whitespace-nowrap">{`Rp ${value.harga_jual.toLocaleString(
            { style: "currency", currency: "IDR" }
          )}`}</td>
          <td className="border text-right whitespace-nowrap">{`Rp ${value.harga_beli.toLocaleString(
            { style: "currency", currency: "IDR" }
          )}`}</td>
          <td className="border text-center">
            {value.id_kategori ? value.id_kategori.nama_kategori : "-"}
          </td>
          <td className="border text-center">
            {value.id_satuan ? value.id_satuan.nama_satuan : "-"}
          </td>
          <td className="border text-center">
            {moment(value.created_at).format("DD/MM/YYYY hh:mm")}
          </td>
          <td className="border">
            <div className="flex items-center justify-center text-xs space-x-1">
              <ButtonLight
                variant="pill"
                onClick={() => {
                  history.push(`/barang/${value._id}/edit`);
                }}>
                Edit
              </ButtonLight>
              <ButtonLight
                theme="red"
                variant="pill"
                onClick={() => {
                  console.log('click hapus')
                  setShowModalDeleteBarang(true);
                  setFormDataDeleteBarang({
                    _id: value._id,
                    nama_barang: value.nama_barang,
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
    fetchBarang();
  }, [dataTable.q, dataTable.rowsPerPage, dataTable.page, sortBy]);

  return (
    <>
      <Helmet><title>Data Barang | INVENTORY</title></Helmet>
      {showLoading ? (
        <div className="fixed bg-transparent w-full h-full z-30">
          <div
            className="fixed top-1/2 left-1/2 text-white transform -translate-y-1/2 -translate-x-1/2 rounded-lg px-8 py-3"
            style={{ backgroundColor: "#00000097" }}>
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
        show={showModalDeleteBarang}
        afterClose={() => setShowModalDeleteBarang(false)}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-4">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Delete Barang
            </div>
            <button
              onClick={() => {
                setShowModalDeleteBarang(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <form onSubmit={handleSubmitDeleteBarang}>
            <div className="text-sm">
              Anda yakin ingin menghapus barang{" "}
              <strong>{formDataDeleteBarang.nama_barang}</strong>?
            </div>
            <div className="flex justify-between text-sm space-x-2 mt-8">
              <Button
                type="button"
                theme="red"
                onClick={() => {
                  setShowModalDeleteBarang(false);
                }}>
                Batal
              </Button>
              <Button type="submit" theme="green">
                Ya
              </Button>
            </div>
          </form>
        </Card>
      </Modal>

      <Card>
        <div className="font-montserrat font-bold text-gray-500 text-xl mb-6">
          Data Barang
        </div>
        <Button
          className="mb-4"
          onClick={() => {
            history.push("/barang/tambah");
          }}>
          Tambah Barang
        </Button>

        <ButtonLight className="text-sm ml-4">
          <FontAwesomeIcon icon={faFileAlt} />
          <CSVLink
            className="ml-2"
            headers={headersCSV}
            data={dataCSV}
            filename="Data_Barang_INVENTORY.csv"
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

export default DataBarang;
