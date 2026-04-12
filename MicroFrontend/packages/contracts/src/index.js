export const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
});
export const demoRemoteProps = {
    marketing: {
        headline: "Launch campaigns without slowing product teams down",
        supportingCopy: "Marketing ships promotional content independently while still following the platform contract enforced by the shell.",
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
