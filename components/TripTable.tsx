import React, { useState } from 'react';
import type { Trip } from '../types';
import { ClipboardIcon, CheckIcon, WhatsAppIcon } from './icons';

interface TripTableProps {
  trips: Trip[];
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
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

export const TripTable: React.FC<TripTableProps> = ({ trips }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

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

  if (trips.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Nenhuma viagem registrada</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Adicione uma nova viagem no formulário acima.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <TripDetailsModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {trips.map((trip) => (
          <li
            key={trip.id}
            className="flex items-center justify-between px-4 py-3 sm:px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setSelectedTrip(trip)}
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-white text-base">{trip.driver}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{trip.vehicle} • {trip.destination}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(trip.departureTime).toLocaleDateString('pt-BR')} {new Date(trip.departureTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2 ml-2" onClick={e => e.stopPropagation()}>
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
          </li>
        ))}
      </ul>
    </div>
  );
};