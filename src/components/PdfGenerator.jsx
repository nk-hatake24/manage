import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import { FaDownload } from 'react-icons/fa';

const PdfGenerator = ({ transactions }) => {

    const generatePDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["date", "quantity_resource", "total_Price", "resource", "employee"];
        const tableRows = [];
        
       
        transactions.forEach(transaction => {
          const transactionData = [
            transaction.date,
            transaction.quantity_resource,
            transaction.total_price,
            transaction.resource.name_resource,
            transaction.employee.name_employee
          ];
          tableRows.push(transactionData);
        });
    
        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.save('transactions.pdf');
      };
    

  return (
    <div>
      <button onClick={generatePDF}> <FaDownload /> </button>
    </div>
  );
};

export default PdfGenerator;
