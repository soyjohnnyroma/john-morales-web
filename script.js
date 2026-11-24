const menuButton=document.querySelector(".menu-toggle");
const navigation=document.querySelector(".main-nav");
if(menuButton&&navigation){
  menuButton.addEventListener("click",()=>{
    const open=navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded",String(open));
    menuButton.setAttribute("aria-label",open?"Cerrar menú":"Abrir menú");
  });
  navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label","Abrir menú");
  }));
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"){
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded","false");
      menuButton.setAttribute("aria-label","Abrir menú");
    }
  });
}
const year=document.querySelector("#year");
if(year)year.textContent=new Date().getFullYear();

let installPrompt=null;
const installButton=document.querySelector("#install-app");
window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  installPrompt=event;
  if(installButton)installButton.textContent="instalar aplicación ↓";
});
if(installButton){
  installButton.addEventListener("click",async()=>{
    if(installPrompt){
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt=null;
      installButton.textContent="instalar app ↓";
      return;
    }
    alert("Para instalarla, abre el menú del navegador y elige «Instalar aplicación» o «Añadir a pantalla de inicio». En iPhone o iPad, usa Compartir y luego «Añadir a pantalla de inicio».");
  });
}
window.addEventListener("appinstalled",()=>{
  if(installButton)installButton.textContent="aplicación instalada";
});
if("serviceWorker"in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("./sw.js").catch(error=>console.error("No se pudo registrar el service worker:",error));
  });
}
