import { checkLocation } from "../api/userApi";

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

    console.log("Latitude: " + latitude + ", Longitude: " + longitude);

    if (!latitude || !longitude) {
      throw new Error("Unable to retrieve location. Please try again.");
    }

    const userLocation = await checkLocation(latitude, longitude);

    if (userLocation === "Error occurred") {
      throw new Error(userLocation);
    }

    return userLocation;
  } catch (error) {
    console.error("Error retrieving location:", error);
    throw new Error(
      "There was an error checking your location. Please try again later."
    );
  }
};

export default handlePermissionRequest;
