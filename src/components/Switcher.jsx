import React, { useState } from 'react';
import Mode from './Mode';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

export default function Switcher() {
  const [colorTheme, setTheme] = Mode();
  const [darkSide, setDarkSide] = useState(colorTheme === 'light' ? true : false);

  const toggleDarkMode = checked => {
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  return (
    <>
      <div className="z-50">
        <DarkModeSwitch checked={darkSide} onChange={toggleDarkMode} size={20} />
      </div>
    </>
  );
}