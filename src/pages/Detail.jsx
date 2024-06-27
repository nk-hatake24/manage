// components/Detail.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../layouts/Dashboard';
import Modals from '../layouts/Modals';
import { FaEye, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { HiPencil } from 'react-icons/hi2';
import { fetchResources } from '../features/resource/resourceSlice';
import { fetchSuppliers } from '../features/supplier/supplierSlice';
import Resource from './Resource';
import axios from  'axios'


export const Detail = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openListItem, setOpenListItem] = useState(false);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [modifyItemModal, setModifyItemModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedModifyResource, setModifyResource] = useState({
    _id: '',
    quantity_resource: '',
    unit_price: '',
    name_resource: '',
    supplier: '',
  });
  const [newResource, setNewResource] = useState({
    quantity_resource: '',
    unit_price: '',
    name_resource: '',
    supplier: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const resourceList = useSelector((state) => state.resource.list);
  const resourceStatus = useSelector((state) => state.resource.status);
  const resourceError = useSelector((state) => state.resource.error);

  const supplierList = useSelector((state) => state.supplier.list);
  const supplierStatus = useSelector((state) => state.supplier.status);
  const supplierError = useSelector((state) => state.supplier.error);

  useEffect(() => {
    if (resourceStatus === 'idle') {
      dispatch(fetchResources());
    }
    if (supplierStatus === 'idle') {
      dispatch(fetchSuppliers());
    }
  }, [resourceStatus, supplierStatus, dispatch]);

  const onResourceClick = (resource) => {
    setOpenListItem(true);
    setSelectedResource(resource);
  };

  const onDeleteClick = (resource) => {
    setDeleteItemModal(true);
    setSelectedResource(resource);
  };

  const onFinalDeleteClick = async (resourceId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found, please login again.');
      return;
    }

    try {
      await axios.delete(`http://localhost:3500/api/resource/${resourceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchResources());
      setDeleteItemModal(false);
    } catch (error) {
      console.error('Error deleting resource:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const onModifyResource = (resource) => {
    setModifyItemModal(true);
    setModifyResource(resource);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found, please login again.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3500/api/resource/${selectedModifyResource._id}`,
        selectedModifyResource,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchResources());
      setModifyItemModal(false);
    } catch (error) {
      console.error('Error updating resource:', error);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const handleModify = (e) => {
    const { name, value } = e.target;
    setModifyResource((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({
      ...newResource,
      [name]: value,
    });
  };

  const handleAddResource = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found, please login again.');
      return;
    }
    console.log(newResource);

    try {
      await axios.post('http://localhost:3500/api/resource', newResource, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchResources());
      setOpenAdd(false);
    } catch (error) {
      console.error('Error adding resource:', error);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const filteredResources = resourceList.filter((resource) =>
    resource.name_resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Resource>
      <div className="p-2 md:p-8">
        {/* Modal pour ajouter une ressource */}
        <Modals open={openAdd} onClose={() => setOpenAdd(false)}>
          <div className="flex flex-col gap-2 min-w-80">
            <h1 className="text-2xl mt-2">Ajouter une ressource</h1>
            <label htmlFor="quantity_resource">
              Quantité <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity_resource"
              className="p-2 text-gray-900"
              onChange={handleInputChange}
              value={newResource.quantity_resource}
              placeholder="100"
            />
            <label htmlFor="unit_price">
              Prix Unitaire <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="unit_price"
              className="p-2 text-gray-900"
              onChange={handleInputChange}
              value={newResource.unit_price}
              placeholder="500"
            />
            <label htmlFor="name_resource">
              Nom de la Ressource <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name_resource"
              className="p-2 text-gray-900"
              onChange={handleInputChange}
              value={newResource.name_resource}
              placeholder="Eau"
            />
            <label htmlFor="supplier">
              Fournisseur <span className="text-red-500">*</span>
            </label>
            <select
              name="supplier"
              className="p-2 text-gray-900"
              onChange={handleInputChange}
              value={newResource.supplier}
            >
              <option value="">Sélectionner un fournisseur</option>
              {supplierList.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name_supplier}
                </option>
              ))}
            </select>

            <div className="flex flex-row justify-between">
              <button className="bg-green-400 hover:bg-green-600 p-1" onClick={handleAddResource}>
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
          {selectedResource && (
            <div className="m-8 text-center flex gap-4 flex-col capitalize">
              <h2 className="text-2xl pb-2 ">
                Nom: {selectedResource.name_resource}
              </h2>
              <p>Quantité: {selectedResource.quantity_resource}</p>
              <p>Prix Unitaire: {selectedResource.unit_price}</p>
              <p>Fournisseur: {selectedResource.supplier.name_supplier}</p>
            </div>
          )}
        </Modals>

        <Modals
          open={deleteItemModal}
          onClose={() => {
            setDeleteItemModal(false);
          }}
        >
          {selectedResource && (
            <div className="flex flex-col gap-4 justify-center items-center">
              <FaTrashAlt size={50} className="text-red-600" />
              <p className="text-2xl">Supprimer</p>
              <p className="text-xl">{selectedResource.name_resource}</p>
              <div className="flex flex-row gap-10 justify-between">
                <button onClick={() => onFinalDeleteClick(selectedResource._id)} className="p-1 bg-red-400 hover:bg-red-600">
                  Supprimer
                </button>
                <button onClick={() => setDeleteItemModal(false)} className="p-1 bg-orange-400 hover:bg-orange-600">
                  Annuler
                </button>
              </div>
            </div>
          )}
        </Modals>

        <Modals open={modifyItemModal} onClose={() => setModifyItemModal(false)}>
          {selectedModifyResource && (
            <div className="flex flex-col gap-2 min-w-80">
              <h1 className="text-2xl mt-2">Modifier une ressource</h1>
              <label htmlFor="quantity_resource">Quantité</label>
              <input
                type="number"
                name="quantity_resource"
                className="p-2 text-gray-900"
                onChange={handleModify}
                placeholder="100"
                value={selectedModifyResource.quantity_resource}
              />
              <label htmlFor="unit_price">Prix Unitaire</label>
              <input
                type="number"
                name="unit_price"
                className="p-2 text-gray-900"
                onChange={handleModify}
                placeholder="500"
                value={selectedModifyResource.unit_price}
              />
              <label htmlFor="name_resource">Nom de la Ressource</label>
              <input
                type="text"
                name="name_resource"
                className="p-2 text-gray-900"
                onChange={handleModify}
                placeholder="Eau"
                value={selectedModifyResource.name_resource}
              />
              <label htmlFor="supplier">Fournisseur</label>
              <select
                name="supplier"
                className="p-2 text-gray-900"
                onChange={handleModify}
                value={selectedModifyResource.supplier}
              >
                <option value="">Sélectionner un fournisseur</option>
                {supplierList.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name_supplier}
                  </option>
                ))}
              </select>
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
              <span className="p-1  hover:bg-green-600 cursor-pointer">
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
            <div className="flex flex-row justify-between w py-2 bg-gray-200 dark:bg-gray-700">
              <p className="w-1/4 justify-center flex"> Nom de la Ressource</p>
              <p className="w-1/4 justify-center flex">Quantité</p>
              <p className="hidden w-1/4 justify-center md:flex">Prix Unitaire</p>
              <p className="w-1/4 justify-center flex"> détail / supprimer</p>
            </div>
            <div className="flex px-8 md:px-0 flex-col overflow-y-scroll overflow-x-clip pb-3  hal  max-w-full">
              {filteredResources.map((resource) => (
                <div className="flex flex-row justify-between border-y-1 py-2" key={resource._id}>
                  <p className="w-1/4 justify-center flex">{resource.name_resource}</p>
                  <p className="w-1/4 justify-center flex">{resource.quantity_resource}</p>
                  <p className="hidden w-1/4 justify-center md:flex">{resource.unit_price}</p>
                  <div className="w-1/4 justify-center flex flew-row gap-4">
                    <div
                      className="p-1 hover:bg-orange-600 hover:cursor-pointer "
                      onClick={() => {
                        onResourceClick(resource);
                      }}
                    >
                      <FaEye />
                    </div>

                    <div
                      className="p-1 hover:bg-yellow-600 hover:cursor-pointer "
                      onClick={() => {
                        onModifyResource(resource);
                      }}
                    >
                      <HiPencil />
                    </div>

                    <div onClick={() => onDeleteClick(resource)} className="p-1 hover:cursor-pointer hover:bg-red-600 ">
                      <FaTrashAlt />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Resource>
  );
};
