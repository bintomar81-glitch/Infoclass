const formulaire = document.querySelector("form");

formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault();

    alert("Formulaire valide ! Ceci est une démonstration.");
});