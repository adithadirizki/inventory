import Card from "./elements/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBox, faDatabase, faFileInvoice } from "@fortawesome/free-solid-svg-icons";

const Content = () => {
  return (
    <div className="w-full min-h-screen p-6">
      <Card>
        <div className="font-poppins text-lg text-gray-500">Dashboard</div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-3 text-center rounded-lg shadow-lg p-6">
            <div className="flex items-center rounded-full shadow-md w-16 h-16 mx-auto mb-4">
              <FontAwesomeIcon
                icon={faUser}
                className="text-green-200 text-3xl mx-auto"
              />
            </div>
            <div className="font-montserrat font-bold text-lg">
              5
            </div>
               Pengguna
          </div>

          <div className="col-span-3 text-center rounded-lg shadow-lg p-6">
            <div className="flex items-center rounded-full shadow-md w-16 h-16 mx-auto mb-4">
              <FontAwesomeIcon
                icon={faBox}
                className="text-yellow-200 text-3xl mx-auto"
              />
            </div>
            <div className="font-montserrat font-bold text-lg">
              63
            </div>
               Barang
          </div>

          <div className="col-span-3 text-center rounded-lg shadow-lg p-6">
            <div className="flex items-center rounded-full shadow-md w-16 h-16 mx-auto mb-4">
              <FontAwesomeIcon
                icon={faFileInvoice}
                className="text-indigo-200 text-3xl mx-auto"
              />
            </div>
            <div className="font-montserrat font-bold text-lg">
              671
            </div>
               Transaksi
          </div>

          <div className="col-span-3 text-center rounded-lg shadow-lg p-6">
            <div className="flex items-center rounded-full shadow-md w-16 h-16 mx-auto mb-4">
              <FontAwesomeIcon
                icon={faDatabase}
                className="text-red-200 text-3xl mx-auto"
              />
            </div>
            <div className="font-montserrat font-bold text-lg">
              1871
            </div>
               Stok Terjual
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Content;
