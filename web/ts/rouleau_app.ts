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
const layout_expl_back:HTMLButtonElement = document.querySelector("#layout-explanations .action_button_reset");
const layout_expl_next:HTMLButtonElement = document.querySelector("#layout-explanations .action_button_submit");
//const layout_expl_status:HTMLSpanElement = document.querySelector("#layout-explanations .action_status");

// Button layout_expl_back
layout_expl_back.addEventListener('click', (evt:Event) => {
  console.log('Click on layout_expl_back');
  //layout_expl_status.innerHTML = "T'as cliqué sur Back";
  //layout_expl_status.style.background = 'lightblue';
  window.location.href = '#layout-explanations';
});

// Button layout_expl_next
layout_expl_next.addEventListener('click', (evt:Event) => {
  console.log('Click on layout_expl_next');
  //layout_expl_status.innerHTML = "T'as cliqué sur Next";
  //layout_expl_status.style.background = 'yellowgreen';
  window.location.href = '#a-proposal';
});


// =========================
// The Generic Vote island
// =========================

abstract class AbstractVoteIsland {
  island_id: string;
  island_refusal: boolean;
  island_refusal_hint: string;
  island: HTMLDivElement;
  the_form: HTMLFormElement;
  the_fieldset: HTMLFormElement
  the_form_refusal: HTMLFormElement;
  checkbox_refusal: HTMLInputElement;
  hint_refusal: HTMLSelectElement;
  button_reset: HTMLButtonElement;
  field_status: HTMLSpanElement;
  button_submit: HTMLButtonElement;
  field_result: HTMLOutputElement;
  one_submit: boolean;
  form_ok: boolean;
  form_check_message: string;

  constructor(a_island_id: string){
    // the island name
    this.island_id = a_island_id;
    // Html element
    this.island = document.querySelector(this.island_id);
    this.the_form = this.island.querySelector('form');
    this.the_fieldset = this.island.querySelector('form fieldset');
    this.the_form_refusal = this.island.querySelector('.final_refusal');
    this.checkbox_refusal = this.island.querySelector('.final_refusal input');
    this.hint_refusal = this.island.querySelector('.final_refusal select');
    this.button_reset = this.island.querySelector('.action_button_reset');
    this.field_status = this.island.querySelector('.action_status');
    this.button_submit = this.island.querySelector('.action_button_submit');
    this.field_result = this.island.querySelector('output');
    // At the beginning no vote
    this.one_submit = false;
    this.form_ok = false;
    // Listeners
    window.addEventListener('load', (evt:Event) => {
      console.log('Page load event of island ' + this.island_id);
      this.apply_disable();
    });
    this.the_form.addEventListener('change', (evt:Event) => {
      console.log('in island ' + this.island_id + ', the form has been changed');
      this.apply_disables_on_form();
      this.apply_status_input_change();
    });
    this.the_form_refusal.addEventListener('change', (evt:Event) => {
      console.log('in island ' + this.island_id + ', the form_refusal has been changed');
      this.apply_status_input_change();
      this.apply_disable();
    });
    this.button_reset.addEventListener('click', (evt:Event) => {
      console.log('Click on button_reset in  island ' + this.island_id);
      if (this.one_submit) {
        this.field_status.innerHTML = "Back to the submitted value";
        this.field_status.style.background = 'yellowgreen';
        this.checkbox_refusal.checked = this.island_refusal;
        this.hint_refusal.value = this.island_refusal_hint;
        if (this.form_ok) {
          this.write_the_form();
        }
      }
      this.apply_disable();
    });
    this.button_submit.addEventListener('click', (evt:Event) => {
      console.log('Click on button_submit in island ' + this.island_id);
      this.island_refusal = this.checkbox_refusal.checked;
      this.island_refusal_hint = this.hint_refusal.value;
      this.form_ok = this.check_the_form();
      if ( this.island_refusal || this.form_ok ) {
        this.field_status.innerHTML = "A voté!";
        this.field_status.style.background = 'yellowgreen';
        if (this.form_ok) {
          this.accept_the_form();
        }
        this.one_submit = true;
        this.field_result.innerHTML = this.get_result();
      } else {
        this.field_status.innerHTML = 'No submission: ' + this.form_check_message;
        this.field_status.style.background = '#ff9933';
      }
    });
  }

  get_result(): string {
    let r_result: string;
    r_result = "Any opinion hasn't been expressed yet!";
    if (this.one_submit) {
      if (this.island_refusal) {
        r_result = "No opinion because of " + this.island_refusal_hint;
      } else {
        r_result = this.output_message();
      }
    }
    return r_result;
  }

  apply_disable(){
    if(this.checkbox_refusal.checked){
      this.the_fieldset.disabled = true;
      this.hint_refusal.disabled = false;
    } else {
      this.the_fieldset.disabled = false;
      this.hint_refusal.disabled = true;
    }
  }

  apply_status_input_change(){
    if (this.one_submit) {
      this.field_status.innerHTML = "input and output are out of sync!";
      this.field_status.style.background = '#ff9933';
    }
  }

  abstract apply_disables_on_form(): void;
  abstract check_the_form(): boolean;
  abstract accept_the_form(): void;
  abstract write_the_form(): void;
  abstract output_message(): string;
}

// =========================
// A proposal
// =========================

class Aproposal extends AbstractVoteIsland {
  choice: string; pre_choice: string;

  apply_disables_on_form() {
  }
  
  check_the_form(): boolean {
    this.pre_choice = (<HTMLInputElement>this.island.querySelector('input[name=radio_prop1]:checked')).value;
    this.form_check_message = 'rien a declarer';
    return true;
  }

  accept_the_form(){
    this.choice = this.pre_choice;
  }

  write_the_form(){
    (<HTMLInputElement>this.island.querySelector('input[name=radio_prop1][value=' + this.choice + ']')).checked = true;
  }

  output_message(): string {
    return 'The opinion is ' + this.choice;
  }
}

const a_proposal = new Aproposal('#a-proposal');


