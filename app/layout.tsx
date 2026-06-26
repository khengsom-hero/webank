import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webank | Community Ledger',
  description: 'Community debt and ledger tracker for shared expenses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
