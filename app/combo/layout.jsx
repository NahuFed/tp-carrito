"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/src/store";
import SidebarPageWrapper from "@/src/components/containers/SidebarPageWrapper";
import Carrito from "@/src/components/carrito/Carrito";

export default function ComboLayout({ children }) {
  return (
    <Provider store={store}>
      <SidebarPageWrapper sidebar={<Carrito />}>
        {children}
      </SidebarPageWrapper>
    </Provider>
  );
}
