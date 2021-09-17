import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "../../components/elements/Button";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";

const TambahSupplier = () => {
  const [formData, setFormData] = useState({
    nama_supplier: "",
    no_telp: "",
    alamat: "",
  });
  const [formDataError, setFormDataError] = useState({
    nama_supplier: false,
    no_telp: false,
    alamat: false,
  });
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({
    status: 200,
    message: "",
    duration: 3000,
  });
  const history = useHistory();

  const formValidation = () => {
    let isError = false;

    Object.entries(formData).forEach((data) => {
      let [name, value] = data;

      if (name === "no_telp") {
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
    if (name === "no_telp") {
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

    await api
      .post("/supplier", formData, {
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
        console.log(error);
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
  }, []);

  return (
    <>
      <Helmet>
        <title>Tambah Supplier</title>
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
          Tambah Supplier
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center text-sm space-y-4">
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Nama Supplier <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Nama Supplier"
                name="nama_supplier"
                value={formData.nama_supplier}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.nama_supplier ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Nama supplier ${formDataError.nama_supplier}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                No telp <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="No telp"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.no_telp ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`No telp ${formDataError.no_telp}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-start gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Alamat <span className="text-red-400">*</span>
              </div>
              <textarea
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}></textarea>
              <div
                className={`${
                  formDataError.alamat ? "" : "hidden"
                } md:col-start-5 col-span-full text-xs text-red-400`}>
                {`Alamat ${formDataError.alamat}`}
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

export default TambahSupplier;
