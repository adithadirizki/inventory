import api from "../../config/api";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Card from "../../components/elements/Card";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../../components/elements/Button";
import moment from "moment";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    email: "",
    no_telp: "",
    role: "",
    status: "",
  });
  const history = useHistory();

  const fetchPengguna = async () => {
    await api
      .get(`/pengguna/info`, {
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
      <Card className="w-full sm:w-5/6 md:w-3/4 lg:w-1/2 mx-auto">
        <div className="font-montserrat font-bold text-gray-500 text-xl mb-6">
          Profile
        </div>

        <div className="flex flex-col font-montserrat text-gray-500 space-y-4">
          <div className="flex items-start space-x-4 mx-auto mb-4">
            {formData.foto ? (
              <img
                src={`/img/${formData.foto}`}
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
          <div className="text-right">
            <Link to="/profile/edit">
              <Button className="text-sm">Edit profile</Button>
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Profile;
