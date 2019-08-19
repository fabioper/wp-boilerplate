# Static Website Boilerplate

## Tecnologias usadas:

-   [Handlebars](https://handlebarsjs.com/)
-   [SASS/SCSS](https://sass-lang.com/) (in progress)
-   [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) (ES15+)
-   [Webpack](https://github.com/webpack/webpack)
-   [Yarn](https://yarnpkg.com/en/)
-   [ESlint](https://eslint.org/) (in progress)
-   [Stylelint](https://stylelint.io/) (in progress)

## Estrutura de pastas

```bash
├── src/
├──── assets/
|    ├── fonts/         # Aqui ficarão qualquer eventuais fonts utilizadas
|    └── images/        # Aqui ficarão as imagens utilizadas durante o desenvolvimento
├──── scripts/
|    └── app.js         # Este arquivo é obrigatório, pois será procurado pelo webpack
├──── styles/
|    └── main.scss
├──── templates/
├────── pages/          # Páginas que serão convertidas em HTML deverão ser adicionadas nesta pasta
|      └── index.hbs
└────── partials/       # Trechos de HTML/Handlebars que poderão ser reutilizados
```

## NPM Scripts

### `yarn start`

Executa um servidor local servindo a pasta `/dist`, rodando _in-memory_, pelo [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server).

### `yarn build`

Executa o [`webpack`](https://github.com/webpack/webpack) gerando uma pasta `/dist` na raíz do projeto, contendo todos os arquivos compilados e tratados pelo webpack. É a pasta que deve ser enviada ao servidor para ser servida em produção (e não a `/src`, que é somente para desenvolvimento).

### `yarn clean`

Exclui a pasta `/dist`. Este comando é executado toda vez que é executado o comando `yarn start`, para excluir qualquer resquício de builds anteriores.

> Caso não fosse utilizado, geraria erro no [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server) ao servir os arquivos localmente, pois teríamos uma pasta física `/dist` e uma pasta _in-memory_.

## Features

### Otimização de imagens

Todas as imagens utilizadas referenciadas tanto nos arquivos `.hbs` quanto no `.scss` serão otimizadas.

#### Conversão em `base 64`

As imagens que forem menor que **30 KB** serão convertidas para `base64` e adicionadas inline ao HTML.

Exemplo:

```hbs
<!-- index.hbs -->
<img src="./src/assets/images/imagem-com-menos-de-30-kb.jpg" alt="Imagem menor que 30 kb">
```

Será transformado em:

> In progress

#### SVG inline

Ao fazer referência a uma imagens/ícone `.svg` utilizando tag `img`, utilizando o atributo `markup-inline`, a imagem será convertida para inline no HTML.

Exemplo:

```hbs
<!-- index.hbs -->
<img markup-inline src="./src/assets/images/imagem.svg" alt="Imagem qualquer SVG">
```

Será transformado em:

> In progress

### Suporte a [`SASS/SCSS`](https://sass-lang.com/)

O arquivo principal pra utilização do `.scss` é o `main.scss`. A partir desse arquivo, pode ser chamado qualquer outro arquivo `.scss`, utilizando `@import`. O processamento do código `.scss` contém:

-   `autoprefixer`
-   Minificação
-   Injeção automática no HTML

### Suporte ao ES15+
