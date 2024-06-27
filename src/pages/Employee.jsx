// components/Employee.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Dashboard from '../layouts/Dashboard';
import Modals from '../layouts/Modals';
import { FaEye, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { HiPencil } from 'react-icons/hi2';
import { fetchEmployees } from '../features/employee/employeSlice';

export const Employee = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openListItem, setOpenListItem] = useState(false);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [modifyItemModal, setModifyItemModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModifyEmployee, setModifyEmployee] = useState({
    name_employee: '',
    email: '',
    salary: 0,
    address: '',
    function_employee: role,
  });
  const [newEmployee, setNewEmployee] = useState({
    name_employee: '',
    email: '',
    salary: 0,
    address: '',
    function_employee: role,
    password: '',
  });

  const dispatch = useDispatch();
  const employeeList = useSelector((state) => state.employee.list);
  const employeeStatus = useSelector((state) => state.employee.status);
  const employeeError = useSelector((state) => state.employee.error);

  useEffect(() => {
    if (employeeStatus === 'idle') {
      dispatch(fetchEmployees());
    }else if(employeeStatus === 'loading'){
      setLoading(true)
      const print = 'loading'
    }
  }, [employeeStatus, dispatch]);

  const onProductClick = (employee) => {
    setOpenListItem(true);
    setSelectedEmployee(employee);
  };

  const onDeleteClick = (employee) => {
    setDeleteItemModal(true);
    setSelectedEmployee(employee);
  };

  const onFinalDeleteClick = async (employeeId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found, please login again.');
      return;
    }

    try {
      await axios.delete(`http://localhost:3500/api/employee/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchEmployees());
      setDeleteItemModal(false);
    } catch (error) {
      console.error('Error deleting employee:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const onModifyEmployee = (employee) => {
    setModifyItemModal(true);
    setModifyEmployee(employee);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found, please login again.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3500/api/employee/${selectedModifyEmployee._id}`, selectedModifyEmployee, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchEmployees());
      setModifyItemModal(false);
    } catch (error) {
      console.error('Error updating employee:', error);
      console.log(error.message)
      alert(error.message);
    }
  };

  const handleModify = (e) => {
    const { name, value } = e.target;
    setModifyEmployee((prevState) => ({
      ...prevState,
      function_employee: role,
      [name]: value,
    }));
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      function_employee: role,
      [name]: value,
    });
  };

  const handleAddEmployee = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found, please login again.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3500/api/employee/register', newEmployee, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchEmployees());
      setOpenAdd(false);
    } catch (error) {
      console.error('Error adding employee:', error);
      alert(error.response.data.message);
    }
  };

  const filteredEmployees = employeeList.filter((employee) =>
    employee.name_employee && employee.name_employee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dashboard>
      <div className="p-2 md:p-8">
        {/* Modal for adding an entry */}
        <Modals open={openAdd} onClose={() => setOpenAdd(false)}>
          <div className="flex flex-col gap-2 min-w-80">
            <h1 className="text-2xl mt-2">Ajouter une entrée</h1>
            <label htmlFor="name_employee">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name_employee"
              className="p-2 text-gray-900"
              placeholder="john doe"
              value={newEmployee.name_employee}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              className="p-2 text-gray-900"
              placeholder="johndoe@gmail.com"
              value={newEmployee.email}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="role">
              Role: <span className="text-red-500">*</span>{' '}
            </label>
            <select
              className="text-gray-800 p-2"
              name="function_employee"
              value={newEmployee.function_employee}
              onChange={handleInputChange}
            >
              <option value="manager" onClick={() => setRole('manager')}>
                Manager
              </option>
              <option value="employee" onClick={() => setRole('employee')}>
                Employee
              </option>
            </select>
            <label htmlFor="salary">
              Salaire (CFA) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="salary"
              className="p-2 text-gray-900"
              placeholder="30000"
              value={newEmployee.salary}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="address">
              Adresse <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              className="p-2 text-gray-900"
              placeholder="lafe 2 bafoussam"
              value={newEmployee.address}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="password">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              className="p-2 text-gray-900"
              placeholder="Mot de passe"
              value={newEmployee.password}
              onChange={handleInputChange}
              required
            />
            <div className="flex flex-row justify-between">
              <button className="bg-green-400 hover:bg-green-600 p-1" onClick={handleAddEmployee}>
                Ajouter
              </button>
              <button className="bg-red-400 hover:bg-red-600 p-1" onClick={() => setOpenAdd(false)}>
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
          {selectedEmployee && (
            <div className="m-8 text-center flex gap-4 flex-col capitalize">
              <h2 className="text-2xl pb-2 ">{selectedEmployee.name_employee}</h2>
              <p>Nom: {selectedEmployee.name_employee}</p>
              <p>Fonction: {selectedEmployee.function_employee}</p>
              <p>Email: {selectedEmployee.email}</p>
              <p>Adresse: {selectedEmployee.address}</p>
              <p>Salaire: {selectedEmployee.salary}</p>
            </div>
          )}
        </Modals>

        <Modals
          open={deleteItemModal}
          onClose={() => {
            setDeleteItemModal(false);
          }}
        >
          {selectedEmployee && (
            <div className="flex flex-col gap-4  justify-center items-center">
              <FaTrashAlt size={50} className="text-red-600" />
              <p className="text-2xl">Supprimer</p>
              <p className="text-xl">{selectedEmployee._id}</p>
              <p className="text-xl">{selectedEmployee.name_employee}</p>

              <div className="flex flex-row gap-10 justify-between">
                <button onClick={() => onFinalDeleteClick(selectedEmployee._id)} className="p-1 bg-red-400 hover:bg-red-600">
                  Supprimer
                </button>
                <button onClick={() => setDeleteItemModal(false)} className="p-1  bg-orange-400 hover:bg-orange-600">
                  Annuler
                </button>
              </div>
            </div>
          )}
        </Modals>

        <Modals open={modifyItemModal} onClose={() => setModifyItemModal(false)}>
          {selectedModifyEmployee && (
            <div className="flex flex-col gap-2 min-w-80">
              <h1 className="text-2xl mt-2">Modifier une entrée</h1>
              <label htmlFor="name_employee">Nom</label>
              <input
                type="text"
                name="name_employee"
                className="p-2 text-gray-900"
                onChange={handleModify}
                placeholder="john doe"
                value={selectedModifyEmployee.name_employee}
              />
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                className="p-2 text-gray-900"
                onChange={handleModify}
                placeholder="johndoe@gmail.com"
                value={selectedModifyEmployee.email}
              />
              <label htmlFor="role">Role:</label>
              <select
                className="text-gray-800 p-2"
                name="function_employee"
                value={selectedModifyEmployee.function_employee}
                onChange={handleModify}
              >
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
              <label htmlFor="salary">Salaire (cfa)</label>
              <input
                type="number"
                name="salary"
                className="p-2 text-gray-900"
                onChange={handleModify}
                placeholder="30000"
                value={selectedModifyEmployee.salary}
              />
              <label htmlFor="address">Adresse</label>
              <input
                type="text"
                name="address"
                className="p-2 text-gray-900"
                onChange={handleModify}
                placeholder="lafe 2 bafoussam"
                value={selectedModifyEmployee.address}
              />
              <div className="flex flex-row justify-between">
                <button className="bg-green-400 hover:bg-green-600 p-1" onClick={handleSaveChanges}>
                  Sauvegarder
                </button>
                <button className="bg-red-400 hover:bg-red-600 p-1" onClick={() => setModifyItemModal(false)}>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </Modals>

        <div className="h-screen">
          <div className="flex justify-between pb-3  flew-row ">
            <div onClick={() => setOpenAdd(true)} className="flex justify-center gap-2">
              <span className="p-1 bg-green-0  hover:bg-green-600 cursor-pointer">
                <FaPlus />
              </span>
              Ajouter
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
            <div className="flex flex-row justify-between  py-2 bg-gray-200 dark:bg-gray-700">
              <p className="w-1/4 justify-center flex"> Employé</p>
              <p className="w-1/4 justify-center flex">Fonction</p>
              <p className="hidden w-1/4 justify-center md:flex">Salaire (CFA)</p>
              <p className="w-1/4 justify-center flex"> detail / supprimer</p>
            </div>
            <div className="flex flex-col overflow-y-scroll overflow-x-clip pb-3 p hal px-8 md:px-0 max-w-full">
            {filteredEmployees.map((index) => (
                <div className="flex flex-row justify-between border-y-1 py-2" key={index._id}>
                  <p className="w-1/4 justify-center flex">{index.name_employee}</p>
                  <p className="w-1/4 justify-center flex">{index.function_employee}</p>
                  <p className="hidden w-1/4 justify-center md:flex">{index.salary}</p>
                  <div className="w-1/4 justify-center flex flew-row gap-4">
                    <div
                      className="p-1  bg-orange-0 hover:bg-orange-600 hover:cursor-pointer "
                      onClick={() => {
                        onProductClick(index);
                      }}
                    >
                      <FaEye />
                    </div>

                    <div
                      className="p-1  bg-yellow-0 hover:bg-yellow-600 hover:cursor-pointer "
                      onClick={() => {
                        onModifyEmployee(index);
                      }}
                    >
                      <HiPencil />
                    </div>

                    <div onClick={() => onDeleteClick(index)} className="p-1 bg-red-0 hover:cursor-pointer hover:bg-red-600 ">
                      <FaTrashAlt />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};
