import React from 'react';
import { NavLink } from 'react-router-dom';
import Dashboard from '../layouts/Dashboard';

export default function Resource({ children }) {
  const CustomNavLink = ({ to, exact, children }) => {
    return (
      <NavLink
        exact={exact}
        to={to}
        className={({ isActive }) =>
          `p-1 flex justify-center w-1/2 hover:bg-gray-300 dark:hover:bg-gray-600 ${
            isActive ? 'dark:bg-gray-600 bg-gray-300 shadow-sm shadow-gray-400' : 'text-black dark:text-white'
          }`
        }
      >
        {children}
      </NavLink>
    );
  };
  
  return (
    <Dashboard>
      <div className="flex flex-row w-full bg-gray-200 dark:bg-gray-700">
        <CustomNavLink to='/detail' >Detail</CustomNavLink>
        <CustomNavLink to='/supplier'>fournisseur</CustomNavLink>
      </div>
      
      <div>{children}</div>
      
    </Dashboard>
  );
}
