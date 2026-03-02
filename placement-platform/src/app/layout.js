import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata = {
    title: "Placify AI — Intelligent Placement & Hiring Platform",
    description: "AI-powered platform connecting companies, students, and placement cells for smarter hiring decisions",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased">
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-[calc(100vh-4rem)]">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
