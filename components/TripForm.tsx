import React, { useState, useEffect } from 'react';
import type { Trip, Driver, Vehicle, Plate, ChecklistItem } from '../types';
import { PlusIcon, TrashIcon, ChecklistIcon, PencilIcon } from './icons';

// Função utilitária para formatar placas
const formatPlate = (value: string): string => {
  const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  let formattedValue = cleanedValue.slice(0, 7);
  if (formattedValue.length > 3) {
    formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3)}`;
  }
  return formattedValue;
};

const AddDriverModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddDriver: (name: string) => Promise<boolean>;
  drivers: Driver[];
  onRemoveDriver: (id: string) => void;
}> = ({ isOpen, onClose, onAddDriver, drivers, onRemoveDriver }) => {
  const [newDriverName, setNewDriverName] = useState('');

  const handleAdd = async () => {
    if (newDriverName.trim()) {
      const success = await onAddDriver(newDriverName.trim());
      if (success) {
        setNewDriverName('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Gerenciar Motoristas</h3>
        
        {/* Lista de motoristas existentes */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Motoristas Cadastrados</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {drivers.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum motorista cadastrado</p>
            ) : (
              drivers.map(driver => (
                <div key={driver.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-sm text-gray-900 dark:text-white">{driver.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveDriver(driver.id)}
                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Remover motorista"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Adicionar novo motorista */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adicionar Novo Motorista</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDriverName}
              onChange={(e) => setNewDriverName(e.target.value)}
              placeholder="Nome completo"
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newDriverName.trim()}
              className="px-3 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const AddVehicleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (name: string) => Promise<boolean>;
  vehicles: Vehicle[];
  onRemoveVehicle: (id: string) => void;
}> = ({ isOpen, onClose, onAddVehicle, vehicles, onRemoveVehicle }) => {
  const [newVehicleName, setNewVehicleName] = useState('');

  const handleAdd = async () => {
    if (newVehicleName.trim()) {
      const success = await onAddVehicle(newVehicleName.trim());
      if (success) {
        setNewVehicleName('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Gerenciar Veículos</h3>
        
        {/* Lista de veículos existentes */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Veículos Cadastrados</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {vehicles.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum veículo cadastrado</p>
            ) : (
              vehicles.map(vehicle => (
                <div key={vehicle.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-sm text-gray-900 dark:text-white">{vehicle.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveVehicle(vehicle.id)}
                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Remover veículo"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Adicionar novo veículo */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adicionar Novo Veículo</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newVehicleName}
              onChange={(e) => setNewVehicleName(e.target.value)}
              placeholder="Nome do veículo"
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newVehicleName.trim()}
              className="px-3 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const AddPlateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddPlate: (number: string) => Promise<boolean>;
  plates: Plate[];
  onRemovePlate: (id: string) => void;
}> = ({ isOpen, onClose, onAddPlate, plates, onRemovePlate }) => {
  const [newPlateNumber, setNewPlateNumber] = useState('');

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPlateNumber(formatPlate(value));
  };

  const handleAdd = async () => {
    const cleanedPlate = newPlateNumber.replace(/[^a-zA-Z0-9]/g, '');
    if (cleanedPlate.length === 7) {
      const success = await onAddPlate(newPlateNumber.trim());
      if (success) {
        setNewPlateNumber('');
      }
    } else {
      alert('A placa deve ter exatamente 7 caracteres (3 letras + 4 números).');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Gerenciar Placas</h3>
        
        {/* Lista de placas existentes */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Placas Cadastradas</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {plates.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma placa cadastrada</p>
            ) : (
              plates.map(plate => (
                <div key={plate.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-sm text-gray-900 dark:text-white">{plate.number}</span>
                  <button
                    type="button"
                    onClick={() => onRemovePlate(plate.id)}
                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Remover placa"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Adicionar nova placa */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adicionar Nova Placa</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlateNumber}
              onChange={handlePlateChange}
              placeholder="ABC-1234 (7 caracteres)"
              maxLength={8}
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={newPlateNumber.replace(/[^a-zA-Z0-9]/g, '').length !== 7}
              className="px-3 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};


interface TripFormProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  plates: Plate[];
  onAddTrip: (trip: Omit<Trip, 'id'>) => void;
  onAddDriver: (name: string) => Promise<boolean>;
  onRemoveDriver: (id: string) => void;
  onAddVehicle: (name: string) => Promise<boolean>;
  onRemoveVehicle: (id: string) => void;
  onAddPlate: (number: string) => Promise<boolean>;
  onRemovePlate: (id: string) => void;
}

export const TripForm: React.FC<TripFormProps> = ({ 
  drivers, 
  vehicles, 
  plates, 
  onAddTrip, 
  onAddDriver, 
  onRemoveDriver, 
  onAddVehicle, 
  onRemoveVehicle, 
  onAddPlate, 
  onRemovePlate 
}) => {
  const getInitialDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    driver: '',
    vehicle: '',
    plate: '',
    km: '',
    origin: '',
    destination: '',
    departureTime: getInitialDateTime(),
  });

  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isPlateModalOpen, setIsPlateModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isEditingChecklist, setIsEditingChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Verificar combustível', checked: false },
    { id: '2', text: 'Verificar pneus', checked: false },
    { id: '3', text: 'Verificar óleo', checked: false },
    { id: '4', text: 'Documentos do veículo', checked: false },
    { id: '5', text: 'CNH do motorista', checked: false },
    { id: '6', text: 'Rota planejada', checked: false },
    { id: '7', text: 'Meios de comunicação', checked: false },
  ]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    const driverExists = drivers.some(d => d.name === formData.driver);
    if ((!driverExists || !formData.driver) && drivers.length > 0) {
      setFormData(prev => ({ ...prev, driver: drivers[0].name }));
    } else if (drivers.length === 0) {
        setFormData(prev => ({...prev, driver: ''}));
    }
  }, [drivers, formData.driver]);

  useEffect(() => {
    const vehicleExists = vehicles.some(v => v.name === formData.vehicle);
    if ((!vehicleExists || !formData.vehicle) && vehicles.length > 0) {
      setFormData(prev => ({ ...prev, vehicle: vehicles[0].name }));
    } else if (vehicles.length === 0) {
        setFormData(prev => ({...prev, vehicle: ''}));
    }
  }, [vehicles, formData.vehicle]);

  useEffect(() => {
    const plateExists = plates.some(p => p.number === formData.plate);
    if ((!plateExists || !formData.plate) && plates.length > 0) {
      setFormData(prev => ({ ...prev, plate: plates[0].number }));
    } else if (plates.length === 0) {
        setFormData(prev => ({...prev, plate: ''}));
    }
  }, [plates, formData.plate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'km') {
        setFormData(prev => ({ ...prev, km: value.replace(/\D/g, '') }));
    } else if (name === 'plate') {
        setFormData(prev => ({ ...prev, plate: formatPlate(value) }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  


  const handleChecklistChange = (id: string, checked: boolean) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        checked: false
      };
      setChecklistItems(prev => [...prev, newItem]);
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (id: string) => {
    setChecklistItems(prev => prev.filter(item => item.id !== id));
  };

  const markAllChecklist = () => {
    setChecklistItems(prev => prev.map(item => ({ ...item, checked: true })));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.driver) {
      alert("Por favor, selecione um motorista. Se não houver nenhum, adicione um primeiro.");
      return;
    }
    if (!formData.vehicle) {
      alert("Por favor, selecione um veículo. Se não houver nenhum, adicione um primeiro.");
      return;
    }
    if (!formData.plate) {
      alert("Por favor, selecione uma placa. Se não houver nenhuma, adicione uma primeiro.");
      return;
    }
    onAddTrip({
      ...formData,
      km: Number(formData.km),
      checklist: checklistItems,
    });
    setFormData(prev => ({
      ...prev,
      vehicle: '',
      plate: '',
      km: '',
      origin: '',
      destination: '',
      departureTime: getInitialDateTime(),
    }));
    // Reset checklist
    setChecklistItems(prev => prev.map(item => ({ ...item, checked: false })));
  };

  return (
    <>
      <AddDriverModal 
        isOpen={isDriverModalOpen} 
        onClose={() => setIsDriverModalOpen(false)} 
        onAddDriver={onAddDriver}
        drivers={drivers}
        onRemoveDriver={onRemoveDriver}
      />
      <AddVehicleModal 
        isOpen={isVehicleModalOpen} 
        onClose={() => setIsVehicleModalOpen(false)} 
        onAddVehicle={onAddVehicle}
        vehicles={vehicles}
        onRemoveVehicle={onRemoveVehicle}
      />
      <AddPlateModal 
        isOpen={isPlateModalOpen} 
        onClose={() => setIsPlateModalOpen(false)} 
        onAddPlate={onAddPlate}
        plates={plates}
        onRemovePlate={onRemovePlate}
      />
      
      {/* Modal de Checklist */}
      {isChecklistModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Checklist de Viagem</h4>
                <button
                  onClick={() => setIsEditingChecklist(!isEditingChecklist)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Editar checklist"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
              
              {isEditingChecklist && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      placeholder="Adicionar novo item..."
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                    />
                    <button
                      onClick={addChecklistItem}
                      className="px-2 py-1 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`checklist-${item.id}`}
                        checked={item.checked}
                        onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor={`checklist-${item.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {item.text}
                      </label>
                    </div>
                    {isEditingChecklist && (
                      <button
                        onClick={() => removeChecklistItem(item.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remover item"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setIsChecklistModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setIsChecklistModalOpen(false);
                    // O checklist será salvo automaticamente quando a viagem for adicionada
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Salvar Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        {/* <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Registrar Nova Viagem</h2> */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label htmlFor="driver" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Motorista</label>
              <div className="flex items-center gap-2">
                  <select id="driver" name="driver" value={formData.driver} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                      {drivers.length === 0 && <option value="" disabled>Adicione um motorista...</option>}
                      {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                  <button type="button" onClick={() => setIsDriverModalOpen(true)} className="p-2.5 text-primary-600 bg-primary-100 dark:bg-primary-900 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors flex-shrink-0" aria-label="Gerenciar motoristas">
                      <PlusIcon className="w-5 h-5"/>
                  </button>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vehicle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Veículo</label>
                <div className="flex items-center gap-2">
                    <select id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                        {vehicles.length === 0 && <option value="" disabled>Adicione um veículo...</option>}
                        {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                    <button type="button" onClick={() => setIsVehicleModalOpen(true)} className="p-2.5 text-primary-600 bg-primary-100 dark:bg-primary-900 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors flex-shrink-0" aria-label="Gerenciar veículos">
                        <PlusIcon className="w-5 h-5"/>
                    </button>
                </div>
              </div>
              <div>
                <label htmlFor="plate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Placa</label>
                <div className="flex items-center gap-2">
                    <select id="plate" name="plate" value={formData.plate} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                        {plates.length === 0 && <option value="" disabled>Adicione uma placa...</option>}
                        {plates.map(p => <option key={p.id} value={p.number}>{p.number}</option>)}
                    </select>
                    <button type="button" onClick={() => setIsPlateModalOpen(true)} className="p-2.5 text-primary-600 bg-primary-100 dark:bg-primary-900 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors flex-shrink-0" aria-label="Gerenciar placas">
                        <PlusIcon className="w-5 h-5"/>
                    </button>
                </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="km" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">KM</label>
                <div className="relative">
                  <input type="text" pattern="\d*" id="km" name="km" value={formData.km} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">KM</span>
                </div>
              </div>
              <div>
                <label htmlFor="departureTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Hora da Saída</label>
                <input type="datetime-local" id="departureTime" name="departureTime" value={formData.departureTime} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:[color-scheme:light]" required />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="origin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Origem</label>
                <input type="text" id="origin" name="origin" value={formData.origin} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="destination" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Destino</label>
                <input type="text" id="destination" name="destination" value={formData.destination} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
              </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-colors">
              Adicionar Viagem
            </button>
            <button 
              type="button" 
              onClick={() => setIsChecklistModalOpen(true)}
              className="p-2.5 text-primary-600 bg-primary-100 dark:bg-primary-900 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors flex-shrink-0" 
              aria-label="Abrir checklist"
            >
              <ChecklistIcon className="w-5 h-5"/>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};