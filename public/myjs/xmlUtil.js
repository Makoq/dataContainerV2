
function createXmlDocument() {
    var doc = null;
    if (document.implementation && document.implementation.createDocument) {
        doc = document.implementation.createDocument('', '', null);
    } else if (window.ActiveXObject) {
        doc = new ActiveXObject('Microsoft.XMLDOM');
    }
    return doc;
}

function parseXml(xml) {
    if (window.DOMParser) {
        var parser = new DOMParser();
        return parser.parseFromString(xml, 'text/xml');
    } else { // IE<=9
        var result = createXmlDocument();
        result.async = false;
        // Workaround for parsing errors with SVG DTD
        result.validateOnParse = false;
        result.resolveExternals = false;
        result.loadXML(xml);
        return result;
    }
}
