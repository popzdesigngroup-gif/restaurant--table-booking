'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  value: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ value }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(value, { width: 220, margin: 2, color: { dark: '#090d16', light: '#ffffff' } })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error(err));
  }, [value]);

  if (!dataUrl) {
    return <div className="w-48 h-48 bg-slate-800 animate-pulse rounded-xl" />;
  }

  return (
    <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-700">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt={`QR Code for ${value}`} className="w-48 h-48 object-contain" />
    </div>
  );
};
