import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaDownload, FaEnvelope, FaShareAlt } from "react-icons/fa";
import {

  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import emailjs from 'emailjs-com'
import Modals from "../layouts/Modals";

const SharePdf = ({ transactions }) => {
  const form = useRef();

  const [addOpen, setAddOpen] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "date",
      "quantity_resource",
      "total_Price",
      "resource",
      "employee",
    ];
    const tableRows = [];

    transactions.forEach((transaction) => {
      const transactionData = [
        transaction.date,
        transaction.quantity_resource,
        transaction.total_price,
        transaction.resource.name_resource,
        transaction.employee.name_employee,
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    return doc.save("transactions.pdf");
  };

  const getPDFUrl = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "date",
      "quantity_resource",
      "total_Price",
      "resource",
      "employee",
    ];
    const tableRows = [];

    transactions.forEach((transaction) => {
      const transactionData = [
        transaction.date,
        transaction.quantity_resource,
        transaction.total_price,
        transaction.resource.name_resource,
        transaction.employee.name_employee,
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    return doc.output("Transactionpdf");
  };
  const sendEmail = (e) => {
    e.preventDefault();

    const doc = new jsPDF();
    const tableColumn = ["Date", "Quantity Resource", "Total Price", "Resource", "Employee"];
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
    const pdfData = doc.output('blob'); // Get the PDF as a Blob

    const formData = new FormData();
    formData.append('file', pdfData, 'transactions.pdf');

    // Sending the email using EmailJS
    emailjs.sendForm('service_2za17eq', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_USER_ID')
      .then((result) => {
          console.log(result.text);
          alert('Email sent successfully');
      }, (error) => {
          console.log(error.text);
          alert('Failed to send email');
      });
  };

  const pdfDataURL = getPDFUrl();

  return (
    <div>
      <Modals open={addOpen} onClose={() => setAddOpen(false)}>
        <div className="flex flex-col gap-12">
          <h4 className="text-3xl">Share:</h4>
          <div className="flex gap-7">
            <form ref={form} onSubmit={sendEmail}>
              <button type="submit">
                {" "}
                <FaEnvelope /> 
              </button>
              <input type="hidden" name="pdf_data" value="transactions.pdf" />
            </form>
            <FacebookShareButton
              url={pdfDataURL}
              quote="Check out this PDF of transactions!"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton
              url={pdfDataURL}
              title="Check out this PDF of transactions!"
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
        </div>
      </Modals>
      <button onClick={() => setAddOpen(true)}>
        {" "}
        <FaShareAlt />{" "}
      </button>
    </div>
  );
};

export default SharePdf;
