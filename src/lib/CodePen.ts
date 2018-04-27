import {createCanvas} from 'canvas';

import {Component, Inject} from 'mvc';
import { ImageCodeRedisService } from '../services';

@Component()
export class CodePen {
  @Inject()
  private imageCodeRedis: ImageCodeRedisService;

  private codeLength: number = 4;
  private fontsizes: number[] = [15, 17, 19, 21, 23, 25];
  private colors: string[] = ['rgb(255,165,0)', 'rgb(16,78,139)', 'rgb(0,139,0)', 'rgb(255,0,0)'];
  private trans: {c: number[], b: number[]} = {c: [-0.108, 0.108], b: [-0.05, 0.05]};
  private templateChars: string = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  private templateFont: string = 'bold {FONTSIZE}px Impact';
  private start: number = 3;
  private distance: number = 31;
  private width: number = 150;
  private height: number = 60;

  public async drawCode() {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    const code: string = await this._generateCode();

    let start = this.start;

    for(let char of code) {
      ctx.font = this.templateFont.replace('{FONTSIZE}', this.fontsizes[Math.round(Math.random() * 18) % this.fontsizes.length]);
      ctx.fillStyle = this.colors[Math.round(Math.random() * 10) % this.colors.length];
      ctx.fillText(char, start, 21);

      let c = this._getRandom(this.trans['c'][0], this.trans['c'][1]);
      let b = this._getRandom(this.trans['b'][0], this.trans['b'][1]);
      // ctx.transform(1, b, c, 1, 0, 0);

      start += this.distance;
    }

    const pngStream: Stream = canvas.pngStream();
    return {code, pngStream};
  }

  private async _generateCode(): string {
    let code: string = '';
    for(let i = 0; i < this.codeLength; i++) {
      code += this.templateChars.substr(parseInt(Math.random() * 35), 1);
    }

    const exists = await this.imageCodeRedis.codeExists(code);
    if(exists) {
      return this._generateCode();
    }

    return code;
  }

  private _getRandom(start: number, end: number): number {
    return start + Math.random() * (end - start);
  }
}