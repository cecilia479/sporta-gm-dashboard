import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sporta GM · Sistema de Gestión Ejecutiva',
  description: 'Dashboard de evaluación y gestión para la Gerente General de Sporta Carretera a El Salvador',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
