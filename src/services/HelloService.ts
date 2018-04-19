import {Service} from '../../server/lib/meta/decorator/Service';

@Service()
export class HelloService {

  public echo(q: string) {
    if (typeof q === 'undefined') {
      return 'there';
    }
    return q;
  }
}