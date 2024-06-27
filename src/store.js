// store.js
import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './features/employee/employeSlice';
import budgetReducer from './features/budget/budgetSlice';
import supplierReducer from './features/supplier/supplierSlice';
import resourceReducer from './features/resource/resourceSlice';
import transactionReducer from './features/transaction/transactionSlice';
import noteReducer from './features/note/noteSlice';
import sellReducer from './features/sell/sellSlice'

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    budget: budgetReducer,
    resource: resourceReducer,
    supplier: supplierReducer,
    transaction: transactionReducer,
    note: noteReducer,
    sell: sellReducer
  },
});
