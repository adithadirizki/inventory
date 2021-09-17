import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "../../components/elements/Button";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";

const TambahBarangMasuk = () => {
  const [formData, setFormData] = useState({
    id_supplier: "",
    kode_barang: "",
    kuantitas: "",
    harga_beli: "",
    username: localStorage.getItem("username"),
  });
  const [formDataError, setFormDataError] = useState({
    id_supplier: false,
    kode_barang: false,
    kuantitas: false,
    harga_beli: false,
  });
  const [dataBarang, setDataBarang] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({
    status: 200,
    message: "",
    duration: 3000,
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
        if (error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchSupplier = async () => {
    await api
      .get("/supplier", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataSupplier(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const formValidation = () => {
    let isError = false;

    Object.entries(formData).forEach((data) => {
      let [name, value] = data;

      console.log(name, value);

      if (name === "kuantitas") {
        value = value.replace(/\D/g, "");
      }

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
    }

    if (value) {
      if (name === "kode_barang") {
        const { harga_beli } = dataBarang.find(
          (barang) => barang.kode_barang === value
        );
        setFormData((state) => ({
          ...state,
          [name]: value,
          harga_beli: harga_beli,
        }));
      } else {
        setFormData((state) => ({ ...state, [name]: value }));
      }
      setFormDataError((state) => ({ ...state, [name]: false }));
    } else {
      setFormData((state) => ({ ...state, [name]: value }));
      setFormDataError((state) => ({ ...state, [name]: "harus diisi" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValidation()) {
      return false;
    }
    setShowLoading(true);

    await api
      .post("/barang_masuk", formData, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setAlert((state) => ({ ...state, ...response.data }));
        setShowAlert(true);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        setAlert((state) => ({
          ...state,
          status: 500,
          message: "Internal server error!",
        }));
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
    fetchSupplier();
  }, []);

  return (
    <>
      <Helmet>
        <title>Tambah Barang Masuk | INVENTORY</title>
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
        afterClose={() => {
          setShowAlert(false);
          if (alert.status === 200) {
            history.goBack();
          }
        }}
      />
      <Card className="font-montserrat w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
        <div className="font-montserrat font-bold text-lg text-gray-500 mb-6">
          Tambah Barang Masuk
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Supplier <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_supplier}
                name="id_supplier"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Pilih Supplier --
                </option>
                {dataSupplier.map((value, index) => {
                  return (
                    <option value={value._id} key={index}>
                      {value.nama_supplier}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.id_supplier ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Supplier ${formDataError.id_supplier}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Barang Masuk <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
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
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Barang ${formDataError.kode_barang}`}
              </div>
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
                value={formData.kuantitas}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.kuantitas ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Kuantitas ${formDataError.kuantitas}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Harga Beli <span className="text-red-400">*</span>
              </div>
              <div className="flex col-span-full md:col-span-8 border border-gray-300 rounded-md focus-within:ring focus-within:ring-indigo-200">
                <div className="bg-gray-100  px-3 py-2">Rp</div>
                <input
                  type="text"
                  className="bg-gray-50 focus:outline-none w-full p-2"
                  placeholder="Harga Beli"
                  name="harga_beli"
                  value={formData.harga_beli}
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
                  value={formData.harga_beli * formData.kuantitas}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button className="text-sm">Simpan</Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default TambahBarangMasuk;
