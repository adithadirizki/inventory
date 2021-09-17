import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "../../components/elements/Button";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";

const TambahBarangKeluar = () => {
  const [formData, setFormData] = useState({
    kode_barang: "",
    stok: 0,
    kuantitas: "",
    harga_jual: 0,
    username: localStorage.getItem("username"),
  });
  const [formDataError, setFormDataError] = useState({
    kode_barang: false,
    kuantitas: false,
    harga_jual: false,
  });
  const [dataBarang, setDataBarang] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const history = useHistory();

  const fetchBarang = async () => {
    await api
      .get("/barang", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataBarang(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const formValidation = () => {
    let isError = false;

    Object.entries(formData).forEach((data) => {
      let [name, value] = data;

      if (!value) {
        isError = true;
        setFormDataError((state) => ({ ...state, [name]: "harus diisi" }));
      }
    });

    return !isError;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    var value = e.target.value;

    // only number
    if (name === "kuantitas") {
      value = value.replace(/\D/g, "");
      value = value === "" ? "" : parseInt(value);
      if (value > formData.stok) {
        return false;
      }
    }

    setFormData((state) => ({ ...state, [name]: value }));
    if (value === undefined || value === "") {
      setFormDataError((state) => ({ ...state, [name]: "harus diisi" }));
    } else {
      if (name === "kode_barang") {
        const { stok, harga_jual } = dataBarang.find(
          (barang) => barang.kode_barang === value
        );
        setFormData((state) => ({
          ...state,
          [name]: value,
          stok: stok,
          harga_jual: harga_jual,
        }));
      }
      setFormDataError((state) => ({ ...state, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValidation()) {
      return false;
    }

    setShowLoading(true);

    await api
      .post("/barang_keluar", formData, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true);
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

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });

    fetchBarang();
  }, []);

  return (
    <>
      <Helmet>
        <title>Tambah Barang Keluar | INVENTORY</title>
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
          if (alert.error === false) {
            return history.goBack();
          }
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

      <Card className="font-montserrat w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
        <div className="font-montserrat font-bold text-lg text-gray-500 mb-6">
          Tambah Barang Keluar
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Barang Keluar <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.kode_barang}
                name="kode_barang"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Pilih Barang --
                </option>
                {dataBarang.map((value, index) => {
                  return (
                    <option value={value.kode_barang} key={index}>
                      {`${value.kode_barang} | ${value.nama_barang}`}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.kode_barang ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Barang ${formDataError.kode_barang}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Stok Tersedia <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Stok"
                value={formData.stok}
                disabled
              />
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Kuantitas <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Kuantitas"
                name="kuantitas"
                min="1"
                max={formData.stok}
                value={formData.kuantitas}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.kuantitas ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Kuantitas ${formDataError.kuantitas}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Harga Jual <span className="text-red-400">*</span>
              </div>
              <div className="flex col-span-full md:col-span-8 border border-gray-300 rounded-md focus-within:ring focus-within:ring-indigo-200">
                <div className="bg-gray-100  px-3 py-2">Rp</div>
                <input
                  type="text"
                  className="bg-gray-50 focus:outline-none w-full p-2"
                  placeholder="Harga Jual"
                  name="harga_jual"
                  value={formData.harga_jual}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Total Harga <span className="text-red-400">*</span>
              </div>
              <div className="flex col-span-full md:col-span-8 border border-gray-300 rounded-md focus-within:ring focus-within:ring-indigo-200">
                <div className="bg-gray-100  px-3 py-2">Rp</div>
                <input
                  type="text"
                  className="bg-gray-50 focus:outline-none w-full p-2"
                  placeholder="Total Harga"
                  name="total_harga"
                  value={formData.harga_jual * formData.kuantitas}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5 mt-6">
            Simpan
          </button>
        </form>
      </Card>
    </>
  );
};

export default TambahBarangKeluar;
