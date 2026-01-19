
import './globals.css';

export const metadata = {
    title: 'Sentinel Dashboard',
    description: 'Cybersecurity Monitor',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}