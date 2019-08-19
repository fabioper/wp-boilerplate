const fs = require('fs');
const path = require('path');

const pagesFiles = fs.readdirSync(
    path.resolve(__dirname, 'src', 'templates', 'pages'),
    'utf-8'
);

const templatePages = pagesFiles.map(template => {
    return { template };
});

module.exports = templatePages;
