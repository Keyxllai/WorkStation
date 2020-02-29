import * as mainModule from './MainNodeModule'

import * as core from "./base/addin/Addin"

core.publicApi('WS', core);
core.publicApi('WS', mainModule);

import { WorkStation } from "./workstation/WorkStation";

var workstation = new WorkStation();

workstation.start();