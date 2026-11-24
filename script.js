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


// Galería ampliable: las tres fotografías se abren en un visor con navegación.
const viewer=document.querySelector("#image-viewer");
const viewerImage=document.querySelector("#viewer-image");
const viewerCounter=document.querySelector("#viewer-counter");
const galleryImages=[
  {src:"assets/john-morales-retrato.jpg",alt:"John Morales en su taller de carpintería"},
  {src:"assets/john-morales-medicion.jpg",alt:"John Morales midiendo una pieza de madera en su taller"},
  {src:"assets/john-morales-cocina.jpg",alt:"John Morales ajustando e instalando un mueble de cocina"}
];
let currentImage=0;
function showGalleryImage(index){
  currentImage=(index+galleryImages.length)%galleryImages.length;
  viewerImage.src=galleryImages[currentImage].src;
  viewerImage.alt=galleryImages[currentImage].alt;
  viewerCounter.textContent=`0${currentImage+1} / 0${galleryImages.length}`;
}
document.querySelectorAll(".image-open").forEach(button=>{
  button.addEventListener("click",()=>{
    showGalleryImage(Number(button.dataset.imageIndex));
    if(typeof viewer.showModal==="function")viewer.showModal();
  });
});
document.querySelector(".viewer-close")?.addEventListener("click",()=>viewer.close());
document.querySelector(".viewer-prev")?.addEventListener("click",()=>showGalleryImage(currentImage-1));
document.querySelector(".viewer-next")?.addEventListener("click",()=>showGalleryImage(currentImage+1));
viewer?.addEventListener("click",event=>{
  if(event.target===viewer)viewer.close();
});
document.addEventListener("keydown",event=>{
  if(!viewer?.open)return;
  if(event.key==="ArrowLeft")showGalleryImage(currentImage-1);
  if(event.key==="ArrowRight")showGalleryImage(currentImage+1);
});
