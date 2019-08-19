# Static Website Boilerplate

- [Static Website Boilerplate](#static-website-boilerplate)
  - [Tecnologias usadas:](#tecnologias-usadas)
  - [Estrutura de pastas](#estrutura-de-pastas)
  - [NPM Scripts](#npm-scripts)
    - [`yarn start`](#yarn-start)
    - [`yarn build`](#yarn-build)
    - [`yarn clean`](#yarn-clean)
  - [Features](#features)
    - [Otimização de imagens](#otimiza%c3%a7%c3%a3o-de-imagens)
      - [Conversão em `base 64`](#convers%c3%a3o-em-base-64)
      - [SVG inline](#svg-inline)
    - [Suporte a `SASS/SCSS`](#suporte-a-sassscss)
    - [Suporte ao ES15+](#suporte-ao-es15)
    - [Favicons](#favicons)

---

## Tecnologias usadas:

| Tecnologia                                                                              | Descrição                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Handlebars](https://handlebarsjs.com/)                                                 | Handlebars provides the power necessary to let you build semantic templates effectively with no frustration.                                                                                                                                       |
| [SASS/SCSS](https://sass-lang.com/)                                                     | Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.                                                                                                                                              |
| [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) (ES15+) | JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.                                                                                                                           |
| [Webpack](https://github.com/webpack/webpack)                                           | At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph which maps every module your project needs and generates one or more bundles. |
| [Yarn](https://yarnpkg.com/en/)                                                         | Fast, reliable, and secure dependency management.                                                                                                                                                                                                  |
| [ESlint](https://eslint.org/)                                                           | A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript. Maintain your code quality with ease.                                                                                                            |
| [Stylelint](https://stylelint.io/)                                                      | A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.                                                                                                                                                        |

## Estrutura de pastas

```bash
├── src/
├──── assets/
|    ├── fonts/         # Aqui ficarão qualquer eventuais fonts utilizadas
|    └── images/        # Aqui ficarão as imagens utilizadas durante o desenvolvimento
|       └── logo.svg
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

É possível utilizar todas as novas features do `ES15` e suas versões posteriores.

### Favicons

O [`webpack`](https://github.com/webpack/webpack) irá procurar por um arquivo `logo.svg` na pasta `src/assets/images/` e irá gerar automáticamente todos os favicons necessários para os navegadores e dispositivos móveis.
