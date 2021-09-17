import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { ENDPOINT } from "../config/api";

const Navbar = () => {
  const Dropdown = () => {
    return (
      <>
        <div
          className="absolute bg-white font-montserrat text-gray-600 transform translate-x-0 translate-y-3/4 shadow-xl rounded w-48"
          style={{
            opacity: 0,
            visibility: "hidden",
            transition: "opacity .3s ease-in-out, visibility .5s ease-in-out",
          }}>
          <div className="font-bold bg-gray-100 text-gray-500 text-center border-b px-4 py-2">
            {localStorage.getItem("nama")}
          </div>
          <div className="flex flex-col text-sm">
            <Link to="/profile" className="hover:bg-gray-100 px-4 py-2.5">
              <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
              Profle
            </Link>
            <Link to="/logout" className="hover:bg-gray-100 px-4 py-2.5">
              <FontAwesomeIcon
                icon={faPowerOff}
                className="text-gray-500 mr-2"
              />
              Logout
            </Link>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className={`sticky top-0 transform bg-gray-600 font-poppins text-gray-200 shadow-lg w-full z-20 p-4`}>
      <div className="relative flex items-center justify-end">
        <div
          className="flex items-center cursor-pointer space-x-2"
          onClick={(e) => {
            const dropdown = e.currentTarget.nextElementSibling;
            var visibility = dropdown.style.visibility;
            if (visibility === "hidden") {
              dropdown.style.opacity = "1";
              dropdown.style.visibility = "visible";
            } else {
              dropdown.style.opacity = "0";
              dropdown.style.visibility = "hidden";
            }
          }}>
          <div className="font-montserrat font-bold">
            {localStorage.getItem("nama")}
          </div>
          <img
            src={`${ENDPOINT}/img/${localStorage.getItem("foto")}`}
            alt="User Profile"
            className="shadow-lg rounded-full object-cover w-8 h-8"
          />
        </div>
        <Dropdown />
      </div>
    </div>
  );
};

export default Navbar;
