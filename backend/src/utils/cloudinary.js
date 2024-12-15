const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const streamifier = require("streamifier"); // To stream the file buffer to Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     fs.unlinkSync(localFilePath);
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath);
//     console.log("From cloufdinary: ", error);
//     return null;
//   }
// };

const uploadOnCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fileBuffer) return reject("No file buffer provided");

      // Create a readable stream from the buffer
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          fileBuffer = null;

          if (error) {
            // console.log("Error uploading to Cloudinary:", error);
            return reject(error);
          }
          // Resolve the promise with the result
          resolve(result);
        }
      );

      // Pipe the buffer into the Cloudinary stream
      streamifier.createReadStream(fileBuffer).pipe(stream);
    } catch (error) {
      fileBuffer = null;
      console.error("Error uploading image:", error);
      reject(error);
    }
  });
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
    return null;
  }
};

module.exports = { uploadOnCloudinary, getPublicId, deleteOnCloudinary };
