// Crée les contraintes pour le flux de vidéo
var contraintes = { video: { facingMode: "environment" }, audio: false };

// Définition des constantes
const vueCamera = document.querySelector("#vue-camera"),
    sortieCamera = document.querySelector("#sortie-camera"),
    capteurCamera = document.querySelector("#capteur-camera"),
    declencheurCamera = document.querySelector("#declencheur-camera")

// Accede a la camera et diffuse a vueCamera
function ouvertureCamera() {
    navigator.mediaDevices
        .getUserMedia(contraintes)
        .then(function(flux) {
        track = flux.getTracks()[0];
        vueCamera.srcObject = flux;
    })
    .catch(function(error) {
        console.error("Une erreur est survenue lors de l'ouverture de la camera.", error);
    });
}

// Prend une photo quand declencheurCamera est cliqué
declencheurCamera.onclick = function() {
    capteurCamera.width = vueCamera.videoWidth;
    capteurCamera.height = vueCamera.videoHeight;
    capteurCamera.getContext("2d").drawImage(vueCamera, 0, 0);
    sortieCamera.src = capteurCamera.toDataURL("image/webp");
    sortieCamera.classList.add("photo-prise");
    $(sortieCamera).toggle();
    document.getElementById("main").style.display = "flex";
};

// Start the video stream when the window loads
window.addEventListener("load", ouvertureCamera, true);

function recommencerPhoto() {
	document.getElementById("main").style.display = "none";
	sortieCamera.style.display = "none";
}
