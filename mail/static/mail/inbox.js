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

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
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
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  // document.addEventListener('DOMContentLoaded', function(){
  console.log(mailbox);
  fetch(`emails/${mailbox}`)
    .then((response) => response.json())
    .then(data => {
      // console.log(data);

      // Loops through all emails
      data.forEach(element => {
        console.log(element);
        console.log(element.sender);
      });
      // const sender_content = data['0'].sender;
      // const subject_content = data['subject'];
      // const time_email = data['timestamp'];
      // console.log(sender_content)
      // console.log(subject_content)
      // console.log(time_email)
    })
}