import {
  Dashboard,
  Article, // For Reports
  People,  // For People
  VpnKey, // For API Tokens
  Link, // For Connections
  WarningAmber, // For Attack Campaigns
  DocumentScanner, // For Scanners
  Terminal, // For Play Ground
  ListAlt, // For Logs
  Settings, // For Settings
  Home
} from "@mui/icons-material";

export const navbarLinks = [
  {
    title: "",
    links: [
      {
        label: "Home",
        icon: Home, // New modern home-style icon (chat bubble feel)
        path: "/",
      },
      {
        label: "Dashboard",
        icon: Dashboard,
        path: "/dashboard",
      },
      {
        label: "Reports",
        icon: Article,
        path: "/reports",
      },
      {
        label: "People",
        icon: People,
        path: "/people",
      },
    ],
  },
  {
    title: "Connections",
    links: [
      {
        label: "API Tokens",
        icon: VpnKey,
        path: "/api-tokens",
      },
      {
        label: "Connections",
        icon: Link,
        path: "/redteam/setup",
      },
      {
        label: "Attack Campaigns",
        icon: WarningAmber,
        path: "/attack-campaigns",
      },
      {
        label: "Scanners",
        icon: DocumentScanner,
        path: "/scanners",
      },
      {
        label: "Play Ground",
        icon: Terminal,
        path: "/playground",
      },
    ],
  },
  {
    title: " ",
    links: [
      {
        label: "Logs",
        icon: ListAlt,
        path: "/logs",
      },
      {
        label: "Settings",
        icon: Settings,
        path: "/settings",
      },
    ],
  },
];
