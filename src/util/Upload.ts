import { PutBlobResult } from "@vercel/blob";
import { envValues } from "./envValues";

export function base64ToBuffer(base64: string) {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

export const uploadImage = async(files : FileList) => {
  const file = files[0];

  const response = await fetch(
    `/api/upload?filename=${file.name}`,
    {
      method: 'POST',
      body: file,
    },
  );
  const newBlob = (await response.json()) as PutBlobResult;
  return newBlob.url;
}