# Bankin challenge

Proposition de Clément Garbay ([LinkedIn](https://www.linkedin.com/in/clementgarbay/)).

Un navigateur de type _Chrome Headless_ ainsi que l'API [_puppeteer_](https://github.com/GoogleChrome/puppeteer) sont utilisés.

## Lancement

```
yarn install
yarn start
```

## Structure

### `/bankin`

Contient tous les outils métier nécessaires à récupérer les transactions du site.

* `scraper.js`: Permet grâce à la fonction `getTransactions` de récupérer les objets transactions à partir d'une URL d'une page et d'une instance de navigateur _puppeteer_.
* `scraper-runner.js`: Gère toute la logique de scraping entre les différentes pages. Le fichier contient une seule fonction `run` qui à partir d'une instance de navigateur _puppeteer_ démarre le scraping avec comme stratégie de paralléliser le scraping en lançeant plusieurs pages en même temps, en utilisant une queue évènementielle.

### `/puppeteer`

Contient un ensemble de fonctions permettant d'aider à manipuler et récupérer des informations sur une instance de page _puppeteer_.

### `/queue`

Contient les éléments nécessaires à la création d'une queue asynchrone, ainsi que quelques objets permettant de structurer les tâches de la queue.

## Stratégie

1. Le scraping est lancé sur la page commençant à 0 afin de récupérer le nombre d'éléments par page.
2. Un pool (selon le nombre de tâches concurrentes spécifié) de tâches de scraping est lancé dans la queue, et donc sur différents onglets du navigateur.
3. Dès qu'une tâche termine en succès, elle relance une nouvelle tâche de scraping avec comme paramètre de début de page `pageStart` la dernière valeur de `pageStart` utiliser + le nombre d'éléments que la page contenait. /!\ Si la page ne contenait pas d'élément (tableau vide) alors aucune tâche n'est ajoutée dans la queue.
4. Quand toutes les tâches de la queue sont terminées, le résultat est retourné.

### Stratégie unitaire

Lors du scraping d'une page, on trouve plusieurs cas de figures :

1. Le tableau HTML est dans la page racine (cas nominal).
2. Le tableau HTML est dans une iframe.
3. Une alerte JS est lancée et le tableau est chargé qu'après le clique sur le bouton "Reload Transactions".

## Résultat

Le résultat est enregistré dans le fichier `res.json` du dossier `res`. Il contient un tableau d'objets JSON représentant les transactions récupérées.

Structure d'une transaction :

```
{
  "account": "Checking",
  "transaction": "Transaction X",
  "amount": "54",
  "currency": "€"
}
```

Environ 5000 résultats sont récupérés en ~23 secondes.

## Partis pris

* Seules les pages ayant un paramètre d'URL allant de 0 à +∞ (i.e. positif) sont considérées.

* Les pages ayant un paramètre négatif ne sont pas scrapées pour deux raisons :
  * Ce paramètre est infini et les résultats sont incohérents (la page _https://web.bankin.com/challenge/index.html?start=-5000000000000000000000000000000000000_ donne par exemple des résultats mais avec des numéros de transactions sans sens).
  * Un système de pagination avec des indexes négatifs est un peu (beaucoup) étrange !
* Le lien "_Next -->_" n'est pas utilisé (inutile).

## Améliorations possibles

* Permettre d'annuler des tâches lancées inutilement. Par exemple, il s'agirait de lancer encore plus de tâches au départ, mais que la queue annule les tâches qu'elle aurait lancé en trop inutilement (`startPage` trop grand) suivant la valeur de `startPage` de la dernière page (première page qui ne contient plus aucun élément). J'ai commencé ce travail dans la branche `with-cancellation`, mais je n'ai pas eu le temps de finir.
* Utiliser un transpileur typé JS (type TypeScript) permettant d'avoir un code plus sûr et plus facilement compréhensible.
