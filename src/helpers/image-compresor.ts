import imageCompression from 'browser-image-compression';

export async function compressImage(file: File) {
  const options = {
    maxSizeMB: 0.06,
    initialQuality: 0.4,
    maxWidthOrHeight: 650,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}
