# Contribuer

Pour contribuer au projet, il faut nécessairement passer par une [demande de fusion](https://docs.gitlab.com/ee/user/project/merge_requests/).

Les commits directs sur les branches **master** et **develop** sont interdits et bloqués.

## Messages de commits

Les messages de commits suivent la recommandation de [commitzen](http://commitizen.github.io/cz-cli/). Par exemple les mots-clés sont :

- build: changements qui concernent le système de **build** (dépendances, npm, ...)
- ci: changements liés à l'intégration continue (cypress, jenkins,...)
- docs: documentation
- feat: une nouvelle fonctionnalité
- fix: une correction de bug
- perf: changements pour des questions de performances
- refactor: refactorisation sans ajout de fonctionnalité ni correction de bugs
- test: ajouts de tests ou corrections de tests existants

## Mode manuel

En cas de doute sur votre message de commit, lancer la commande suivante pour avoir une interface graphique d'aide.

```sh
npx cz
```

Si votre commit échoue après la commande précédente, par exemple à cause d'une erreur d'un prehook git, vous pouvez retenter via la commande suivante :

```sh
npx cz --retry
```
