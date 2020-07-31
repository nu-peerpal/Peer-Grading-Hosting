import React from 'react';
import Link from 'next/link'
import styles from "./styles/header.module.css";

const Header = () => (
    <div className={styles.header}>
        <Link href={"/"}>
        <h1 className={styles.name}>PeerPal</h1>
        </Link>
    </div>
);

export default Header;