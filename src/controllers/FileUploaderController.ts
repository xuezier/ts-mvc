import {Get, Res, RestController, Inject, QueryParam} from 'mvc';
import { QiNiu } from '../vendor/Qiniu';

@RestController('/api/file')
export class FileUploaderController {
  @Inject()
  private qiniu: QiNiu;

}