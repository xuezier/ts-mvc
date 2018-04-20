import {Get, Res, RestController, Inject, QueryParam} from '../../server';
import {HelloService} from '../services/HelloService';
import * as Express from 'express';

@RestController('/')
export class HealthcheckController {

    @Inject()
    private helloService: HelloService;

    @Get('/say')
    public async indexAction(@QueryParam('q') q: string, @QueryParam('k') k: string, @Res() res: Express.Response) {
      console.log(q, k);
      const result = this.helloService.echo(q);
      // res.send('Hello ' + result);
      res.sendJson({name: 'heiheihei'});
    }

}