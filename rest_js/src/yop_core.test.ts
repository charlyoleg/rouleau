// yop_core.test.ts

// A black-magic solution from ESM, waiting for the official support for es6-module by nodejs, planned with node-V12.0
// require = require('esm')(module/*, options*/);
// const yop_core = require('./yop_core.js');
// With node V12.0 and typescript we have
import * as yop_core from "./yop_core";

test("dummy age computation", () => {
  expect(yop_core.calcAge(0)).toBe(2019);
});

test("concrete age computation", () => {
  expect(yop_core.calcAge(1978)).toBe(41);
});

test("simple birth-year computation", () => {
  expect(yop_core.calcBirthYear(20)).toBe(1999);
});

test("looking at yop_core activities", () => {
  expect(yop_core.callActivities().visit_stat).toMatch(/visit counts:/);
});
