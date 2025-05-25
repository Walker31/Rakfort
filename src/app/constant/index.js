import { 
    BarChart3, 
    Home, 
    FileText, 
    Key,
    MessageSquare, 
    Link, 
    ShieldAlert, 
    ScanLine, 
    Terminal, 
    ListChecks, 
    Settings,
    UsersRound 
} from "lucide-react";

export const navbarLinks = [
    {
        title: "",
        links: [
            {
                label: "Chat",
                icon: MessageSquare, // FileText icon for Reports
                path: "/chat",
            },
            {
                label: "Dashboard",
                icon: BarChart3, // Home icon for Dashboard
                path: "/",
            },
            {
                label: "Reports",
                icon: FileText, // FileText icon for Reports
                path: "/reports",
            },
            {
                label: "People",
                icon: UsersRound, // Bar chart icon for Analytics
                path: "/people",
            },
        ],
    },
    {
        title: "Connections",
        links: [
            {
                label: "API Tokens",
                icon: Key, // Key icon for API Tokens
                path: "/api-tokens",
            },
            {
                label: "Connections",
                icon: Link, // Link icon for Connections
                path: "/connections",
            },
            {
                label: "Attack Campaigns",
                icon: ShieldAlert, // ShieldAlert icon for Attack Campaigns
                path: "/attack-campaigns",
            },
            {
                label: "Scanners",
                icon: ScanLine, // ScanLine icon for Scanners
                path: "/scanners",
            },
            {
                label: "Play Ground",
                icon: Terminal, // Terminal icon for Play Ground
                path: "/playground",
            },
        ],
    },
    {
        title: " ",
        links: [
            {
                label: "Logs",
                icon: ListChecks, // ListChecks icon for Logs
                path: "/logs",
            },
            {
                label: "Settings",
                icon: Settings, // Settings icon for Settings
                path: "/settings",
            },
        ],
    },
];
