import * as dotenv from 'dotenv';
dotenv.config();

import {Application} from './src/Application';

import './src/controllers/HelloController';

new Application().start();