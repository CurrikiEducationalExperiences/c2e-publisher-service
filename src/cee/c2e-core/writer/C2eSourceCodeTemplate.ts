import C2eLd from "../classes/C2eLd";

export const c2eSourceHtmlTemplate = (c2eLd: C2eLd): string => {
    const title = c2eLd.getC2eMetadata()?.getC2eMdGeneralLd()?.getTitle();
    const description = c2eLd.getC2eMetadata()?.getC2eMdGeneralLd()?.getDescribtion();
    return`
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C2E - ${title}</title>
    <script src="index.js"></script>
</head>
<body>
    <h1>${title}</h1>
    <p>${description}</p>
</body>
</html>
`};

export const c2eSourceJsTemplate = (c2eLd: C2eLd): string => { 
    const c2eManifest = JSON.stringify(c2eLd.toJsonLd());
    return `
// C2E Reader core implementation which loads the contents and other parts of the C2E package
window.c2eManifest = ${c2eManifest};
console.log(window.c2eManifest);
`};