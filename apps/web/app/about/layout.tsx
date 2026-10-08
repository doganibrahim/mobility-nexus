import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkımızda • Proje Misyonu & Ekosistem | ErasmusMobility',
  description:
    'ErasmusMobility; mesleki ve teknik eğitim kurumlarının KA121/KA122 hareketliliklerini planlamasını ve doğrulanmış Avrupa işletmeleriyle doğrudan eşleşmesini sağlayan bağımsız karar destek ekosistemidir.',
  alternates: {
    canonical: 'https://www.erasmusmobility.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
