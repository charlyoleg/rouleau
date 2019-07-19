/*! rouleau_app.ts */

import * as rlSub from './rouleau_sub.js';

// =========================
// dummy stuff to be deleted at the end of development
// =========================

console.log("Hello from rouleau_app.ts");
rlSub.abc();

// =========================
// Messages and colors
// =========================

interface Messages {
  pwaStatus_installed : string;
  pwaStatus_afterInstallation : string;
  pwaStatus_afterUninstallation : string;
  layoutExplanationStatus_clickBack : string;
  layoutExplanationStatus_clickNext : string;
  voteStatus_reset : string;
  voteStatus_submit : string;
  voteStatus_invalidSubmit : string;
  voteStatus_outOfSync : string;
}

let messagesEn : Messages = {
  pwaStatus_installed : "Rouleau is installed on your device",
  pwaStatus_afterInstallation : "Rouleau has been installed",
  pwaStatus_afterUninstallation : "Rouleau has been uninstalled",
  layoutExplanationStatus_clickBack : "T'as cliqué sur Back",
  layoutExplanationStatus_clickNext : "T'as cliqué sur Next",
  voteStatus_reset : "Back to the submitted value",
  voteStatus_submit : "Vote cast!",
  voteStatus_invalidSubmit : "No submission: ",
  voteStatus_outOfSync : "input and output are out of sync!"
};

// select your language
let messages : Messages = messagesEn;

interface Colors {
  pwaStatus_afterInstallation : string;
  layoutExplanationStatus_clickBack : string;
  layoutExplanationStatus_clickNext : string;
  voteStatus_ok : string;
  voteStatus_nok : string;
}

let colors : Colors = {
  pwaStatus_afterInstallation : 'green',
  layoutExplanationStatus_clickBack : 'lightblue',
  layoutExplanationStatus_clickNext : 'yellowgreen',
  voteStatus_ok : 'yellowgreen',
  voteStatus_nok : '#ff9933'
};


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
  pwa_install_status.innerHTML = messages.pwaStatus_installed;
  pwa_install_status.style.background = colors.pwaStatus_afterInstallation;
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
  pwa_install_status.innerHTML = messages.pwaStatus_afterInstallation;
});

// Button to uninstall the app
btn_pwauninstall.addEventListener('click', (evt:Event) => {
  console.log('Click on btn_pwauninstall');
  console.log('Nothing done! Uninstall is not implemented!');
  pwa_install_status.innerHTML = messages.pwaStatus_afterUninstallation;
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
  //layout_expl_status.innerHTML = messages.layoutExplanationStatus_clickBack;
  //layout_expl_status.style.background = colors.layoutExplanationStatus_clickBack;
  window.location.href = '#layout-explanations';
});

// Button layout_expl_next
layout_expl_next.addEventListener('click', (evt:Event) => {
  console.log('Click on layout_expl_next');
  //layout_expl_status.innerHTML = messages.layoutExplanationStatus_clickNext;
  //layout_expl_status.style.background = colors.layoutExplanationStatus_clickNext;
  window.location.href = '#a-proposal';
});


// =========================
// The Generic Vote island
// =========================

abstract class AbstractVoteIsland {
  private island_id: string;
  private island_refusal: boolean;
  private island_refusal_hint: string;
  protected island: HTMLDivElement;
  private the_form: HTMLFormElement;
  private the_fieldset: HTMLFormElement
  private the_form_refusal: HTMLFormElement;
  private checkbox_refusal: HTMLInputElement;
  private hint_refusal: HTMLSelectElement;
  private button_reset: HTMLButtonElement;
  private field_status: HTMLSpanElement;
  private button_submit: HTMLButtonElement;
  private field_result: HTMLOutputElement;
  private one_submit: boolean;
  private form_ok: boolean;
  protected form_check_message: string;

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
        this.field_status.innerHTML = messages.voteStatus_reset;
        this.field_status.style.background = colors.voteStatus_ok;
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
        this.field_status.innerHTML = messages.voteStatus_submit;
        this.field_status.style.background = colors.voteStatus_ok;
        if (this.form_ok) {
          this.accept_the_form();
        }
        this.one_submit = true;
        this.field_result.innerHTML = this.get_result();
      } else {
        this.field_status.innerHTML = messages.voteStatus_invalidSubmit + this.form_check_message;
        this.field_status.style.background = colors.voteStatus_nok;
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
      this.field_status.innerHTML = messages.voteStatus_outOfSync;
      this.field_status.style.background = colors.voteStatus_nok;
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


// =========================
// First survey
// =========================

class FirstSurvey extends AbstractVoteIsland {
  shape: string; pre_shape: string;
  configuration: string; pre_configuration: string;
  equipment: string; pre_equipment: string;

  apply_disables_on_form() {
  }

  check_the_form(): boolean {
    this.pre_shape = (<HTMLSelectElement>this.island.querySelector('select[name=survey1_dropdown1]')).value;
    this.pre_configuration = (<HTMLSelectElement>this.island.querySelector('select[name=survey1_dropdown2]')).value;
    this.pre_equipment = (<HTMLSelectElement>this.island.querySelector('select[name=survey1_dropdown3]')).value;
    this.form_check_message = 'rien a declarer';
    return true;
  }

  accept_the_form(){
    this.shape = this.pre_shape;
    this.configuration = this.pre_configuration;
    this.equipment = this.pre_equipment;
  }

  write_the_form(){
    (<HTMLSelectElement>this.island.querySelector('select[name=survey1_dropdown1]')).value = this.shape;
    (<HTMLSelectElement>this.island.querySelector('select[name=survey1_dropdown2]')).value = this.configuration;
    (<HTMLSelectElement>this.island.querySelector('select[name=survey1_dropdown3]')).value = this.equipment;
  }

  output_message(): string {
    let r_str: string;
    r_str = 'The opinion is:<br>';
    r_str += '- shape: ' + this.shape + '<br>';
    r_str += '- configuration: ' + this.configuration + '<br>';
    r_str += '- equipment: ' + this.equipment;
    return r_str;
  }
}

const first_survey = new FirstSurvey('#survey-1');


