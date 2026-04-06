// Mock for react-native-webview in Jest tests
const WebView = () => null;
WebView.displayName = 'WebView';
module.exports = { WebView };
module.exports.default = WebView;
