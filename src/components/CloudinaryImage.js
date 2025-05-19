import React from 'react';
import cld from '../utils/cloudinary'; // Importing the Cloudinary instance
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

const CloudinaryImage = () => {
  // Replace 'cld-sample-5' with your actual Cloudinary image public ID
  const img = cld
    .image('cld-sample-5')
    .format('auto') // Automatically format the image
    .quality('auto') // Optimize image quality
    .resize(auto().gravity(autoGravity()).width(500).height(500)); // Resize with auto-crop

  return (
    <div>
      <h1>Cloudinary Image</h1>
      <AdvancedImage cldImg={img} />
    </div>
  );
};

export default CloudinaryImage;
