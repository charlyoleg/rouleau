/*! rouleau_app.ts */

import * as rlSub from './rouleau_sub.js';

console.log("Hello from rouleau_app.ts");
rlSub.abc();

const btn_pwainstall = document.querySelector("#pwainstall");
let deferredPrompt:Event;

// browser triggers the following event if this app matches the PWA criteria!
window.addEventListener('beforeinstallprompt', (evt:Event) => {
  console.log('The browser considered the app Rouleau as a PWA');
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  //evt.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = evt;
  // Update UI notify the user they can add to home screen
  //btn_pwainstall.style.display = 'block';
});

// Button to install the app
btn_pwainstall.addEventListener('click', (evt:Event) => {
  console.log('Click on btn_pwainstall');
  // hide our user interface that shows our A2HS button
  //btn_pwainstall.style.display = 'none';
  // Show the prompt
  //deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  //deferredPrompt.userChoice
  //  .then((choiceResult) => {
  //    if (choiceResult.outcome === 'accepted') {
  //      console.log('User accepted the A2HS prompt');
  //    } else {
  //      console.log('User dismissed the A2HS prompt');
  //    }
  //    //deferredPrompt = null;
  //  });
});

// check is the pwa has been installed
window.addEventListener('btn_appinstalled', (evt:Event) => {
  console.log('a2hs installed');
});


