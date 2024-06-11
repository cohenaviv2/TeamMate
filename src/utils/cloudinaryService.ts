import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from "cloudinary-react-native";

const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_COULD_NAME;

const cloudinary = new Cloudinary({
  cloud: { cloudName: cloudName },
  url: { secure: true },
});

async function uploadImage(imageUri: string, name: string): Promise<string> {
  const file = {
    uri: imageUri,
    type: "image",
    name,
  };
  const options = {
    upload_preset: uploadPreset,
  };
  return new Promise((resolve, reject) => {
    upload(cloudinary, {
      file,
      options,
      callback: (error: any, response: any) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(response.secure_url);
        }
      },
    });
  });
}

export { uploadImage };
