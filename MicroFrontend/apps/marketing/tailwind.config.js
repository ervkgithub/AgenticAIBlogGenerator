module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "mkt-",
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      boxShadow: {
        card: "0 16px 40px rgba(15, 23, 42, 0.12)"
      }
    }
  }
};

