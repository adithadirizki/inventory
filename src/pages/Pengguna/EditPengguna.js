import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "../../components/elements/Button";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";

const EditPengguna = (props) => {
  const { id } = props.match.params;
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    email: "",
    no_telp: "",
    role: "",
    status: "",
  });
  const [formDataError, setFormDataError] = useState({
    username: false,
    nama: false,
    email: false,
    no_telp: false,
    role: false,
    status: false,
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
    status: 200,
    message: "",
    duration: 3000,
  });
  const history = useHistory();

  const fetchPengguna = async () => {
    await api
      .get(`/pengguna/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setFormData(response.data.data);
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

      if (name === "foto") {
        return false;
      }

      if (name === "no_telp") {
        value = value.replace(/\D/g, "");
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
    } else if (name === "status") {
      value = value.replace(/\D/g, "");
      value = parseInt(value);
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

    if (file.size / 1000000 > 2) {
      setSelectedFile(null);
    }
    if (
      file.type !== "image/jpeg" ||
      file.type !== "image/jpg" ||
      file.type !== "image/png"
    ) {
      setSelectedFile(null);
    }
    setSelectedFile(file);
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
        if (error.response.status === 401) {
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
        `/pengguna/${id}`,
        { ...formData, foto: filename },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
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
      .put(`/pengguna/${id}/ubah_password`, formDataUbahPassword, {
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
    fetchPengguna();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Edit Pengguna | INVENTORY</title>
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
      <div className="grid grid-cols-12 gap-x-4 items-start">
        <Card className="font-montserrat col-span-full md:col-span-6">
          <div className="font-montserrat font-bold text-lg text-gray-500 mb-6">
            Edit Pengguna
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center text-sm space-y-4">
              <img
                src={`/img/${formData.foto}`}
                alt="User Profile"
                className="ring-2 ring-offset-4 ring-indigo-400 shadow-lg rounded-full w-20 mx-auto"
              />
              <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
                <div className="col-span-full md:col-span-4">Foto</div>
                <input
                  type="file"
                  className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  onChange={handleChangeFile}
                />
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
                  } md:col-start-5 col-span-full text-xs text-red-400`}>
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
                  } md:col-start-5 col-span-full text-xs text-red-400`}>
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
                  } md:col-start-5 col-span-full text-xs text-red-400`}>
                  {`No telp ${formDataError.no_telp}`}
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
                <div className="col-span-full md:col-span-4">
                  Role <span className="text-red-400">*</span>
                </div>
                <select
                  className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  value={formData.role}
                  name="role"
                  onChange={handleChange}>
                  <option value="" disabled>
                    -- Pilih Role --
                  </option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
                <div
                  className={`${
                    formDataError.role ? "" : "hidden"
                  } md:col-start-5 col-span-full text-xs text-red-400`}>
                  {`Role ${formDataError.role}`}
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
                <div className="col-span-full md:col-span-4">
                  Status <span className="text-red-400">*</span>
                </div>
                <select
                  className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  value={formData.status}
                  name="status"
                  onChange={handleChange}>
                  <option value="" disabled>
                    -- Pilih Status --
                  </option>
                  <option value="1">Aktif</option>
                  <option value="0">Nonaktif</option>
                </select>
                <div
                  className={`${
                    formDataError.status ? "" : "hidden"
                  } md:col-start-5 col-span-full text-xs text-red-400`}>
                  {`Status ${formDataError.status}`}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button className="text-sm">Simpan</Button>
            </div>
          </form>
        </Card>
        <Card className="font-montserrat col-span-full md:col-span-6">
          <div className="font-montserrat font-bold text-lg text-gray-500 mb-6">
            Ubah Password
          </div>
          <form onSubmit={handleSubmitUbahPassword}>
            <div className="flex flex-col justify-center text-sm space-y-4">
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
                  } md:col-start-5 col-span-full text-xs text-red-400`}>
                  {`Password baru ${formDataUbahPasswordError.password}`}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button className="text-sm">Simpan</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default EditPengguna;
