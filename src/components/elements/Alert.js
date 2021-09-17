import { useEffect } from "react";

const Alert = ({
  children,
  show,
  afterClose,
}) => {
  let timer;

  const countdown = () => {
    timer = setTimeout(() => {
      afterClose();
    }, 3000);
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
      {children}
    </div>
  );
};
export default Alert;
