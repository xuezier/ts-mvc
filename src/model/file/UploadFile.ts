import {Model} from 'mvc';

export class UploadFile {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: {
    'content-disposition': string;
    'content-type': string;
  };
  size: number;
  name: string;
  type: string;
}