import * as UUIDV4 from 'uuid/v4';
import * as Mime from 'mime';

import {Service, Inject} from 'mvc';

import {QiNiu} from '../vendor/Qiniu';
import { UploadFile, File } from '../model';


export class FileService {
  @Inject()
  private qiniu: QiNiu;

  @Inject()
  private file: File;

  private _generateSavekey(type: string) {
    return `${UUIDV4()}.${Mime.getExtension(type)}`;
  }

  public async saveCdn(file: UploadFile) {
    const savekey: string = this._generateSavekey(file.type);
    const result = await this.qiniu.upload(savekey, file.path, [file.type]);

    file.cdn = result;
    file.extension = Mime.getExtension(file.type);

    const saveFile: File = this.file.schema(file);
    const saveResult = await this.file.getCollection().insertOne(saveFile);
    saveFile._id = saveResult.insertedId;

    return saveFile;
  }

  public async getFileById(_id: Mongodb.ObjectID) {
    return await this.file.getCollection().findOne({_id});
  }

  public generateFileLink(key: string): string {
    return this.qiniu.generateLink(key, this.qiniu.config.TOKEN_EXPIRE);
  }

  public genetateFileDownloadLink(key: string, rename: string) {
    return this.qiniu.generateDownloadLink(key, this.qiniu.config.TOKEN_EXPIRE, rename);
  }
}