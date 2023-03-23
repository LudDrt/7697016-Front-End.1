// Récupération des pièces depuis le fichier JSON
const reponse = await fetch('pieces-autos.json');
const pieces = await reponse.json();

for (let i = 0; i < pieces.length; i++)
{
    // Création et affichage des fiches articles
    const sectionFiches = document.querySelector(".fiches");
    const pieceElement = document.createElement("article");

    const imageElement = document.createElement("img");
    imageElement.src = pieces[i].image;
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

    sectionFiches.appendChild(pieceElement);
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(disponibiliteElement);
}

// Tri des articles par ordre croissant de prix
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function() {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function(a, b) {
        return a.prix - b.prix;
    });
    console.log(piecesOrdonnees);
});
// Tri des articles par ordre décroissant de prix
const boutonTrierDesc = document.querySelector(".btn-trier-desc");
boutonTrierDesc.addEventListener("click", function() {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function(a, b) {
        return b.prix - a.prix;
    });
    console.log(piecesOrdonnees);
});

// Filtre des articles trop chers
const boutonFiltrer = document.querySelector(".btn-filtrer-prix");
boutonFiltrer.addEventListener("click", function() {
    const piecesFiltrees = pieces.filter(function(piece) {
        return piece.prix <= 35;
    });
    console.log(piecesFiltrees);
});
// Filtre des articles sans description
const boutonFiltrerDescription = document.querySelector(".btn-filtrer-description");
boutonFiltrerDescription.addEventListener("click", function() {
    const piecesFiltrees = pieces.filter(function(piece) {
        return piece.description ?? false;
    });
    console.log(piecesFiltrees);
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
