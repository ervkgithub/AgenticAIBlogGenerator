import { demoRemoteProps, type RemoteDefinition } from "@micro/contracts";

export const remoteDefinitions: RemoteDefinition[] = [
  {
    key: "marketing",
    displayName: "Marketing",
    description: "Owns hero messaging, announcements, and conversion funnels.",
    route: "http://localhost:3001",
    scriptUrl: "http://localhost:3001/bundle.js",
    tagName: "marketing-widget",
    props: demoRemoteProps.marketing
  },
  {
    key: "catalog",
    displayName: "Catalog",
    description: "Owns discovery, merchandising, and inventory-rich experiences.",
    route: "http://localhost:3002",
    scriptUrl: "http://localhost:3002/bundle.js",
    tagName: "catalog-widget",
    props: demoRemoteProps.catalog
  },
  {
    key: "account",
    displayName: "Account",
    description: "Owns authenticated journeys, profile completion, and loyalty surfaces.",
    route: "http://localhost:3003",
    scriptUrl: "http://localhost:3003/bundle.js",
    tagName: "account-widget",
    props: demoRemoteProps.account
  },
  {
    key: "checkout",
    displayName: "Checkout",
    description: "Owns trust, payments, and order confidence messaging.",
    route: "http://localhost:3004",
    scriptUrl: "http://localhost:3004/bundle.js",
    tagName: "checkout-widget",
    props: demoRemoteProps.checkout
  }
];
