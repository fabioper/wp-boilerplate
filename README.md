# Static Website Boilerplate

## Tecnologias usadas:

-   Handlebars
-   SASS/SCSS (in progress)
-   Javascript (ES15+)
-   Webpack
-   Yarn
-   ESlint (in progress)
-   Stylelint (in progress)

## Estrutura de pastas

```bash
├── src/
├──── assets/
|      ├── fonts/ # Aqui ficarão qualquer eventuais fonts utilizadas
|      └── images/ # Aqui ficarão as imagens utilizadas durante o desenvolvimento
├──── scripts/
|      └── app.js # Este arquivo é obrigatório, pois será procurado pelo webpack
├──── styles/
|     └── main.scss
├──── templates/
├────── pages/ # Páginas que deverão ser convertidas em HTML deverão ser adicionadas nesta pasta
|       └── index.hbs
└────── partials/ # Trechos de HTML/Handlebars que poderão ser reutilizados
```

## NPM Scripts

### `yarn start`

Executa um servidor local servindo a pasta `/dist`, gerada _in-memory_, pelo `webpack-dev-server`.

### `yarn build`

Executa o `webpack` gerando uma pasta `/dist` na raíz do projeto, contendo todos os arquivos compilados e tratados pelo webpack. É a pasta que deve ser enviada ao servidor para ser servida em produção (e não a `/src`, que é somente para desenvolvimento).

### `yarn clean`

Exclui a pasta `/dist`. Este comando é executado toda vez que é executado o comando `yarn start`, para excluir qualquer resquício de builds anteriores.

> Caso não fosse utilizado, geraria erro no `webpack-dev-server` ao servir os arquivos localmente, pois teríamos uma pasta física `/dist` e uma pasta _in-memory_.
