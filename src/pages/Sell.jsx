import React, { useState, useEffect } from "react";
import axios from "axios";
import Modals from "../layouts/Modals";
import { FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { HiPencil } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources } from "../features/resource/resourceSlice";
import { fetchSuppliers } from "../features/supplier/supplierSlice";
import { fetchTransactions } from "../features/sell/sellSlice";
import Dashboard from "../layouts/Dashboard";
import PdfGenerator from "../components/PdfGenerator";
import { Transaction } from "./Transaction";
import SharePdf from "../components/SharePdf";

export const Sell = () => {
  const currentUser = localStorage.getItem("id");
  const [openAdd, setOpenAdd] = useState(false);
  const [openListItem, setOpenListItem] = useState(false);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [modifyItemModal, setModifyItemModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedModifyTransaction, setModifyTransaction] = useState({
    _id: "",
    date: "",
    quantity_resource: "",
    total_price: "",
    resource: "",
    employee: currentUser,
  });
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    quantity_resource: "",
    total_price: "",
    resource: "",
    employee: currentUser,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const transactionList = useSelector((state) => state.sell.list);
  const transactionStatus = useSelector((state) => state.sell.status);
  const transactionError = useSelector((state) => state.sell.error);

  const resourceList = useSelector((state) => state.resource.list);
  const resourceStatus = useSelector((state) => state.resource.status);
  const resourceError = useSelector((state) => state.resource.error);

  const employeeList = useSelector((state) => state.employee.list);
  const employeeStatus = useSelector((state) => state.employee.status);
  const employeeError = useSelector((state) => state.employee.error);

  useEffect(() => {
    if (transactionStatus === "idle") {
      dispatch(fetchTransactions());
    }
    if (resourceStatus === "idle") {
      dispatch(fetchResources());
    }
    if (employeeStatus === "idle") {
      dispatch(fetchSuppliers());
    }
  }, [transactionStatus, resourceStatus, employeeStatus, dispatch]);

  const onTransactionClick = (transaction) => {
    setOpenListItem(true);
    setSelectedTransaction(transaction);
  };

  const onDeleteClick = (transaction) => {
    setDeleteItemModal(true);
    setSelectedTransaction(transaction);
  };

  const onFinalDeleteClick = async (transactionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found, please login again.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3500/api/sell/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchTransactions());
      setDeleteItemModal(false);
    } catch (error) {
      console.error(
        "Error deleting transaction:",
        error.response ? error.response.data : error.message
      );
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const onModifyTransaction = (transaction) => {
    setModifyItemModal(true);
    setModifyTransaction(transaction);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found, please login again.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3500/api/sell/${selectedModifyTransaction._id}`,
        selectedModifyTransaction,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchTransactions());
      setModifyItemModal(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const handleModify = (e) => {
    const { name, value } = e.target;
    setModifyTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  const handleAddTransaction = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found, please login again.");
      return;
    }

    try {
      await axios.post("http://localhost:3500/api/sell", newTransaction, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchTransactions());
      setOpenAdd(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const filteredTransactions = transactionList.filter((transaction) =>
    transaction.resource.name_resource
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Transaction>
      <div className="p-2 md:p-8">
        {/* Modal pour ajouter une transaction */}
        <Modals open={openAdd} onClose={() => setOpenAdd(false)}>
          <div className="flex flex-col gap-2 min-w-80">
            <h1 className="text-2xl mt-2">Ajouter une transaction</h1>
            <label htmlFor="date">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              className="p-2 text-gray-900"
              onChange={handleInputChange}
              value={newTransaction.date}
            />
            <label htmlFor="quantity_resource">
              Quantité <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity_resource"
              className="p-2 text-gray-900"
              onChange={handleInputChange}
              value={newTransaction.quantity_resource}
              placeholder="Quantité"
            />
            <label htmlFor="resource">
              Ressource <span className="text-red-500">*</span>
            </label>
            <select
              name="resource"
              className="p-2 text-gray-900"
              onChange={handleInputChange}
              value={newTransaction.resource}
            >
              <option value="">Sélectionner une ressource</option>
              {resourceList.map((resource) => (
                <option key={resource._id} value={resource._id}>
                  {resource.name_resource}
                </option>
              ))}
            </select>
           

            <div className="flex flex-row justify-between">
              <button
                className="bg-green-400 hover:bg-green-600 p-1"
                onClick={handleAddTransaction}
              >
                Ajouter
              </button>
              <button
                className="bg-red-400 hover:bg-red-600 p-1"
                onClick={() => setOpenAdd(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </Modals>

        <Modals
          open={openListItem}
          onClose={() => {
            setOpenListItem(false);
          }}
        >
          {selectedTransaction && (
            <div className="m-8 text-center flex gap-4 flex-col capitalize">
              <h2 className="text-2xl pb-2 ">
                Transaction: {selectedTransaction.date}
              </h2>
              <p>Quantité: {selectedTransaction.quantity_resource}</p>
              <p>Prix Total: {selectedTransaction.total_price}</p>
              <p>Ressource: {selectedTransaction.resource.name_resource}</p>
              <p>Employé: {selectedTransaction.employee.name_employee}</p>
            </div>
          )}
        </Modals>

        <Modals
          open={deleteItemModal}
          onClose={() => {
            setDeleteItemModal(false);
          }}
        >
          {selectedTransaction && (
            <div className="flex flex-col gap-4 justify-center items-center">
              <FaTrashAlt size={50} className="text-red-600" />
              <p className="text-2xl">Supprimer</p>
              <p className="text-xl">{selectedTransaction.date}</p>
              <div className="flex flex-row gap-10 justify-between">
                <button
                  onClick={() => onFinalDeleteClick(selectedTransaction._id)}
                  className="p-1 bg-red-400 hover:bg-red-600"
                >
                  Supprimer
                </button>
                <button
                  className="p-1 bg-orange-400 hover:bg-orange-600"
                  onClick={() => setDeleteItemModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </Modals>

        <Modals
          open={modifyItemModal}
          onClose={() => setModifyItemModal(false)}
        >
          {selectedModifyTransaction && (
            <div className="flex flex-col gap-2 min-w-80">
              <h1 className="text-2xl mt-2">Modifier une transaction</h1>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                name="date"
                className="p-2 text-gray-900"
                onChange={handleModify}
                value={selectedModifyTransaction.date}
              />
              
              <label htmlFor="resource">Ressource</label>
              <select
                name="resource"
                className="p-2 text-gray-900"
                onChange={handleModify}
                value={selectedModifyTransaction.resource}
              >
                <option value="">Sélectionner une ressource</option>
                {resourceList.map((resource) => (
                  <option key={resource._id} value={resource._id}>
                    {resource.name_resource}
                  </option>
                ))}
              </select>
             
              <div className="flex flex-row justify-between">
                <button
                  className="bg-green-400 hover:bg-green-600 p-1"
                  onClick={handleSaveChanges}
                >
                  Sauvegarder
                </button>
                <button
                  className="bg-red-400 hover:bg-red-600 p-1"
                  onClick={() => setModifyItemModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </Modals>

        <div className="h-screen">
          <div className="flex justify-between pb-3 text-gray-700 dark:text-text-50 flew-row ">
            <div
              onClick={() => setOpenAdd(true)}
              className="flex justify-center gap-2 dark:text-gray-50"
            >
              <span className="p-1  hover:bg-green-600 cursor-pointer">
                <FaPlus />
              </span>
              Ajouter
            </div>
           
            <div className="flex gap-5 dark:text-gray-50">
              <div>
                <PdfGenerator transactions={filteredTransactions} />
              </div>
              <div>
                <SharePdf transactions={filteredTransactions} />
              </div>
            </div>


            <div className=" flex flex-row items-center  px-1 gap-1 rounded bg-white dark:bg-gray-600">
              <CiSearch className="dark:text-gray-50 " />
              <input
                type="text"
                placeholder="search"
                className="p-1 outline-0 dark:text-gray-50 dark:bg-gray-600"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className=" overflow-clip">
            <div className="flex flex-row justify-between w py-2 bg-gray-200 dark:bg-gray-700">
              <p className="w-1/4 justify-center flex"> Date</p>
              <p className="w-1/4 justify-center flex">Quantité</p>
              <p className="hidden w-1/4 justify-center md:flex">Prix Total</p>
              <p className="w-1/4 justify-center flex"> détail / supprimer</p>
            </div>
            <div className="flex flex-col overflow-y-scroll overflow-x-clip px-8 md:px-0 pb-3  hal  max-w-full">
              {filteredTransactions.map((transaction) => (
                <div
                  className="flex flex-row text-gray-800 dark:text-gray-50 justify-between border-y-1 py-2"
                  key={transaction._id}
                >
                  <p className="w-1/4 justify-center flex">
                    {transaction.date}
                  </p>
                  <p className="w-1/4 justify-center flex">
                    {transaction.quantity_resource}
                  </p>
                  <p className="hidden w-1/4 justify-center md:flex">
                    {transaction.total_price}
                  </p>
                  <div className="w-1/4 justify-center flex flew-row gap-4">
                    <div
                      className="p-1  hover:bg-orange-600 hover:cursor-pointer "
                      onClick={() => {
                        onTransactionClick(transaction);
                      }}
                    >
                      <FaEye />
                    </div>

                    <div
                      className="p-1 hover:bg-yellow-600 hover:cursor-pointer  "
                      onClick={() => {
                        onModifyTransaction(transaction);
                      }}
                    >
                      <HiPencil />
                    </div>

                    <div
                      onClick={() => onDeleteClick(transaction)}
                      className="p-1 hover:cursor-pointer hover:bg-red-600 "
                    >
                      <FaTrashAlt />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Transaction>
  );
};
