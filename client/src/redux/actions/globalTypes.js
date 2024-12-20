export const GLOBALTYPES = {
  AUTH: "AUTH",
  ALERT: "ALERT",
  THEME: "THEME",
  MODAl: "MODAL",
  STATUS: "STATUS",
  SOCKET: "SOCKET",
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  CALL: 'CALL',
  PEER: 'PEER'
};

export const EditData = (data, id, post) => {
  if (!Array.isArray(data)) {
    data = [data];
  }
  const newData = data.map((item) => (item._id === id ? post : item));
  return newData;
};

export const DeleteData = (data, id) => {
  const newData = data.filter((item) => item._id !== id);
  return newData;
};
