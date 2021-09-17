import { Redirect, Route } from "react-router-dom";

const PrivateRoute = (props) => {
  if (!localStorage.getItem("token")) {
    return <Redirect to="/login" />;
  } else {
    return <Route {...props} />;
  }
};

export default PrivateRoute;
