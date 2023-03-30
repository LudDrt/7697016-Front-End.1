import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherGraphiqueAvis } from "./avis.js";

window.localStorage.setItem("nom", "Les Bonnes Pièces !");

// Récupération des pièces éventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem("pieces");
if (pieces === null) {
    // Récupération des pièces depuis l'API HTTP
    pieces = await fetch('http://localhost:8081/pieces').then(pieces => pieces.json());
    // Transformation des pièces en chaine de caractère
    const valeurPieces = JSON.stringify(pieces);
    // Stockage des pièces dans le stockage local
    window.localStorage.setItem("pieces", valeurPieces);
}
else {
    pieces = JSON.parse(pieces);
}

ajoutListenerEnvoyerAvis();

// Fonction de création et affichage des articles
function genererPieces(pieces)
{
    const sectionFiches = document.querySelector(".fiches");
 
    for (let i = 0; i < pieces.length; i++)
    {
        const pieceElement = document.createElement("article");

        const imageElement = document.createElement("img");
        imageElement.src = pieces[i].image;
        imageElement.title = pieces[i].id;
        const nomElement = document.createElement("h2");
        nomElement.innerText = pieces[i].nom;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix : ${pieces[i].prix} € (${pieces[i].prix < 35 ? "€" : "€€€"})`;
        const categorieElement = document.createElement("p");
        categorieElement.innerText = pieces[i].categorie ?? "(aucune catégorie)";
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = pieces[i].description ?? "Pas de description pour le moment";
        const disponibiliteElement = document.createElement("p");
        disponibiliteElement.innerText = pieces[i].disponibilite ? "En stock" : "Rupture de stock";
        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = pieces[i].id;
        avisBouton.textContent = "Afficher les avis";

        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(disponibiliteElement);
        pieceElement.appendChild(avisBouton);

        sectionFiches.appendChild(pieceElement);
    }
    ajoutListenersAvis();
}

// Premier affichage de la page
genererPieces(pieces);

// Tri des articles par ordre croissant de prix
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function() {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function(a, b) {
        return a.prix - b.prix;
    });
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
    //console.log(piecesOrdonnees);
});
// Tri des articles par ordre décroissant de prix
const boutonTrierDesc = document.querySelector(".btn-trier-desc");
boutonTrierDesc.addEventListener("click", function() {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function(a, b) {
        return b.prix - a.prix;
    });
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
    //console.log(piecesOrdonnees);
});

// Filtre des articles par prix
const filtrerPrix = document.getElementById("filtrer-prix");
filtrerPrix.addEventListener("input", function() {
    const piecesFiltrees = pieces.filter(function(piece) {
        return piece.prix <= filtrerPrix.value;
    });
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
    //console.log(piecesFiltrees);
});
// Filtre des articles sans description
const boutonFiltrerDescription = document.querySelector(".btn-filtrer-description");
boutonFiltrerDescription.addEventListener("click", function() {
    const piecesFiltrees = pieces.filter(function(piece) {
        return piece.description ?? false;
    });
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
    //console.log(piecesFiltrees);
});

// Récupération des noms des pièces
const noms = pieces.map(piece => piece.nom);
// Suppression des pièces non abordables
for (let i = pieces.length -1 ; i >= 0; i--)
{
    if (pieces[i].prix > 35)
    {
        noms.splice(i,1);
    }
}

// Création de la liste
const abordablesElements = document.createElement('ul');
// Ajout de chaque nom à la liste
for (let i = 0; i < noms.length ; i++)
{
    const nomElement = document.createElement('li');
    nomElement.innerText = noms[i];
    abordablesElements.appendChild(nomElement);
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.abordables').appendChild(abordablesElements);

// Récupération des pièces disponibles
const pieceDispo = pieces.map(piece => `${piece.nom} - ${piece.prix} €`);
console.log(pieceDispo);
for (let i = pieces.length - 1; i >=0; i--)
{
    if (!pieces[i].disponibilite)
    {
        pieceDispo.splice(i, 1);
    }
}
console.log(pieceDispo);

// Création de la liste
const disponiblesElements = document.createElement('ul');
// Ajout de chaque nom à la liste
for (let i = 0; i < pieceDispo.length ; i++)
{
    const nomElement = document.createElement('li');
    nomElement.innerText = pieceDispo[i];
    disponiblesElements.appendChild(nomElement);
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.disponibles').appendChild(disponiblesElements);

// Bouton rafraichir les données
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function() {
    window.localStorage.removeItem("pieces");
});

afficherGraphiqueAvis();
