'use client';

import QRCode from 'qrcode.react';
import { useRef } from 'react';

export function TokenQRCode({ token }: { token: string }) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const element = qrRef.current?.querySelector('canvas');
    if (element) {
      const url = (element as HTMLCanvasElement).toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'webank-token.png';
      link.click();
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    alert('Token copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* QR Code */}
      <div className="flex justify-center" ref={qrRef}>
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-300">
          <QRCode
            value={token}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      {/* Token Display */}
      <div className="space-y-3">
        <label className="block">
          <span className="text-lg font-semibold text-slate-800 block text-center mb-3">Your Token</span>
          <input
            value={token}
            readOnly
            className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 px-5 py-4 text-center text-lg font-mono text-slate-900 focus:outline-none"
          />
        </label>
        <button
          onClick={copyToken}
          className="w-full rounded-2xl bg-slate-200 hover:bg-slate-300 px-5 py-4 text-lg font-semibold text-slate-900 transition-colors"
        >
          📋 Copy Token
        </button>
        <button
          onClick={downloadQR}
          className="w-full rounded-2xl bg-slate-200 hover:bg-slate-300 px-5 py-4 text-lg font-semibold text-slate-900 transition-colors"
        >
          📥 Download QR Code
        </button>
      </div>
    </div>
  );
}
