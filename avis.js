export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");

    for (let i = 0; i < piecesElements.length; i++) {
      piecesElements[i].addEventListener("click", async function (event) {
        const id = event.target.dataset.id;
        const pieceElement = event.target.parentElement;

        let avis = window.localStorage.getItem("avis-" + id);
        if (avis === null)
        {
          const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
          avis = await reponse.json();
          const valeurAvis = JSON.stringify(avis);
          window.localStorage.setItem("avis-" + id, valeurAvis);
        }
        else {
          avis = JSON.parse(avis);
        }
        const avisElement = document.createElement("p");
        for (let i = 0; i < avis.length; i++) {
           avisElement.innerHTML += `${avis[i].utilisateur} (${avis[i].nbEtoiles}): ${avis[i].commentaire} <br>`;
        }
        pieceElement.appendChild(avisElement);
      });
    }
}

export function ajoutListenerEnvoyerAvis() {
  const formulaireAvis = document.querySelector(".formulaire-avis");
  formulaireAvis.addEventListener("submit", function (event) {
    // Désactivation du comportement par défaut du navigateur
    event.preventDefault();
    // Création de l’objet du nouvel avis.
    const nouvelAvis = {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
      utilisateur: event.target.querySelector("[name=utilisateur]").value,
      commentaire: event.target.querySelector("[name=commentaire]").value,
      nbEtoiles: event.target.querySelector("[name=nbEtoiles]").value
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(nouvelAvis);
    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:8081/avis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile
    });
    window.localStorage.removeItem("avis-" + nouvelAvis.pieceId);
  });
}

export async function afficherGraphiqueAvis() {
  // Légende qui s'affichera sur la gauche à côté de la barre horizontale
  const labels = ["5", "4", "3", "2", "1"];
  // Données et personnalisation du graphique
  const data = {
    labels: labels,
    datasets: [{
      label: "Étoiles attribuées",
      data: nb_commentaires.reverse(),
      backgroundColor: "rgba(255, 230, 0, 1)" // couleur jaune
    }]
  };  
  // Objet de configuration final
  const config = {
    type: "bar",
    data: data,
    options: { indexAxis: "y" }
  };
  // Rendu du graphique dans l'élément canvas
  const graphiqueAvis = new Chart(document.querySelector("#graphique-avis"), config);
}

// Calcul du nombre total de commentaires par quantité d'étoiles attribuées
const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
const nb_commentaires = [0, 0, 0, 0, 0];
for (let commentaire of avis) {
  nb_commentaires[commentaire.nbEtoiles - 1]++;
}
