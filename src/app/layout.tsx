import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>
                    Florencia Michelli | Architecture & Interior Design | Tel
                    Aviv
                </title>
                <meta
                    name="Architect & Interior Designer"
                    content="Florencia Michelli Portfolio"
                />
            </head>
            <body className={inter.className}>
                <Navbar />
                <main className="min-h-screen pt-16">{children}</main>
            </body>
        </html>
    );
}
