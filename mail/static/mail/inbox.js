'use strict';
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


// The funciton takes the array of names of recipients, and then 
function recipients_of_email(array_of_recipients) {
  let string_recipients = "";
  for (let i=0; i < array_of_recipients.length; i++) {
      // console.log(array_of_recipients[i]);
      if (i === 0) {
        string_recipients += array_of_recipients[i];
      }
      else {
        string_recipients += ", " + array_of_recipients[i];
      }
    }
    return string_recipients;
}



// This functions fetches the email from the DB and displays it
function show_email() {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#individual-email').style.display = 'block';


  let email_id = this.getAttribute("data-email_id")

  fetch(`emails/${email_id}`)
    .then((response) => response.json())
    .then(data => {
      console.log(data);
      
      document.querySelector('#sender-email').value = data["id"];
      document.querySelector('#recipients').value = recipients_of_email(data["recipients"]);
      

    })
}


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#individual-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').addEventListener('submit', formsubmit) 

  function formsubmit(){
    
    let data_to_server = {
      Username: document.querySelector('#user-email').value,
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    }
    load_mailbox('sent');
    fetch('emails', {
      method : "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data_to_server)
      })
    .then((response) => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(`Error: ${error}`))

  }
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#individual-email').style.display = 'none';
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#emails-view").style.display = "block";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  // console.log(mailbox);
  fetch(`emails/${mailbox}`)
    .then((response) => response.json())
    .then(data => {

      // Loops through all emails
      data.forEach(element => {
        // console.log(element);
        const email_id = element.id
        const sender_content = element.sender;
        const subject_content = element.subject;
        const time_email = element.timestamp;
        const read = element.read;
        const archived = element.archived;
        
        
        if (archived === true) {
          return;
        }
      
        const main_menu = document.querySelector('#emails-view');
        
        // This is the main Div for the anchor
        let main_div = document.createElement('div');
        main_div.className = "form-group";
        main_menu.appendChild(main_div);

        let anchor_email = document.createElement('a');

        // Then it adds the content to each of the emails divs
        anchor_email.className = 'btn btn-outline-primary';
        anchor_email.id = `email-${email_id}`;
        anchor_email.innerHTML = `From: ${sender_content} Subject: ${subject_content} At ${time_email}`;
        anchor_email.href = '#';
        anchor_email.setAttribute("data-email_id", email_id);

        main_div.appendChild(anchor_email);

        // It's here because the querySelector searches through the DOM tree, so we have to append it firts
        document.querySelector(`#email-${email_id}`).addEventListener('click', show_email);
      });
    })
}