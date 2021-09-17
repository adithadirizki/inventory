import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import styled from "styled-components";
import Modal from "../../components/elements/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";
import Datatable from "../../components/Datatable";
import { useHistory } from "react-router";
import { CSVLink } from "react-csv";

const Tr = styled.tr`
  :nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const DataKategori = () => {
  const initialStateFormDataAddKategori = { nama_kategori: "" };
  const initialStateFormDataEditKategori = { _id: "", nama_kategori: "" };
  const initialStateFormDataDeleteKategori = { _id: "", nama_kategori: "" };
  const [dataKategori, setDataKategori] = useState(null);
  const columns = [
    { label: "No", field: "_id" },
    { label: "Nama Kategori", field: "nama_kategori" },
    { label: "Aksi", field: "aksi", disabled: true },
  ];
  const headersCSV = [{ label: "Kategori", key: "nama_kategori" }];
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
  const [showModalAddKategori, setShowModalAddKategori] = useState(false);
  const [showModalEditKategori, setShowModalEditKategori] = useState(false);
  const [showModalDeleteKategori, setShowModalDeleteKategori] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const [formDataAddKategori, setFormDataAddKategori] = useState(
    initialStateFormDataAddKategori
  );
  const [formDataEditKategori, setFormDataEditKategori] = useState(
    initialStateFormDataEditKategori
  );
  const [formDataDeleteKategori, setFormDataDeleteKategori] = useState(
    initialStateFormDataDeleteKategori
  );
  const [formDataAddKategoriError, setFormDataAddKategoriError] =
    useState(false);
  const [formDataEditKategoriError, setFormDataEditKategoriError] =
    useState(false);
  const history = useHistory();

  const fetchKategori = async () => {
    setShowLoading(true);

    await api
      .get("/kategori", {
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
        setDataKategori(response.data);
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            data.push({
              nama_kategori: value.nama_kategori,
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

  const handleSubmitAddKategori = async (e) => {
    e.preventDefault();

    if (!formDataAddKategori.nama_kategori) {
      setFormDataAddKategoriError("Nama kategori harus diisi.");
      return false;
    }

    setShowLoading(true);

    await api
      .post("/kategori", formDataAddKategori, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchKategori();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalAddKategori(false); // hide modal
        setFormDataAddKategori(initialStateFormDataAddKategori); // reset form
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

  const handleSubmitEditKategori = async (e) => {
    e.preventDefault();

    if (!formDataEditKategori.nama_kategori) {
      setFormDataEditKategoriError("Nama kategori harus diisi.");
      return false;
    }

    setShowLoading(true);

    await api
      .put(
        `/kategori/${formDataEditKategori._id}`,
        { nama_kategori: formDataEditKategori.nama_kategori },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        fetchKategori();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalEditKategori(false); // hide modal
        setFormDataEditKategori(initialStateFormDataEditKategori); // reset form
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

  const handleSubmitDeleteKategori = async () => {
    setShowLoading(true);

    await api
      .delete(`/kategori/${formDataDeleteKategori._id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchKategori();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalDeleteKategori(false); // hide modal
        setFormDataDeleteKategori(initialStateFormDataDeleteKategori); // reset form
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
    if (!dataKategori || dataKategori.data.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan={columns.length}>Data Kosong</td>
        </tr>
      );
    }

    return dataKategori.data.map((value, index) => {
      const no = (dataTable.page - 1) * dataTable.rowsPerPage;
      return (
        <Tr key={index}>
          <td className="border text-center">{no + (index + 1)}</td>
          <td className="border">{value.nama_kategori}</td>
          <td className="border">
            <div className="flex items-center justify-center text-xs space-x-1">
              <button
                className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
                onClick={() => {
                  setShowModalEditKategori(true);
                  setFormDataEditKategori({
                    _id: value._id,
                    nama_kategori: value.nama_kategori,
                  });
                }}>
                Edit
              </button>
              <button
                className="border border-red-300 bg-red-50 hover:bg-red-200 text-red-600 rounded-full focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
                onClick={() => {
                  setShowModalDeleteKategori(true);
                  setFormDataDeleteKategori({
                    _id: value._id,
                    nama_kategori: value.nama_kategori,
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
    fetchKategori();
  }, [dataTable.q, dataTable.rowsPerPage, dataTable.page, sortBy]);

  return (
    <>
      <Helmet>
        <title>Data Kategori | INVENTORY</title>
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
        show={showModalAddKategori}
        afterClose={() => {
          setShowModalAddKategori(false);
        }}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-6">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Tambah Kategori
            </div>
            <button
              onClick={() => {
                setShowModalAddKategori(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <form onSubmit={handleSubmitAddKategori}>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="">
                  Nama Kategori <span className="text-red-400">*</span>
                </div>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  placeholder="Nama Kategori"
                  value={formDataAddKategori.nama_kategori}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormDataAddKategori((state) => ({
                      ...state,
                      nama_kategori: e.target.value,
                    }));
                    if (value) {
                      setFormDataAddKategoriError(false);
                    } else {
                      setFormDataAddKategoriError("Nama kategori harus diisi.");
                    }
                  }}
                />
                <div
                  className={`${
                    formDataAddKategoriError ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {formDataAddKategoriError}
                </div>
              </div>
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5 mt-6">
              Simpan
            </button>
          </form>
        </Card>
      </Modal>
      <Modal
        show={showModalEditKategori}
        afterClose={() => {
          setShowModalEditKategori(false);
        }}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-6">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Edit Kategori
            </div>
            <button
              onClick={() => {
                setShowModalEditKategori(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <form onSubmit={handleSubmitEditKategori}>
            <div className="flex flex-col justify-center text-sm space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="">
                  ID Kategori <span className="text-red-400">*</span>
                </div>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  value={formDataEditKategori._id}
                  disabled
                />
              </div>
              <div className="flex flex-col space-y-2">
                <div className="">
                  Nama Kategori <span className="text-red-400">*</span>
                </div>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  placeholder="Nama Kategori"
                  value={formDataEditKategori.nama_kategori}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormDataEditKategori((state) => ({
                      ...state,
                      nama_kategori: e.target.value,
                    }));
                    if (value) {
                      setFormDataEditKategoriError(false);
                    } else {
                      setFormDataEditKategoriError(
                        "Nama kategori harus diisi."
                      );
                    }
                  }}
                />
                <div
                  className={`${
                    formDataEditKategoriError ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {formDataEditKategoriError}
                </div>
              </div>
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5 mt-6">
              Simpan
            </button>
          </form>
        </Card>
      </Modal>
      <Modal
        show={showModalDeleteKategori}
        afterClose={() => setShowModalDeleteKategori(false)}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-4">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Hapus Kategori
            </div>
            <button
              onClick={() => {
                setShowModalDeleteKategori(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <div className="text-sm">
            Anda yakin ingin menghapus kategori{" "}
            <strong>{formDataDeleteKategori.nama_kategori}</strong>?
          </div>
          <div className="flex justify-between text-sm space-x-2 mt-8">
            <button
              className="bg-red-500 hover:bg-red-400 text-red-100 rounded focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
              onClick={() => {
                setShowModalDeleteKategori(false);
              }}>
              Batal
            </button>
            <button
              className="bg-green-500 hover:bg-green-400 text-green-100 rounded focus:ring focus:ring-green-100 focus:outline-none px-4 py-1.5"
              onClick={handleSubmitDeleteKategori}>
              Ya
            </button>
          </div>
        </Card>
      </Modal>

      <Card className="font-montserrat">
        <div className="font-bold text-gray-500 text-xl mb-6">
          Data Kategori Barang
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 mr-2 mb-4"
          onClick={() => {
            setShowModalAddKategori(true);
          }}>
          Tambah Kategori
        </button>

        <CSVLink
          className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 ml-2"
          headers={headersCSV}
          data={dataCSV}
          filename="Data_Kategori_INVENTORY.csv"
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

export default DataKategori;
