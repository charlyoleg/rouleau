/*! rouleau_sub.ts */

// the below two lines are tests about comments:
//! will this comment be removed? Yes
/*! this comment won't be removed as long as this is the first comment with ! */


function abc () {
  console.log("Hello from rouleau_sub.ts");
}

// ***********************
// exporting
// ***********************

export {
  abc
};

