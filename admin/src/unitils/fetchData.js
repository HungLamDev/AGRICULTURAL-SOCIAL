import axios from "axios";

export const getDataAPI = async (url, token) => {
  console.log("API URL:", `/api/${url}`, token);
  try {
    const res = await axios.get(`/api/${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    console.error("GET Error:", error.response?.data || error.message);
    throw error;
  }
};

export const postDataAPI = async (url, post, token) => {
  console.log("API URL:", `/api/${url}`, { token }, { post });
  try {
    const res = await axios.post(`/api/${url}`, post, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    console.error("POST Error:", error.response?.data || error.message);
    throw error;
  }
};

export const putDataAPI = async (url, post, token) => {
  console.log("API URL:", `/api/${url}`, token, post);
  try {
    const res = await axios.put(`/api/${url}`, post, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    console.error("PUT Error:", error.response?.data || error.message);
    throw error;
  }
};

export const patchDataAPI = async (url, post, token) => {
  console.log("API URL:", `/api/${url}`);
  try {
    const res = await axios.patch(`/api/${url}`, post, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    console.error("PATCH Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteDataAPI = async (url, token) => {
  console.log("API URL:", `/api/${url}`);
  try {
    const res = await axios.delete(`/api/${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    console.error("DELETE Error:", error.response?.data || error.message);
    throw error;
  }
};
