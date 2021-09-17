import axios from "axios";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { Button } from "../../components/elements/Button";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";
import { useHistory } from "react-router";

const TambahBarang = () => {
  const [formData, setFormData] = useState({
    nama_barang: "",
    stok: "",
    harga_jual: "",
    harga_beli: "",
    id_kategori: "",
    id_satuan: "",
  });
  const [formDataError, setFormDataError] = useState({
    nama_barang: false,
    stok: false,
    harga_jual: false,
    harga_beli: false,
    id_kategori: false,
    id_satuan: false,
  });
  const [dataKategori, setDataKategori] = useState([]);
  const [dataSatuan, setDataSatuan] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({
    status: 200,
    message: "",
    duration: 3000,
  });
  const history = useHistory();

  const fetchKategori = async () => {
    await axios
      .get("/kategori")
      .then((response) => {
        setDataKategori(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        console.log(error);
      });
  };

  const fetchSatuan = async () => {
    await axios
      .get("/satuan")
      .then((response) => {
        setDataSatuan(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        console.log(error);
      });
  };

  const formValidation = () => {
    let isError = false;

    Object.entries(formData).forEach((data) => {
      let [name, value] = data;

      if (name === "stok" || name === "harga_jual" || name === "harga_beli") {
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
    if (name === "stok" || name === "harga_jual" || name === "harga_beli") {
      value = value.replace(/\D/g, "");
    }

    if (value) {
      setFormData((state) => ({ ...state, [name]: value }));
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

    await axios
      .post("/barang", formData, {
        headers: {
          "Content-Type": "application/json",
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

    fetchKategori();
    fetchSatuan();
  }, []);

  return (
    <>
      <Helmet>
        <title>Tambah Barang | INVENTORY</title>
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
          Tambah Barang
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center text-sm space-y-4">
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Nama Barang <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Nama Barang"
                name="nama_barang"
                value={formData.nama_barang}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.nama_barang ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Nama barang ${formDataError.nama_barang}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Stok <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Stok"
                name="stok"
                value={formData.stok}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.stok ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Stok ${formDataError.stok}`}
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
                  className="focus:outline-none w-full p-2"
                  placeholder="Harga Jual"
                  name="harga_jual"
                  value={formData.harga_jual}
                  onChange={handleChange}
                />
              </div>
              <div
                className={`${
                  formDataError.harga_jual ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Harga jual ${formDataError.harga_jual}`}
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
                  className="focus:outline-none w-full p-2"
                  placeholder="Harga Beli"
                  name="harga_beli"
                  value={formData.harga_beli}
                  onChange={handleChange}
                />
              </div>
              <div
                className={`${
                  formDataError.harga_beli ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Harga beli ${formDataError.harga_beli}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Kategori <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_kategori}
                name="id_kategori"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Pilih Kategori --
                </option>
                {dataKategori.map((value, index) => {
                  return (
                    <option value={value._id} key={index}>
                      {value.nama_kategori}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.id_kategori ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Kategori ${formDataError.id_kategori}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Satuan <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_satuan}
                name="id_satuan"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Pilih Satuan --
                </option>
                {dataSatuan.map((value, index) => {
                  return (
                    <option value={value._id} key={index}>
                      {value.nama_satuan}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.id_satuan ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Satuan ${formDataError.id_satuan}`}
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

export default TambahBarang;
