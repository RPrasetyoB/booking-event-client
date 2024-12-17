import { userProfileApi } from "@/api/user";
import { RootState, store } from "@/store";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "@/store/user-slice";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchUser = useCallback(async () => {
    const authToken = sessionStorage.getItem("authToken");
    const parsedToken = JSON.parse(authToken!) as Token;
    const currentTime = Date.now();
    try {
      if (authToken && parsedToken.exp > currentTime) {
        const response = await userProfileApi(parsedToken.value);
        if (response.success) {
          dispatch(setProfile({ user: response.data }));
          if (response?.data.role_id === 1) {
            navigate("/hr/dashboard");
          } else if (response?.data.role_id === 2) {
            navigate("/vendor/dashboard");
          }
        }
      } else {
        sessionStorage.removeItem("authToken");
        navigate("/login");
      }
    } catch (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <div></div>;
}
