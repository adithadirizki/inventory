import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBox,
  faMoneyBillAlt,
  faMoneyBillWaveAlt,
  faMoneyCheckAlt,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Helmet } from "react-helmet";
import Card from "../components/elements/Card";
import api from "../config/api";
import { Bar, Line } from "react-chartjs-2";
import moment from "moment";

const IndexPage = () => {
  const [statistic, setStatistic] = useState({
    pengguna: 0,
    supplier: 0,
    barang: 0,
    pemasukan: 0,
    pengeluaran: 0,
  });
  const [pemasukanBulanIni, setPemasukanBulanIni] = useState([]);
  const [pengeluaranBulanIni, setPengeluaranBulanIni] = useState([]);
  const [pemasukanTahunIni, setPemasukanTahunIni] = useState([]);
  const [pengeluaranTahunIni, setPengeluaranTahunIni] = useState([]);
  const history = useHistory();

  const dataPemasukanPerHari = {
    labels: new Array(moment().daysInMonth())
      .fill(0)
      .map((value, index) => index + 1),
    datasets: [
      {
        label: "Pemasukan",
        data: pemasukanBulanIni,
        backgroundColor: "#8B5CF6",
      },
    ],
  };

  const dataPengeluaranPerHari = {
    labels: new Array(moment().daysInMonth())
      .fill(0)
      .map((value, index) => index + 1),
    datasets: [
      {
        label: "Pengeluaran",
        data: pengeluaranBulanIni,
        backgroundColor: "#EC4899",
      },
    ],
  };

  const dataPerBulan = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    datasets: [
      {
        label: "Pemasukan",
        data: pemasukanTahunIni,
        backgroundColor: "#8B5CF6",
      },
      {
        label: "Pengeluaran",
        data: pengeluaranTahunIni,
        backgroundColor: "#EC4899",
      },
    ],
  };

  const fetchCountPengguna = async () => {
    await api
      .get("/pengguna/count", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setStatistic((state) => ({ ...state, pengguna: response.data.count }));
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchCountSupplier = async () => {
    await api
      .get("/supplier/count", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setStatistic((state) => ({ ...state, supplier: response.data.count }));
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchCountBarang = async () => {
    await api
      .get("/barang/count", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setStatistic((state) => ({ ...state, barang: response.data.count }));
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchPemasukan = async () => {
    await api
      .get("/barang_keluar/pemasukan", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setStatistic((state) => ({
          ...state,
          pemasukan: response.data.income,
        }));
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchPemasukanBulanIni = async () => {
    await api
      .get("/barang_keluar/pemasukan/bulan", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setPemasukanBulanIni(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchPemasukanTahunIni = async () => {
    await api
      .get("/barang_keluar/pemasukan/tahun", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setPemasukanTahunIni(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchPengeluaranBulanIni = async () => {
    await api
      .get("/barang_masuk/pengeluaran/bulan", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setPengeluaranBulanIni(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchPengeluaranTahunIni = async () => {
    await api
      .get("/barang_masuk/pengeluaran/tahun", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setPengeluaranTahunIni(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchPengeluaran = async () => {
    await api
      .get("/barang_masuk/pengeluaran", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setStatistic((state) => ({
          ...state,
          pengeluaran: response.data.expense,
        }));
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  useEffect(() => {
    if (localStorage.getItem("role") === "admin") {
      fetchCountPengguna();
    }
    fetchCountSupplier();
    fetchCountBarang();
    fetchPemasukan();
    fetchPemasukanBulanIni();
    fetchPemasukanTahunIni();
    fetchPengeluaran();
    fetchPengeluaranBulanIni();
    fetchPengeluaranTahunIni();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | INVENTORY</title>
      </Helmet>
      <Card>
        <div className="font-montserrat font-bold text-gray-500 text-xl mb-6">
          Dashboard
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-4 mb-8">
          {localStorage.getItem("role") === "admin" ? (
            <div className="col-span-3 flex items-center bg-green-500 text-gray-100 rounded-lg shadow space-x-4 px-4 py-3">
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-100 text-xl"
              />
              <div className="flex flex-col items-start">
                <div className="font-montserrat font-bold">
                  {statistic.pengguna}
                </div>
                <div className="text-sm">Pengguna</div>
              </div>
            </div>
          ) : null}

          <div className="col-span-3 flex items-center bg-indigo-500 text-gray-100 rounded-lg shadow space-x-4 px-4 py-3">
            <FontAwesomeIcon icon={faTruck} className="text-gray-100 text-xl" />
            <div className="flex flex-col items-start">
              <div className="font-montserrat font-bold">
                {statistic.supplier}
              </div>
              <div className="text-sm">Supplier</div>
            </div>
          </div>

          <div className="col-span-3 flex items-center bg-yellow-500 text-gray-100 rounded-lg shadow space-x-4 px-4 py-3">
            <FontAwesomeIcon icon={faBox} className="text-gray-100 text-xl" />
            <div className="flex flex-col items-start">
              <div className="font-montserrat font-bold">
                {statistic.barang}
              </div>
              <div className="text-sm">Barang</div>
            </div>
          </div>

          <div className="col-span-3 flex items-center bg-purple-500 text-gray-100 rounded-lg shadow space-x-4 px-4 py-3">
            <FontAwesomeIcon
              icon={faMoneyCheckAlt}
              className="text-gray-100 text-xl"
            />
            <div className="flex flex-col items-start">
              <div className="font-montserrat font-bold">
                Rp{" "}
                {statistic.pemasukan.toLocaleString({
                  style: "currency",
                  currency: "USD",
                })}
              </div>
              <div className="text-sm">Pemasukan</div>
            </div>
          </div>

          <div className="col-span-3 flex items-center bg-pink-500 text-gray-100 rounded-lg shadow space-x-4 px-4 py-3">
            <FontAwesomeIcon
              icon={faMoneyBillAlt}
              className="text-gray-100 text-xl"
            />
            <div className="flex flex-col items-start">
              <div className="font-montserrat font-bold">
                Rp{" "}
                {statistic.pengeluaran.toLocaleString({
                  style: "currency",
                  currency: "USD",
                })}
              </div>
              <div className="text-sm">Pengeluaran</div>
            </div>
          </div>

          <div className="col-span-3 flex items-center bg-green-500 text-gray-100 rounded-lg shadow space-x-4 px-4 py-3">
            <FontAwesomeIcon
              icon={faMoneyBillWaveAlt}
              className="text-gray-100 text-xl"
            />
            <div className="flex flex-col items-start">
              <div className="font-montserrat font-bold">
                Rp{" "}
                {(statistic.pemasukan - statistic.pengeluaran).toLocaleString({
                  style: "currency",
                  currency: "USD",
                })}
              </div>
              <div className="text-sm">Pendapatan</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 mb-8">
          <div className="text-center">
            <div className="font-montserrat font-bold text-gray-500 text-lg mb-6">
              Grafik Pemasukan bulan ini
            </div>
            <Line data={dataPemasukanPerHari} />
          </div>

          <div className="text-center">
            <div className="font-montserrat font-bold text-gray-500 text-lg mb-6">
              Grafik Pengeluaran bulan ini
            </div>
            <Line data={dataPengeluaranPerHari} />
          </div>
        </div>

        <div className="text-center w-full md:w-5/6 mx-auto">
          <div className="font-montserrat font-bold text-gray-500 text-lg mb-6">
            Grafik Pemasukan/Pengeluaran tahun ini
          </div>
          <Bar data={dataPerBulan} />
        </div>
      </Card>
    </>
  );
};

export default IndexPage;
