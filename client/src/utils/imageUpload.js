export const checkImage = (file) => {
  let err = "";
  if (!file) return (err = "Chưa thêm tệp cần tải lên !");
  if (file.size > 1024 * 1024) err = "Kích thước tệp quá lớn !";
  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Sai định dạng tệp !";
  return err;
};
export const imageUpload = async (images) => {
  let arr = [];
  for (const item of images) {
    const formData = new FormData();

    if (item.camera) {
      formData.append("file", item.camera);
    } else {
      formData.append("file", item);
    }
    formData.append("upload_preset", "xjsbjixe");
    formData.append("cloud_name", "drn3gltau");
    formData.append("folder", "AGRICULTURAL-SOCIAL");
    // CLOUDINARY_URL=cloudinary://<769727393517964>:<f5PzoK7m82enk1XbzE5PwKwGqLk>@drn3gltau
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/drn3gltau/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();

    console.log(data);

    arr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return arr;
};
