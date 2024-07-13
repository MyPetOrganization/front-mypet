import * as React from 'react'

interface EmailTemplateProps {
  buttonUrl: string
}

// TODO: Implementar este template en la parte del back para el reseteo de contraseña

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  buttonUrl
}) => (
  <div
    style={{
      padding: '20px',
      backgroundColor: 'white',
      display: 'grid',
      justifyItems: 'center'
    }}
  >
    <span style={{ textAlign: 'center' }}>
      Haz click acá para cambiar de contraseña 👇🏻
    </span>
    <a href={buttonUrl} style={{ margin: '10px auto' }}>
      <button>Cambiar contraseña</button>
    </a>
  </div>
)