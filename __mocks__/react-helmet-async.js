// services/frontend/dashboard/__mocks__/react-helmet-async.js
// A simple mock for react-helmet-async
// This helps confirm if the issue is with the actual module loading/exports
// or something else in the Jest configuration.
export const Helmet = () => {
  return null;
};

export const HelmetProvider = ({ children }) => {
  return children;
};

// Provide both named and a default export for robustness, as some
// libraries might be imported in different ways.
export default { Helmet, HelmetProvider };
