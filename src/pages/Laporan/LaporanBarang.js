import api from "../../config/api";
import { useEffect, useRef, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ButtonLight } from "../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";
import { CSVLink } from "react-csv";
import Loading from "../../components/elements/Loading";

const LaporanBarang = () => {
  const [laporan, setLaporan] = useState({
    start: "",
    end: "",
    type: "",
  });
  const [laporanError, setLaporanError] = useState({
    start: false,
    end: false,
    type: false,
  });
  const headersCSVBarangMasuk = [
    { label: "No Transaksi", key: "no_transaksi" },
    { label: "Supplier", key: "supplier" },
    { label: "Nama Barang", key: "nama_barang" },
    { label: "Kuantitas", key: "kuantitas" },
    { label: "Harga Beli", key: "harga_beli" },
    { label: "Total Harga", key: "total_harga" },
    { label: "User", key: "username" },
    { label: "Tgl Masuk", key: "created_at" },
  ];
  const headersCSVBarangKeluar = [
    { label: "No Transaksi", key: "no_transaksi" },
    { label: "Nama Barang", key: "nama_barang" },
    { label: "Kuantitas", key: "kuantitas" },
    { label: "Harga Jual", key: "harga_jual" },
    { label: "Total Harga", key: "total_harga" },
    { label: "User", key: "username" },
    { label: "Tgl Keluar", key: "created_at" },
  ];
  const [headersCSV, setHeadersCSV] = useState(null);
  const [dataCSV, setDataCSV] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const csvLink = useRef(null);
  const history = useHistory();

  const formValidation = () => {
    var isError = false;

    if (laporan.type === "") {
      isError = true;
      setLaporanError((state) => ({ ...state, type: true }));
    }
    if (laporan.start === "") {
      isError = true;
      setLaporanError((state) => ({ ...state, start: true }));
    }
    if (laporan.end === "") {
      isError = true;
      setLaporanError((state) => ({ ...state, end: true }));
    }

    return !isError;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setLaporan((state) => ({ ...state, [name]: value }));
    if (value === "") {
      setLaporanError((state) => ({ ...state, [name]: true }));
    } else {
      setLaporanError((state) => ({ ...state, [name]: false }));
    }
  };

  const handleExport = (e) => {
    if (!formValidation()) {
      return false;
    }

    console.log(csvLink);
    const linkDownload = csvLink.current.link;
    if (laporan.type === "barang_masuk") {
      setHeadersCSV(headersCSVBarangMasuk);
      linkDownload.download = `Laporan_Barang_Masuk_${laporan.start}_${laporan.end}.csv`;
    } else if (laporan.type === "barang_keluar") {
      setHeadersCSV(headersCSVBarangKeluar);
      linkDownload.download = `Laporan_Barang_Keluar_${laporan.start}_${laporan.end}.csv`;
    }

    fetchLaporan();
  };

  const fetchLaporan = async () => {
    setShowLoading(true);

    await api
      .get(`/${laporan.type}/laporan`, {
        params: {
          mulai: laporan.start,
          sampai: laporan.end,
        },
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            if (laporan.type === "barang_masuk") {
              data.push({
                no_transaksi: value.no_transaksi,
                supplier: value.id_supplier
                  ? value.id_supplier.nama_supplier
                  : "",
                nama_barang: value.barang_masuk
                  ? value.barang_masuk.nama_barang
                  : "",
                kuantitas: value.kuantitas,
                harga_beli: value.harga_beli,
                total_harga: value.harga_beli * value.kuantitas,
                username: value.user_input ? value.user_input.nama : "",
                created_at: moment(value.created_at).format("YYYY MM DD"),
              });
            } else if (laporan.type === "barang_keluar") {
              data.push({
                no_transaksi: value.no_transaksi,
                nama_barang: value.barang_keluar
                  ? value.barang_keluar.nama_barang
                  : "",
                kuantitas: value.kuantitas,
                harga_jual: value.harga_jual,
                total_harga: value.harga_jual * value.kuantitas,
                username: value.user_input ? value.user_input.nama : "",
                created_at: moment(value.created_at).format("YYYY MM DD"),
              });
            }
          });
          return data;
        });
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });

    setShowLoading(false);
  };

  useEffect(() => {
    if (dataCSV && csvLink.current && csvLink.current.link) {
      setTimeout(() => {
        csvLink.current.link.click();
      });
    }
  }, [dataCSV]);

  return (
    <>
      <Helmet>
        <title>Laporan | INVENTORY</title>
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

      <Card className="w-full sm:w-5/6 md:w-3/4 lg:w-1/2 mx-auto">
        <div className="font-montserrat font-bold text-gray-500 text-xl mb-6">
          Laporan Barang Masuk/Keluar
        </div>

        <div className="grid items-center font-montserrat gap-y-4 mb-8">
          <div className="flex flex-col space-y-2">
            <div className="font-bold text-gray-500">Pilih Laporan</div>
            <div className="flex flex-col">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name="type"
                  value="barang_masuk"
                  onChange={handleChange}
                  checked={laporan.type === "barang_masuk" ? true : false}
                />
                Barang Masuk
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name="type"
                  value="barang_keluar"
                  onChange={handleChange}
                  checked={laporan.type === "barang_keluar" ? true : false}
                />
                Barang Keluar
              </label>
              <div className="text-red-400 text-sm">
                {laporanError.type ? `Laporan harus diisi` : ""}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="font-bold text-gray-500">Dari Tanggal</div>
            <input
              type="date"
              className="bg-white text-sm border rounded focus:outline-none focus:ring focus:ring-indigo-200 w-full px-4 py-2"
              name="start"
              value={laporan.start}
              onChange={handleChange}
            />
            <div className="text-red-400 text-sm">
              {laporanError.start ? `Tanggal harus diisi` : ""}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="font-bold text-gray-500">Sampai Tanggal</div>
            <input
              type="date"
              className="bg-white text-sm border rounded focus:outline-none focus:ring focus:ring-indigo-200 w-full px-4 py-2"
              name="end"
              value={laporan.end}
              onChange={handleChange}
            />
            <div className="text-red-400 text-sm">
              {laporanError.end ? `Tanggal harus diisi` : ""}
            </div>
          </div>
        </div>

        <button
          className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
          onClick={handleExport}>
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          Export
        </button>

        <CSVLink
          headers={headersCSV}
          data={dataCSV || []}
          ref={csvLink}
          filename="Laporan_INVENTORY.csv"
          target="_blank"
        />
      </Card>
    </>
  );
};

export default LaporanBarang;
