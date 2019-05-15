// yop_core.ts

"use strict";

// import * as yopCoreSub from "./yop_core_sub.js";
import * as yopCoreSub from "./yop_core_sub";

// ####################################
// helper stuff
// ####################################

const callStat = new yopCoreSub.CallStatistics();

// ####################################
// the yop core
// ####################################

/**
 * Compute the Age using the current year anf the birth-year
 * @param {int} birthYear - The year of birth
 * @returns {int} age - the age of the person
 */
function calcAge(birthYear = 2000) {
  console.log("yop_core: calcAge: birthYear: " + birthYear);
  callStat.tickOffComputeAge();
  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const rAge = curYear - birthYear;
  return rAge;
}

/**
 * Compute the year of birth using the age of the person
 * @param {int} age - the age of the person
 * @returns {int} birth-year - the year when the person was born
 */
function calcBirthYear(age = 20) {
  console.log("yop_core: calcBirthYear: age: " + age);
  callStat.tickOffComputeBirthYear();
  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const rBirthYear = curYear - age;
  return rBirthYear;
}

/**
 * The sugar
 * @returns {json} - containing text on how oft the previous functions have been used
 */
function callActivities() {
  console.log("yop_core: callActivities");
  return { visit_stat: callStat.getStatistics() };
}

// ####################################
// module export
// ####################################

export {
  calcAge,
  calcBirthYear,
  callActivities
};
