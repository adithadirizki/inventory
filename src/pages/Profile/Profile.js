import api, { ENDPOINT } from "../../config/api";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Card from "../../components/elements/Card";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../../components/elements/Button";
import moment from "moment";
import Loading from "../../components/elements/Loading";

const Profile = () => {
  const [formData, setFormData] = useState({
    foto: "",
    username: "",
    nama: "",
    email: "",
    no_telp: "",
    role: "",
    status: "",
    created_at: "",
  });
  const [showLoading, setShowLoading] = useState(false);
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
        <title>Profile | INVENTORY</title>
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
          Profile
        </div>

        <div className="flex flex-col font-montserrat text-gray-500 space-y-4">
          <div className="flex items-start space-x-4 mx-auto mb-4">
            {formData.foto ? (
              <img
                src={`${ENDPOINT}/img/${formData.foto}`}
                alt="User Profile"
                className="ring-2 ring-offset-4 ring-indigo-400 shadow-lg rounded-full w-20"
              />
            ) : null}
            <div className="flex flex-col items-start">
              <div className="font-bold">{formData.nama}</div>
              <div className="text-sm italic mb-2">{formData.email}</div>
              <div
                className={`inline-block font-poppins ${
                  formData.status ? "bg-green-400" : "bg-red-400"
                } text-white text-center text-xs rounded-full px-4 py-1`}>
                {formData.status ? "Aktif" : "Nonaktif"}
              </div>
            </div>
          </div>
          <div>
            <div className="font-bold text-sm">Username</div>
            {formData.username}
          </div>
          <div>
            <div className="font-bold text-sm">No telp</div>
            {formData.no_telp}
          </div>
          <div>
            <div className="font-bold text-sm">Role</div>
            {formData.role}
          </div>
          <div>
            <div className="font-bold text-sm">Tgl terdaftar</div>
            {moment(formData.created_at).format("DD MMM YYYY [pukul] HH:mm")}
          </div>
          <div className="flex justify-end">
            <Link
              to="/profile/edit"
              className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5">
              Edit Profile
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Profile;
