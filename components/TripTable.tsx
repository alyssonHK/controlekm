import React, { useState, useEffect, useRef } from 'react';
import type { Trip } from '../types';
import { ClipboardIcon, CheckIcon, WhatsAppIcon, FilterIcon, ChecklistIcon, TrashIcon } from './icons';

interface TripTableProps {
  trips: Trip[];
  drivers: { id: string; name: string }[];
  vehicles: { id: string; name: string }[];
  plates: { id: string; number: string }[];
  onDeleteTrip: (tripId: string) => Promise<void>;
}

const TripDetailsModal: React.FC<{ trip: Trip | null; onClose: () => void }> = ({ trip, onClose }) => {
  if (!trip) return null;
  const departureDate = new Date(trip.departureTime);
  const formattedDate = departureDate.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Detalhes da Viagem</h3>
        <div className="space-y-2 text-gray-800 dark:text-gray-200">
          <div><strong>Motorista:</strong> {trip.driver}</div>
          <div><strong>Veículo:</strong> {trip.vehicle}</div>
          <div><strong>Placa:</strong> {trip.plate}</div>
          <div><strong>KM:</strong> {trip.km} KM</div>
          <div><strong>Origem:</strong> {trip.origin}</div>
          <div><strong>Destino:</strong> {trip.destination}</div>
          <div><strong>Data/Hora:</strong> {formattedDate}</div>
        </div>
        
        {trip.checklist && trip.checklist.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Checklist</h4>
            <div className="space-y-1">
              {trip.checklist.map((item) => (
                <div key={item.id} className="flex items-center">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    item.checked 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {item.checked && (
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <span className={`ml-2 text-sm ${
                    item.checked 
                      ? 'text-gray-500 dark:text-gray-400 line-through' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
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

export const TripTable: React.FC<TripTableProps> = ({ trips, drivers, vehicles, plates, onDeleteTrip }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedChecklistTrip, setSelectedChecklistTrip] = useState<Trip | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [showDeleteOption, setShowDeleteOption] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    driver: '',
    vehicle: '',
    plate: '',
    date: ''
  });
  
  const filterRef = useRef<HTMLDivElement>(null);

  // Fechar popup quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const formatTripText = (trip: Trip) => {
    const departureDate = new Date(trip.departureTime);
    const formattedDate = departureDate.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return `*Motorista:* ${trip.driver}\n*Veículo:* ${trip.vehicle}\n*Placa:* ${trip.plate}\n*Km:* ${trip.km} KM\n*Origem:* ${trip.origin}\n*Destino:* ${trip.destination}\n*Data e Hora da Saída:* ${formattedDate}`;
  }

  const handleCopy = (trip: Trip) => {
    const textToCopy = formatTripText(trip).replace(/\*/g, ''); // Remove bold markdown for plain text copy
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(trip.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleShareWhatsApp = (trip: Trip) => {
    const textToShare = formatTripText(trip);
    const encodedText = encodeURIComponent(textToShare);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleMouseDown = (tripId: string) => {
    const timer = setTimeout(() => {
      setShowDeleteOption(tripId);
    }, 500); // 500ms = 0.5 segundos
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleMouseLeave = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (confirm('Tem certeza que deseja excluir esta viagem?')) {
      await onDeleteTrip(tripId);
      setShowDeleteOption(null);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      driver: '',
      vehicle: '',
      plate: '',
      date: ''
    });
  };

  const filteredTrips = trips.filter(trip => {
    const driverMatch = !filters.driver || trip.driver === filters.driver;
    const vehicleMatch = !filters.vehicle || trip.vehicle === filters.vehicle;
    const plateMatch = !filters.plate || trip.plate === filters.plate;
    
    let dateMatch = true;
    if (filters.date) {
      const filterDate = new Date(filters.date);
      const tripDate = new Date(trip.departureTime);
      // Compara apenas a data (ano, mês, dia), ignorando hora
      dateMatch = filterDate.getFullYear() === tripDate.getFullYear() &&
                  filterDate.getMonth() === tripDate.getMonth() &&
                  filterDate.getDate() === tripDate.getDate();
    }

    return driverMatch && vehicleMatch && plateMatch && dateMatch;
  });

  const hasActiveFilters = filters.driver || filters.vehicle || filters.plate || filters.date;

  if (trips.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Nenhuma viagem registrada</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Adicione uma nova viagem no formulário acima.</p>
      </div>
    );
  }

  return (
    <>
      <TripDetailsModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      
      {/* Modal de Checklist */}
      {selectedChecklistTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-h-96 overflow-y-auto">
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Checklist - {selectedChecklistTrip.driver}
              </h4>
              
              {selectedChecklistTrip.checklist && selectedChecklistTrip.checklist.length > 0 ? (
                <div className="space-y-3">
                  {selectedChecklistTrip.checklist.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        item.checked 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {item.checked && (
                          <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <span className={`ml-2 text-sm ${
                        item.checked 
                          ? 'text-gray-500 dark:text-gray-400 line-through' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum checklist foi preenchido para esta viagem.
                  </p>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedChecklistTrip(null)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header com filtro */}
        <div className="px-4 py-3 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Viagens {hasActiveFilters && `(${filteredTrips.length} de ${trips.length})`}
          </h3>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-md transition-colors ${
                hasActiveFilters 
                  ? 'text-primary-600 bg-primary-100 dark:bg-primary-900 dark:text-primary-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              aria-label="Filtrar viagens"
            >
              <FilterIcon className="w-5 h-5" />
            </button>
            

          </div>
        </div>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTrips.map((trip) => (
          <li
            key={trip.id}
            className={`flex items-center justify-between px-4 py-3 sm:px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative ${
              showDeleteOption === trip.id ? 'bg-red-50 dark:bg-red-900/20' : ''
            }`}
            onClick={() => setSelectedTrip(trip)}
            onMouseDown={() => handleMouseDown(trip.id)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleMouseDown(trip.id)}
            onTouchEnd={handleMouseUp}
          >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white text-base">{trip.driver}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{trip.vehicle} • {trip.destination}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(trip.departureTime).toLocaleDateString('pt-BR')} {new Date(trip.departureTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
                          {showDeleteOption === trip.id ? (
              <div className="flex items-center gap-2 ml-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="font-medium rounded-md p-2 transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                  aria-label="Excluir viagem"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteOption(null)}
                  className="font-medium rounded-md p-2 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Cancelar exclusão"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2" onClick={e => e.stopPropagation()}>
                {trip.checklist && trip.checklist.length > 0 && (
                  <button
                    onClick={() => setSelectedChecklistTrip(trip)}
                    className="font-medium rounded-md p-2 transition-all duration-200 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-gray-700"
                    aria-label="Ver checklist da viagem"
                  >
                    <ChecklistIcon className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleCopy(trip)}
                  className={`font-medium rounded-md p-2 transition-all duration-200 ${
                    copiedId === trip.id
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                      : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-gray-700'
                  }`}
                  aria-label="Copiar dados da viagem"
                >
                  {copiedId === trip.id ? (
                    <span className="flex items-center gap-1">
                      <CheckIcon className="w-5 h-5" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ClipboardIcon className="w-5 h-5" />
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleShareWhatsApp(trip)}
                  className="font-medium rounded-md p-2 transition-all duration-200 text-[#25D366] hover:bg-green-100 dark:hover:bg-gray-700"
                  aria-label="Compartilhar no WhatsApp"
                >
                  <span className="flex items-center gap-1">
                    <WhatsAppIcon className="w-7 h-7" />
                  </span>
                </button>
              </div>
            )}
            </li>
          ))}
        </ul>
        
        {filteredTrips.length === 0 && trips.length > 0 && (
          <div className="text-center py-8 px-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma viagem encontrada com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Popup de filtro - fora do container para não ser cortado */}
      {isFilterOpen && (
        <div ref={filterRef} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-h-96 overflow-y-auto">
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Filtrar Viagens</h4>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="filter-driver" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Motorista
                  </label>
                  <select
                    id="filter-driver"
                    value={filters.driver}
                    onChange={(e) => handleFilterChange('driver', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Todos os motoristas</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.name}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="filter-vehicle" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Veículo
                  </label>
                  <select
                    id="filter-vehicle"
                    value={filters.vehicle}
                    onChange={(e) => handleFilterChange('vehicle', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Todos os veículos</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.name}>
                        {vehicle.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="filter-plate" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Placa
                  </label>
                  <select
                    id="filter-plate"
                    value={filters.plate}
                    onChange={(e) => handleFilterChange('plate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Todas as placas</option>
                    {plates.map(plate => (
                      <option key={plate.id} value={plate.number}>
                        {plate.number}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="filter-date" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data
                  </label>
                  <input
                    type="datetime-local"
                    id="filter-date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:[color-scheme:light]"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};