import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Navbar from "./Navbar.js";
import Sidebar from "./Sidebar";

const Container = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <div className="flex flex-1">
        <div
          className={`fixed lg:sticky top-0 bg-gray-600 transform shadow-xl ${
            showSidebar ? "translate-x-0 lg:translate-x-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5" : "-translate-x-full lg:-translate-x-full w-0"
          } h-screen z-30 py-4`}
          style={{
            transition: "width .5s ease-in-out, transform .5s ease-in-out",
          }}>
          <Sidebar show={showSidebar} onShown={(show) => setShowSidebar(show)} />
          <div className="absolute top-2 left-full bg-gray-600 p-4">
            <button
              onClick={() => {
                setShowSidebar((state) => !state);
              }}>
              <FontAwesomeIcon
                icon={faBars}
                className="text-gray-200 text-xl"
              />
            </button>
          </div>
        </div>
        <div
          className={`${
            showSidebar ? "translate-x-0" : "-translate-x-1/5"
          } w-full`}
          style={{
            transition: "transform .5s ease-in-out",
          }}>
          <Navbar
            onToggleClick={(status) =>
              setShowSidebar(status === "open" ? true : false)
            }
          />
          <div className="w-full p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Container;
