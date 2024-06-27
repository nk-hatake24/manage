import React from "react";

const Modals = ({ open, onClose, children }) => {
  return (
    <div
        onClick={onClose}
        className={`fixed h-screen inset-0 justify-center items-center transition-all ${
          open ? " flex  bg-black/80 z-10" : "hidden"
        }`}
      >
        <div onClick={(e) => e.stopPropagation()} className={`bg-white p-6 dark:bg-gray-900 transition-all ${open? 'scale-100 opacity-100':'opacity-0 scale-0' }`}>
          <button onClick={onClose} className="absolute top-2 right-2 p-1 bg-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800">X</button>
          {children}
        </div>
    </div>
  );
};

export default Modals;
