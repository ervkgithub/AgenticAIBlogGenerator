export type MarketingProps = {
  headline: string;
  supportingCopy: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  featuredHighlights: string[];
};

export type CatalogItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  trend: "up" | "steady";
};

export type CatalogProps = {
  sectionTitle: string;
  items: CatalogItem[];
};

export type AccountProps = {
  userName: string;
  tier: string;
  completionRate: number;
  nextBestActions: string[];
};

export type CheckoutProps = {
  cartCount: number;
  subtotal: number;
  shippingEta: string;
  trustSignals: string[];
};

export type RemoteWidgetMap = {
  marketing: MarketingProps;
  catalog: CatalogProps;
  account: AccountProps;
  checkout: CheckoutProps;
};

export type RemoteDefinition<K extends keyof RemoteWidgetMap = keyof RemoteWidgetMap> = {
  key: K;
  displayName: string;
  description: string;
  route: string;
  scriptUrl: string;
  tagName: string;
  props: RemoteWidgetMap[K];
};

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export const demoRemoteProps: RemoteWidgetMap = {
  marketing: {
    headline: "Launch campaigns without slowing product teams down",
    supportingCopy:
      "Marketing ships promotional content independently while still following the platform contract enforced by the shell.",
    primaryActionLabel: "View launch plan",
    primaryActionHref: "#microfrontends",
    featuredHighlights: [
      "Independent release cadence",
      "Shared contracts and governance",
      "Fast local development"
    ]
  },
  catalog: {
    sectionTitle: "Trending products",
    items: [
      { id: "sku-1", name: "Edge Router", category: "Networking", price: 249, trend: "up" },
      { id: "sku-2", name: "Studio Headset", category: "Audio", price: 129, trend: "steady" },
      { id: "sku-3", name: "4K Dock", category: "Workstation", price: 189, trend: "up" }
    ]
  },
  account: {
    userName: "Avery",
    tier: "Gold",
    completionRate: 78,
    nextBestActions: ["Verify security passkey", "Review billing profile", "Redeem loyalty upgrade"]
  },
  checkout: {
    cartCount: 3,
    subtotal: 567,
    shippingEta: "Arrives in 2 business days",
    trustSignals: ["PCI aligned checkout", "Real-time fraud scoring", "30-day returns"]
  }
};
