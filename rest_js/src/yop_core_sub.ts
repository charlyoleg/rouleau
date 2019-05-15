// yop_core_sub.ts

"use strict";

// ####################################
// Just an help class
// ####################################

class CallStatistics {
  public computeAge: number;
  public computeBirthYear: number;

  constructor() {
    this.computeAge = 0;
    this.computeBirthYear = 0;
  }

  public tickOffComputeAge() {
    this.computeAge += 1;
  }

  public tickOffComputeBirthYear() {
    this.computeBirthYear += 1;
  }

  public getStatistics() {
    const total = this.computeAge + this.computeBirthYear;
    let r = "visit counts:\n";
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
