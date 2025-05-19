// src/utils/cloudinary.js
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({ 
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  },
  url: {
    secure: true,
  },
});

export default cld;
