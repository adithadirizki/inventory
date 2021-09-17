import { useEffect } from "react";

const Alert = ({
  show,
  status = 200,
  message = "",
  duration = 3000,
  afterClose,
}) => {
  let timer;

  const countdown = () => {
    timer = setTimeout(() => {
      afterClose();
    }, duration);
  };

  useEffect(() => {
    if (show) {
      countdown();
    }
    return () => {
      clearTimeout(timer)
    }
  }, [show]);

  return (
    <div
      className={`fixed transform origin-top ${
        show ? "translate-y-0" : "-translate-y-32"
      } top-5 right-5 transition duration-500 z-30`}>
      <div
        className={`bg-${
          status === 200 ? "green" : "red"
        }-300 font-bold text-sm text-white rounded-lg px-8 py-3`}>
        {message}
      </div>
    </div>
  );
};
export default Alert;
