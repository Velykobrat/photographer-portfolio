const CLOUD_NAME = 'dln0hogkt';

export const getCloudinaryImage = (
  publicId: string,
  width = 1200
) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
};