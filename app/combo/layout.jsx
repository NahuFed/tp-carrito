"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/src/store";
import styles from "../../src/components/combo/ProductoCombo.module.css";
import Carrito from "@/src/components/carrito/Carrito";

export default function ComboLayout({ children }) {
  return (
    <Provider store={store}>
      <div className={styles.pageLayout}>
        <div className={styles.mainColumn}>
          {children}
        </div>
        <div className={styles.sidebarColumn}>
          <Carrito />
        </div>
      </div>
    </Provider>
  );
}
