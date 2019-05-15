// yop_core_sub.js

'use strict';

// ####################################
// Just an help class
// ####################################

class CallStatistics {
  computeAge: number;
  computeBirthYear: number;

  constructor () {
    this.computeAge = 0;
    this.computeBirthYear = 0;
  }

  tickOffComputeAge () {
    this.computeAge += 1;
  }

  tickOffComputeBirthYear () {
    this.computeBirthYear += 1;
  }

  getStatistics () {
    let total = this.computeAge + this.computeBirthYear;
    let r = 'visit counts:\n';
    r += `computeAge calls         : ${this.computeAge}\n`;
    r += `computeBirthYear calls   : ${this.computeBirthYear}\n`;
    r += `total calls              : ${total}\n`;
    return r;
  }
}

// ####################################
// export ES6-module
// ####################################

export {
  CallStatistics
};
