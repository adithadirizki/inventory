import api from "../config/api";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Card from "../components/elements/Card";
import { Button } from "../components/elements/Button";
import Alert from "../components/elements/Alert";
import Loading from "../components/elements/Loading";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [response, setResponse] = useState({
    status: 200,
    message: "Login Berhasil!",
    error: false,
  });
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(false);

    if (
      errorUsername ||
      errorPassword ||
      username.length === 0 ||
      password.length === 0
    ) {
      return false;
    }

    setLoading(true);
    await api
      .post("/auth/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        setResponse(response.data);
        setShowAlert(true);
        if (response.data.error === false) {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("username", response.data.data.username);
          localStorage.setItem("nama", response.data.data.nama);
          localStorage.setItem("foto", response.data.data.foto);
          localStorage.setItem("role", response.data.data.role);
          localStorage.setItem("token", response.data.token);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Login Page | INVENTORY</title>
      </Helmet>
      {loading ? (
        <div className="fixed bg-transparent w-full h-full">
          <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <Loading />
          </div>
        </div>
      ) : null}
      <Alert
        show={showAlert}
        status={response.status}
        message={response.message}
        duration={3000}
        afterClose={() => {
          setShowAlert(false);
          if (response.error === false) {
            history.push("/");
          }
        }}
      />
      <div className="font-poppins flex flex-col items-center bg-gray-200 w-full h-screen px-4">
        <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/6 p-8 m-auto">
          <Card>
            <img
              src="/img/logo.jpeg"
              alt="Logo"
              className="ring-2 ring-offset-4 ring-indigo-200 shadow-lg rounded-full object-cover w-20 h-20 mx-auto"
            />
            <div className="font-montserrat font-bold text-gray-500 text-xl text-center mt-4 mb-2">
              INVENTORY
            </div>
            <div className="border-b-2 w-1/4 mx-auto mb-6"></div>
            <form onSubmit={handleOnSubmit}>
              <div className="flex flex-col space-y-1 mb-4">
                <div className="font-lato font-bold text-gray-500">
                  Username
                </div>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 p-2"
                  placeholder="Username"
                  autoFocus
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/[^a-zA-Z0-9]/.test(value)) {
                      setErrorUsername(
                        "Username harus terdiri dari huruf atau angka."
                      );
                    } else if (value.length === 0) {
                      setErrorUsername("Username harus diisi.");
                    } else {
                      setErrorUsername(false);
                    }
                    setUsername(value);
                  }}
                />
                <div className="text-sm tracking-wide text-red-500">
                  {errorUsername}
                </div>
              </div>
              <div className="flex flex-col space-y-1 mb-4">
                <div className="font-lato font-bold text-gray-500">
                  Password
                </div>
                <input
                  type="password"
                  className="border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 p-2"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length === 0) {
                      setErrorPassword("Password harus diisi.");
                    } else if (value.length < 6) {
                      setErrorPassword("Panjang password minimal 6 karakter.");
                    } else {
                      setErrorPassword(false);
                    }
                    setPassword(value);
                  }}
                />
                <div className="text-sm tracking-wide text-red-500">
                  {errorPassword}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
