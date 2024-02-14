import React from 'react';
import { createRoot } from 'react-dom/client';
import MenuWindow from './MenuWindow';
import MenuStats from './MenuStats';
import MenuOptions from './MenuOptions';
import { store } from "/store";
import { Provider } from "react-redux";

// Render your React component instead

export default class MenuUI {
  constructor () {
    const root = createRoot(document.getElementById('menu-container'));
    root.render(
      <main onClick={e => {
        e.stopPropagation()
        return false
      }}>
        <Provider store={store}>
          <MenuWindow />
          <MenuStats />
          <MenuOptions />
        </Provider>
      </main>
    );
  }
}