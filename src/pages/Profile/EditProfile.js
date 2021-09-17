import api, { ENDPOINT } from "../../config/api";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Card from "../../components/elements/Card";
import { Button } from "../../components/elements/Button";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";

const EditProfile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    email: "",
    no_telp: "",
  });
  const [formDataError, setFormDataError] = useState({
    foto: false,
    nama: false,
    email: false,
    no_telp: false,
  });
  const [formDataUbahPassword, setFormDataUbahPassword] = useState({
    password: "",
  });
  const [formDataUbahPasswordError, setFormDataUbahPasswordError] = useState({
    password: false,
  });
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const history = useHistory();

  const fetchPengguna = async () => {
    setShowLoading(true);

    await api
      .get(`/pengguna/info`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setFormData(response.data.data);
        localStorage.setItem("foto", response.data.data.foto);
        localStorage.setItem("role", response.data.data.role);
        localStorage.setItem("nama", response.data.data.nama);
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

  const formValidation = () => {
    let isError = false;

    Object.entries(formData).forEach((data) => {
      let [name, value] = data;

      if (name === "foto") {
        return false;
      }

      if (value === undefined || value === "") {
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

    setFormData((state) => ({ ...state, [name]: value }));
    if (name === "email") {
      if (value === undefined || value === "") {
        setFormDataError((state) => ({ ...state, [name]: "harus diisi." }));
      } else if (!value.includes("@") || !value.includes(".")) {
        setFormDataError((state) => ({ ...state, [name]: "tidak valid." }));
      } else {
        setFormDataError((state) => ({ ...state, [name]: false }));
      }
    } else {
      if (value === undefined || value === "") {
        setFormDataError((state) => ({ ...state, [name]: "harus diisi" }));
      } else {
        setFormDataError((state) => ({ ...state, [name]: false }));
      }
    }
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setFormDataError((state) => ({ ...state, foto: false }));
      setSelectedFile(null);
      return false;
    }

    if (file.size / 1000000 > 2) {
      setFormDataError((state) => ({
        ...state,
        foto: "Ukuran file tidak boleh lebih dari 2MB",
      }));
      e.target.value = null;
      setSelectedFile(null);
    } else if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setFormDataError((state) => ({
        ...state,
        foto: "Format file tidak valid",
      }));
      e.target.value = null;
      setSelectedFile(null);
    } else {
      setFormDataError((state) => ({ ...state, foto: false }));
      setSelectedFile(file);
    }
  };

  const uploadFile = () => {
    if (!selectedFile) {
      return false;
    }

    const formData = new FormData();
    formData.set("file", selectedFile, selectedFile.name);

    return api
      .post(`/upload`, formData, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        return error.response;
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var filename;
    setShowLoading(true);
    const response = await uploadFile();
    setShowLoading(false);

    if (response) {
      filename = response.data.filename;
    }

    delete formData._id;
    delete formData.created_at;

    if (!formValidation()) {
      return false;
    }

    setShowLoading(true);

    await api
      .put(
        `/pengguna/info`,
        { ...formData, foto: filename },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
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

  const handleSubmitUbahPassword = async (e) => {
    e.preventDefault();
    const { password } = formDataUbahPassword;

    if (!password || password.length < 6) {
      setFormDataUbahPasswordError({
        password: "harus diisi minimal 6 karakter.",
      });
      return false;
    }

    setShowLoading(true);

    await api
      .put(`/pengguna/ubah_password`, formDataUbahPassword, {
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

    fetchPengguna();
  }, []);

  return (
    <>
      <Helmet>
        <title>Edit Profile | INVENTORY</title>
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

      <div className="grid grid-cols-12 gap-4 items-start">
        <Card className="font-montserrat col-span-full md:col-span-6">
          <div className="font-montserrat font-bold text-lg text-gray-500 mb-6">
            Edit Profile
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center space-y-4">
              <img
                src={`${ENDPOINT}/img/${formData.foto}`}
                alt="User Profile"
                className="ring-2 ring-offset-4 ring-indigo-400 shadow-lg rounded-full w-20 mx-auto"
              />
              <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
                <div className="col-span-full md:col-span-4">Foto</div>
                <input
                  type="file"
                  className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  accept="image/jpeg,image/png"
                  onChange={handleChangeFile}
                />
                <div
                  className={`${
                    formDataError.foto ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {formDataError.foto}
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
                <div className="col-span-full md:col-span-4">
                  Username <span className="text-red-400">*</span>
                </div>
                <input
                  type="text"
                  className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  placeholder="Username"
                  value={formData.username}
                  disabled
                />
              </div>
              <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
                <div className="col-span-full md:col-span-4">
                  Nama Pengguna <span className="text-red-400">*</span>
                </div>
                <input
                  type="text"
                  className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  placeholder="Nama Pengguna"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                />
                <div
                  className={`${
                    formDataError.nama ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Nama pengguna ${formDataError.nama}`}
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
                <div className="col-span-full md:col-span-4">
                  Email <span className="text-red-400">*</span>
                </div>
                <input
                  type="email"
                  className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div
                  className={`${
                    formDataError.email ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Email ${formDataError.email}`}
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
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`No telp ${formDataError.no_telp}`}
                </div>
              </div>
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5 mt-6">
              Simpan
            </button>
          </form>
        </Card>
        <Card className="font-montserrat col-span-full md:col-span-6">
          <div className="font-montserrat font-bold text-lg text-gray-500 mb-6">
            Ubah Password
          </div>
          <form onSubmit={handleSubmitUbahPassword}>
            <div className="flex flex-col justify-center space-y-4">
              <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
                <div className="col-span-full md:col-span-4">
                  Password Baru <span className="text-red-400">*</span>
                </div>
                <input
                  type="text"
                  className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  placeholder="Password Baru"
                  name="password"
                  value={formDataUbahPassword.password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormDataUbahPassword({ password: value });
                    if (!value || value.length < 6) {
                      setFormDataUbahPasswordError({
                        password: "harus diisi minimal 6 karakter.",
                      });
                    } else {
                      setFormDataUbahPasswordError({
                        password: false,
                      });
                    }
                  }}
                />
                <div
                  className={`${
                    formDataUbahPasswordError.password ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Password baru ${formDataUbahPasswordError.password}`}
                </div>
              </div>
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5 mt-6">
              Simpan
            </button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default EditProfile;
