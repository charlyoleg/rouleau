// fingerprint.js
// generates values at build time

// adjust manually
major_minor_hotfix = '0.1.0';

// inherit from the build serve
build_number = process.env.BUILD_NUMBER; // if using Jenkins
//build_number = process.env.CI_CONCURRENT_ID; // if using Gitlab

if (build_number === undefined){
  console.log("WARN023: No build-number defined!");
  build_number = 0;
}

let current_date = new Date();

// the exports
exports.version = major_minor_hotfix + '.' + build_number.toString();
exports.build_date = current_date.toUTCString();
//exports.hostname = 'nafnaf';
//exports.username = 'charlyoleg';
exports.git_repo_name = 'rouleau';
exports.git_branch_name = 'master';
exports.git_commit_hash = 'abc';
exports.git_commit_author = 'abc';
exports.git_commit_date = 'abci2';
exports.git_commit_message = 'abc3';

// printf for debug
console.log("fingerprint info:");
console.log("version:", exports.version);
console.log("build_date:", exports.build_date);
console.log("git_repo_name:", exports.git_repo_name);
console.log("git_branch_name:", exports.git_branch_name);
console.log("git_commit_hash:", exports.git_commit_hash);
console.log("git_commit_author:", exports.git_commit_author);
console.log("git_commit_date:", exports.git_commit_date);
console.log("git_commit_message:", exports.git_commit_message);

