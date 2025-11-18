export default {
  expo: {
    name: 'FSPay',
    slug: 'fspay',
    version: '1.1.0',
    plugins: [
      "expo-barcode-scanner"
    ],
    extra: {
      USE_MOCK: false, // false para rodar com backend
    },
  },
};