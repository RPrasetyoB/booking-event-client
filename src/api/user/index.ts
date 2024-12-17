import api, { API_URL } from "..";

export const loginApi = async (userData: LoginType) => {
  try {
    const response = await api.post(`/auth/login`, userData);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const userProfileApi = async (token: string) => {
  try {
    const response = await api.get(`/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getAllVendorsApi = async (token: string) => {
  try {
    const response = await api.get(`/vendors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
