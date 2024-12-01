// import secureLocalStorage from "react-secure-storage";
// import { checkLocation } from "../api/userApi";

const handlePermissionRequest = async () => {
  try {
    // Check if Geolocation is supported
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser.");
    }

    // Get current position
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    if (!latitude || !longitude) {
      throw new Error("Unable to retrieve location. Please try again.");
    }

    // const isUser = secureLocalStorage.getItem("user");

    let userLocation;

    // console.log("Calling 1");

    // if (isUser) {
    //   console.log("Calling 2");
    //   userLocation = await checkLocation(18.9894, 73.1175);

    //   console.log("Userlocation = ", userLocation);

    //   if (userLocation === "Error occured") {
    //     throw new Error(userLocation);
    //   }

    //   return userLocation;
    // }

    userLocation = {
      latitude,
      longitude,
    };

    return userLocation;
  } catch (error) {
    console.error("Error retrieving location:", error);
    throw new Error(
      "There was an error checking your location. Please try again later."
    );
  }
};

export default handlePermissionRequest;
