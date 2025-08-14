import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    // Append the image file to the FormData object
    formData.append("image", imageFile);

    try {
        // Make the API call to upload the image
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Return the response data
        return response.data;
    } catch (error) {
        // Handle errors appropriately
        console.error("Error uploading image:", error);
        throw error; // Re-throw the error for further handling if needed
    }
};

export default uploadImage;