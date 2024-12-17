import { RootState, store } from "@/store";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { setProfile, logout, login } from "@/store/user-slice";
import { userProfileApi } from "@/api/user";
import SpinnerWithText from "../UI/spinner-text";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuthToken = async () => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        const parsedToken = JSON.parse(token) as Token;
        const currentTime = Date.now();
        if (parsedToken.exp && parsedToken.exp > currentTime) {
          try {
            const response = await userProfileApi(parsedToken.value);
            if (response.success) {
              store.dispatch(login());
              dispatch(setProfile({ user: response.data }));
            } else {
              sessionStorage.removeItem("authToken");
              dispatch(logout());
            }
          } catch (error) {
            sessionStorage.removeItem("authToken");
            dispatch(logout());
          }
        } else {
          sessionStorage.removeItem("authToken");
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
      setLoading(false);
    };

    syncAuthToken();
  }, [dispatch]);

  useEffect(() => {
    if (
      user?.role_id === 1 &&
      window.location.pathname === "/vendor/dashboard"
    ) {
      navigate("/404");
    } else if (
      user?.role_id === 2 &&
      window.location.pathname === "/hr/dashboard"
    ) {
      navigate("/404");
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="z-20 flex h-screen w-screen items-center justify-center">
        <SpinnerWithText text="Loading..." />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
