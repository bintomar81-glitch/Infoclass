"use strict";
const config = window.INFOCLASS_CONFIG || {};
const form = document.querySelector('form');
const box = document.querySelector('#statut');
const page = document.body.dataset.page;
const courses = {'html-css':'HTML et CSS',javascript:'JavaScript',bureautique:'Bureautique'};
function status(message, error=false) { box.textContent=message; box.className=error?'statut erreur':'statut'; }
async function request(path,{token,body,method='POST'}={}) {
  if (!/^https:\/\/[^/]+\.supabase\.co$/.test(config.supabaseUrl||'') || !config.supabaseKey) throw new Error('Service non connecté : complète config.js avec les paramètres Supabase.');
  const headers={apikey:config.supabaseKey,'Content-Type':'application/json'};
  if(token) headers.Authorization=`Bearer ${token}`;
  let response;
  try { response=await fetch(config.supabaseUrl+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)}); }
  catch { throw new Error('Connexion impossible. Vérifie Internet et réessaie.'); }
  const data=await response.json().catch(()=>({}));
  if(!response.ok) {
    const code=data.error_code||data.code;
    if(code==='invalid_credentials') throw new Error('Adresse e-mail ou mot de passe incorrect.');
    if(code==='email_not_confirmed') throw new Error('Confirme ton adresse e-mail avec le lien reçu avant de te connecter.');
    if(response.status===429) throw new Error('Trop de tentatives. Patiente quelques minutes.');
    if(response.status===401) throw new Error('Session expirée. Reconnecte-toi.');
    throw new Error('Échec de l’opération. Vérifie les champs et la configuration du service, puis réessaie.');
  }
  return data;
}
function saveSession(data) { if(!data.access_token) return false; sessionStorage.setItem('infoclass-token',data.access_token); return true; }
if(form) form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const fields=Object.fromEntries(new FormData(form));
  const button=form.querySelector('button[type=submit]');
  button.disabled=true; status('En cours…');
  try {
    if(page==='inscription') {
      if(!fields.nom.trim()) throw new Error('Indique ton nom complet.');
      const data=await request('/auth/v1/signup',{body:{email:fields.email.trim(),password:fields.motDePasse,data:{nom:fields.nom.trim(),cours:fields.cours}}});
      form.reset();
      if(saveSession(data)) location.assign('espace.html');
      else status('Consulte ta boîte e-mail pour confirmer ton inscription, puis connecte-toi. Si cette adresse possède déjà un compte, utilise la page Connexion.');
    } else if(page==='connexion') {
      const data=await request('/auth/v1/token?grant_type=password',{body:{email:fields.email.trim(),password:fields.motDePasse}});
      if(!saveSession(data)) throw new Error('La connexion n’a pas abouti. Réessaie.');
      form.reset(); location.assign('espace.html');
    } else if(page==='contact') {
      const message={nom:fields.nom.trim(),email:fields.email.trim(),sujet:fields.sujet.trim(),message:fields.message.trim()};
      if(Object.values(message).some(v=>!v)) throw new Error('Remplis tous les champs sans utiliser uniquement des espaces.');
      await request('/rest/v1/messages_contact',{body:message});
      form.reset(); status('Ton message a bien été enregistré. Merci de nous avoir contactés !');
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
      document.querySelector('#nom-eleve').textContent=user.user_metadata?.nom||'Élève';
      document.querySelector('#email-eleve').textContent=user.email;
      document.querySelector('#cours-eleve').textContent=courses[user.user_metadata?.cours]||'Aucun cours sélectionné';
      document.querySelector('#profil').hidden=false; status('Tu es connecté à ton compte InfoClass.');
    } catch(error) {status(error.message,true); document.querySelector('#reconnexion').hidden=false;}
  })();
}
