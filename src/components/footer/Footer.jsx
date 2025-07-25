import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
return (
    <footer className={styles.footer}>
        <div className={styles.footerInfo}>
            <div className={styles.brand}>🍔 RollingBurger</div>

            <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink} aria-label="Facebook">
                    📘
                </a>
                <a href="#" className={styles.socialLink} aria-label="Instagram">
                    📷
                </a>
                <a href="#" className={styles.socialLink} aria-label="Twitter">
                    🐦
                </a>
            </div>
        </div>
        <hr style={{ borderColor: "#fff", backgroundColor: "#fff", color: "#fff" }}/>
        <div className={styles.footerBottom}>
            <p className={styles.copyright}>
                &copy; {new Date().getFullYear()}{" "}
                <span className={styles.highlight}>RollingBurger</span>. Todos los
                derechos reservados. Hecho con ❤️ para los amantes de las
                hamburguesas.
            </p>
        </div>
    </footer>
);
};

export default Footer;
