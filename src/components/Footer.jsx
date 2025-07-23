import React from 'react'

const Footer = () => {
return (
    <footer style={{ background: "#222", color: "#fff", padding: "1rem", textAlign: "center" }}>
        <p>&copy; {new Date().getFullYear()} Mi Tienda. Todos los derechos reservados.</p>
    </footer>
)
}

export default Footer