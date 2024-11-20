import axios from "axios";

export const getDataAPI = async (url, token) => {
  try {
    const res = await axios.get(process.env.REACT_APP_API_URL + `/api/${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const postDataAPI = async (url, post, token) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + `/api/${url}`,
      post,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res;
  } catch (error) {
    console.error("POST Error:", error.response?.data || error.message);
    throw error;
  }
};

export const putDataAPI = async (url, post, token) => {
  try {
    const res = await axios.put(
      process.env.REACT_APP_API_URL + `/api/${url}`,
      post,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res;
  } catch (error) {
    console.error("PUT Error:", error.response?.data || error.message);
    throw error;
  }
};

export const patchDataAPI = async (url, post, token) => {
  try {
    const res = await axios.patch(
      process.env.REACT_APP_API_URL + `/api/${url}`,
      post,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res;
  } catch (error) {
    console.error("PATCH Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteDataAPI = async (url, token) => {
  try {
    const res = await axios.delete(process.env.REACT_APP_API_URL`/api/${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    console.error("DELETE Error:", error.response?.data || error.message);
    throw error;
  }
};
