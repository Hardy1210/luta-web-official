'use client'

export default function NavbarTest() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999999,
        width: '100%',
        padding: '24px 32px',
        background: 'transparent',
        color: '#ffffff',
        mixBlendMode: 'difference',
        fontWeight: 900,
      }}
    >
      <span style={{ marginRight: 32, fontSize: 28, letterSpacing: '0.12em' }}>
        LOGO
      </span>

      <a href="#white" style={{ marginRight: 24, color: '#ffffff' }}>
        WHITE
      </a>

      <a href="#black" style={{ marginRight: 24, color: '#ffffff' }}>
        BLACK
      </a>

      <a href="#image" style={{ color: '#ffffff' }}>
        IMAGE
      </a>
    </nav>
  )
}