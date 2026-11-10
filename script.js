"use strict";
const config = window.INFOCLASS_CONFIG || {};
const form = document.querySelector('form');
const box = document.querySelector('#statut');
const page = document.body.dataset.page;
const courses = {'html-css':'HTML and CSS',javascript:'JavaScript',bureautique:'Office Skills'};
function status(message, error=false) { box.textContent=message; box.className=error?'statut erreur':'statut'; }
async function request(path,{token,body,method='POST'}={}) {
  if (!/^https:\/\/[^/]+\.supabase\.co$/.test(config.supabaseUrl||'') || !config.supabaseKey) throw new Error('The service is not connected yet. Add your Supabase settings to config.js.');
  const headers={apikey:config.supabaseKey,'Content-Type':'application/json'};
  if(token) headers.Authorization=`Bearer ${token}`;
  let response;
  try { response=await fetch(config.supabaseUrl+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)}); }
  catch { throw new Error('Unable to connect. Check your internet connection and try again.'); }
  const data=await response.json().catch(()=>({}));
  if(!response.ok) {
    const code=data.error_code||data.code;
    if(code==='invalid_credentials') throw new Error('Incorrect email address or password.');
    if(code==='email_not_confirmed') throw new Error('Confirm your email address using the link in your inbox before signing in.');
    if(response.status===429) throw new Error('Too many attempts. Please wait a few minutes.');
    if(response.status===401) throw new Error('Your session has expired. Please sign in again.');
    throw new Error('The operation failed. Check the form fields and service configuration, then try again.');
  }
  return data;
}
function saveSession(data) { if(!data.access_token) return false; sessionStorage.setItem('infoclass-token',data.access_token); return true; }
if(form) form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const fields=Object.fromEntries(new FormData(form));
  const button=form.querySelector('button[type=submit]');
  button.disabled=true; status('Please wait…');
  try {
    if(page==='inscription') {
      if(!fields.nom.trim()) throw new Error('Enter your full name.');
      const data=await request('/auth/v1/signup',{body:{email:fields.email.trim(),password:fields.motDePasse,data:{nom:fields.nom.trim(),cours:fields.cours}}});
      form.reset();
      if(saveSession(data)) location.assign('espace.html');
      else status('Check your inbox to confirm your registration, then sign in. If you already have an account with this email address, use the Sign in page.');
    } else if(page==='connexion') {
      const data=await request('/auth/v1/token?grant_type=password',{body:{email:fields.email.trim(),password:fields.motDePasse}});
      if(!saveSession(data)) throw new Error('Sign-in was unsuccessful. Please try again.');
      form.reset(); location.assign('espace.html');
    } else if(page==='contact') {
      const message={nom:fields.nom.trim(),email:fields.email.trim(),sujet:fields.sujet.trim(),message:fields.message.trim()};
      if(Object.values(message).some(v=>!v)) throw new Error('Complete every field. Fields cannot contain only spaces.');
      await request('/rest/v1/messages_contact',{body:message});
      form.reset(); status('Your message has been saved. Thank you for contacting us!');
    }
  } catch(error) { status(error.message,true); }
  finally { button.disabled=false; }
});
if(page==='espace') {
  document.querySelector('#deconnexion').addEventListener('click',async()=>{
    const token=sessionStorage.getItem('infoclass-token'); sessionStorage.removeItem('infoclass-token');
    document.querySelector('#profil').hidden=true;
    try {if(token) await request('/auth/v1/logout',{token});} catch {}
    location.replace('connexion.html');
  });
  (async()=>{
    const token=sessionStorage.getItem('infoclass-token');
    if(!token) return location.replace('connexion.html');
    try {
      const user=await request('/auth/v1/user',{token,method:'GET'});
      document.querySelector('#nom-eleve').textContent=user.user_metadata?.nom||'Student';
      document.querySelector('#email-eleve').textContent=user.email;
      document.querySelector('#cours-eleve').textContent=courses[user.user_metadata?.cours]||'No course selected';
      document.querySelector('#profil').hidden=false; status('You are signed in to your InfoClass account.');
    } catch(error) {status(error.message,true); document.querySelector('#reconnexion').hidden=false;}
  })();
}
