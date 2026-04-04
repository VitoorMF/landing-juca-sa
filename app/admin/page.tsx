export default function AdminPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--green-deep)',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      gap: '16px',
    }}>
      <div style={{ fontSize: 64 }}>🔒</div>
      <h1 style={{ fontFamily: 'Merriweather, serif', fontSize: 32 }}>Painel Administrativo</h1>
      <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16 }}>Em desenvolvimento — em breve disponível.</p>
      <a href="/" style={{ color: 'var(--teal-light)', fontWeight: 600, marginTop: 8 }}>← Voltar ao site</a>
    </div>
  )
}
