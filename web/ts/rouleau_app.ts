/*! rouleau_app.ts */

import * as rlSub from './rouleau_sub.js';

// =========================
// dummy stuff to be deleted at the end of development
// =========================

console.log("Hello from rouleau_app.ts");
rlSub.abc();


// =========================
// PWA installation
// =========================

// html elements
const btn_pwainstall:HTMLButtonElement = document.querySelector("#pwa_install");
const btn_pwauninstall:HTMLButtonElement = document.querySelector("#pwa_uninstall");
const pwa_install_status:HTMLSpanElement = document.querySelector("#pwa_install_status");

// variable declarations
let deferredPrompt:BeforeInstallPromptEvent;

// browser triggers the following event if this app matches the PWA criteria!
window.addEventListener('beforeinstallprompt', (evt:BeforeInstallPromptEvent) => {
  console.log('INFO020: The browser considered the app Rouleau as a PWA');
  console.log('Detected platform: ', evt.platforms);
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  evt.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = evt;
  // Update UI to enable the install button
  btn_pwainstall.disabled = false;
});

// check is the pwa has been installed
window.addEventListener('appinstalled', (evt:Event) => {
  console.log('a2hs installed');
  pwa_install_status.innerHTML = "Rouleau is installed on your device";
  pwa_install_status.style.background = 'green';
});

// Button to install the app
btn_pwainstall.addEventListener('click', (evt:Event) => {
  console.log('Click on btn_pwainstall');
  // Update UI to disable the install button again
  btn_pwainstall.disabled = true;
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  pwa_install_status.innerHTML = "Rouleau has been installed";
});

// Button to uninstall the app
btn_pwauninstall.addEventListener('click', (evt:Event) => {
  console.log('Click on btn_pwauninstall');
  console.log('Nothing done! Uninstall is not implemented!');
  pwa_install_status.innerHTML = "Rouleau has been uninstalled";
});


// =========================
// Layout explanation
// =========================

// html elements
const layout_expl_back:HTMLButtonElement = document.querySelector("#layout_expl_back");
const layout_expl_next:HTMLButtonElement = document.querySelector("#layout_expl_next");
//const layout_expl_status:HTMLSpanElement = document.querySelector("#layout_expl_status");

// Button layout_expl_back
layout_expl_back.addEventListener('click', (evt:Event) => {
  console.log('Click on layout_expl_back');
  //layout_expl_status.innerHTML = "T'as cliqué sur Back";
  //layout_expl_status.style.background = 'lightblue';
  window.location.href = '#';
});

// Button layout_expl_next
layout_expl_next.addEventListener('click', (evt:Event) => {
  console.log('Click on layout_expl_next');
  //layout_expl_status.innerHTML = "T'as cliqué sur Next";
  //layout_expl_status.style.background = 'yellowgreen';
  window.location.href = '#a-proposal';
});


// =========================
// A proposal
// =========================

// html elements
const prop1_reset:HTMLButtonElement = document.querySelector("#prop1_reset");
const prop1_submit:HTMLButtonElement = document.querySelector("#prop1_submit");
const prop1_status:HTMLSpanElement = document.querySelector("#prop1_status");
const prop1_result:HTMLOutputElement = document.querySelector("#prop1_result");
const prop1_form:HTMLFormElement = document.querySelector("#prop1_form");
let prop1_choice:string = null;

// Form prop1_form
prop1_form.addEventListener('change', (evt:Event) => {
  console.log('The form prop1_form has been changed');
  if (prop1_choice != null) {
    prop1_status.innerHTML = "input and output are out of sync!";
    prop1_status.style.background = '#ff9933';
  }
});

// Button prop1_reset
prop1_reset.addEventListener('click', (evt:Event) => {
  console.log('Click on prop1_reset');
  if (prop1_choice != null) {
    prop1_status.innerHTML = "Back to the submitted value";
    prop1_status.style.background = 'yellowgreen';
    //document.querySelector('input[name=radio_prop1]').value = prop1_choice;
    (<HTMLInputElement>document.querySelector('#prop1_' + prop1_choice)).checked = true;
  }
});

// Button prop1_submit
prop1_submit.addEventListener('click', (evt:Event) => {
  console.log('Click on prop1_submit');
  prop1_status.innerHTML = "A voté!";
  prop1_status.style.background = 'yellowgreen';
  prop1_choice = (<HTMLInputElement>document.querySelector('input[name=radio_prop1]:checked')).value;
  prop1_result.innerHTML = "The opinion is " + prop1_choice;
});


