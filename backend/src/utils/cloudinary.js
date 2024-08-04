const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("From cloufdinary: ", error);
    return null;
  }
};

const getPublicId = async (imageCloudinaryUrl) => {
  if (!imageCloudinaryUrl) return null;
  const publicId = imageCloudinaryUrl
    .split("/res.cloudinary.com/")[1]
    .split("/")[4]
    .split(".png")[0];
  return publicId;
};

const deleteOnCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const { result } = await uploadOnCloudinary.uploader.destroy(publicId); //return {result: "ok"}
    return result;
  } catch (error) {
    console.log("Error while deleting image : ", error);
    return null;
  }
};

module.exports = { uploadOnCloudinary, getPublicId, deleteOnCloudinary };
