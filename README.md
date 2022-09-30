# Webstory

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Ce projet a été généré avec [Nx](https://nx.dev) version 13.5.1.

# Infos utiles

## Jira

- Les nouvelles fonctionnalités, les sprints et les bugs sont gérés dans [JIRA](http://jira.afp.com/projects/WST/summary)

## Intégration continue

- La branche develop est automatiquement déployée sur le serveur de développement par [Jenkins](http://vspar-dev-scm.afp.com:8083/view/Webstory/job/webstory-front-build/)

- Environnements :
  - serveur de développement : http://vspar-iris-d-wsback-31.afp.com
  - serveur de validation : http://vspar-iris-v-wsback-31.afp.com

## Generation

### Generate a component

Nous utilisons le mode [SCAM](https://marmicode.io/blog/your-angular-module-is-a-scam) pour créer de nouveau component dans le projet, le but est de faciliter la gestion des dépendances.

Run `nx generate @nrwl/angular:scam --name=my-component --project=webstory`

### Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

Libraries are shareable across libraries and applications. They can be imported from `@webstory/mylib`.

### Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

# Développement

## Installation des dépendances

Allez dans le répertoire du projet et tapez la commande suivante :

```sh
 npm ci
```

## Serveur de développement.

L'application tourne en [local](http://localhost:4200), sur le port **4200** (en anglais qui est la langue par défaut).

```sh
$ npm run start
```

## Traduction de l'application

Nous utilisons [@angular/localize](https://angular.io/guide/i18n) comme bibliothèque de traduction. L'application, est par défaut, écrite en anglais dans le code. Pour utiliser des traductions directement dans les fichiers .ts des services et composants, angular propose la fonction $localize.

```ts
$localize`:@@<key>:<translation>`
```

Il y a deux choses à faire pour traduire l'application :

Lancer `npm run i18n` pour extraire les chaînes de caractère à traduire dans le fichier de traduction.
Puis, traduire les nouvelles chaînes en français en utilisant l'extension vscode [xliff sync](https://github.com/rvanbekkum/vsc-xliff-sync), par exemple.

## Build

Run `ng build webstory` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm run test` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx run-many:affected --target=test --all` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e webstory` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.
