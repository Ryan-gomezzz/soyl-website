// Admin layout - inherits from root layout
// This layout can be used to add admin-specific UI elements if needed
// For now, it just passes through children since root layout handles Header/Footer
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

