import React, { useState, useCallback, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { TripForm } from './components/TripForm';
import { TripTable } from './components/TripTable';
import type { Trip, Driver, Vehicle, Plate } from './types';
import { db } from './firebase';

function App() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const driversQuery = query(collection(db, 'drivers'), orderBy('name'));
    const unsubscribeDrivers = onSnapshot(driversQuery, (querySnapshot) => {
      const driversData: Driver[] = [];
      querySnapshot.forEach((doc) => {
        driversData.push({ id: doc.id, name: doc.data().name as string });
      });
      setDrivers(driversData);
    });

    const vehiclesQuery = query(collection(db, 'vehicles'), orderBy('name'));
    const unsubscribeVehicles = onSnapshot(vehiclesQuery, (querySnapshot) => {
      const vehiclesData: Vehicle[] = [];
      querySnapshot.forEach((doc) => {
        vehiclesData.push({ id: doc.id, name: doc.data().name as string });
      });
      setVehicles(vehiclesData);
    });

    const platesQuery = query(collection(db, 'plates'), orderBy('number'));
    const unsubscribePlates = onSnapshot(platesQuery, (querySnapshot) => {
      const platesData: Plate[] = [];
      querySnapshot.forEach((doc) => {
        platesData.push({ id: doc.id, number: doc.data().number as string });
      });
      setPlates(platesData);
    });

    const tripsQuery = query(collection(db, 'trips'), orderBy('departureTime', 'desc'));
    const unsubscribeTrips = onSnapshot(tripsQuery, (querySnapshot) => {
      const tripsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const departureTime = data.departureTime as Timestamp;
        // Convert Firestore Timestamp to ISO string to prevent circular reference errors in React state.
        const departureTimeISO = (departureTime && typeof departureTime.toDate === 'function')
            ? departureTime.toDate().toISOString()
            : String(new Date()); // Fallback to string conversion of current date

        // Explicitly map properties to avoid circular structure errors from Firestore objects.
        const trip = {
          id: doc.id,
          driver: data.driver || '',
          vehicle: data.vehicle || '',
          plate: data.plate || '',
          km: data.km || 0,
          origin: data.origin || '',
          destination: data.destination || '',
          departureTime: departureTimeISO,
          checklist: data.checklist || [],
        } as Trip;
        
        if (trip.checklist && trip.checklist.length > 0) {
          console.log('Trip with checklist loaded:', trip.id, trip.checklist);
        }
        
        return trip;
      });
      setTrips(tripsData);
    });

    return () => {
      unsubscribeDrivers();
      unsubscribeVehicles();
      unsubscribePlates();
      unsubscribeTrips();
    };
  }, []);

  const handleAddTrip = useCallback(async (tripData: Omit<Trip, 'id'>) => {
    try {
      console.log('Saving trip with checklist:', tripData);
      await addDoc(collection(db, 'trips'), {
        ...tripData,
        departureTime: new Date(tripData.departureTime),
      });
    } catch (e) {
      console.error("Error adding trip: ", e);
      alert('Falha ao adicionar viagem.');
    }
  }, []);

  const handleDeleteTrip = useCallback(async (tripId: string) => {
    try {
      await deleteDoc(doc(db, 'trips', tripId));
    } catch (e) {
      console.error("Error deleting trip: ", e);
      alert('Falha ao excluir viagem.');
    }
  }, []);

  const handleAddDriver = useCallback(async (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName && !drivers.find(d => d.name.toLowerCase() === trimmedName.toLowerCase())) {
      try {
        await addDoc(collection(db, 'drivers'), { name: trimmedName });
        return true;
      } catch (e) {
        console.error("Error adding driver: ", e);
        alert('Falha ao adicionar motorista.');
        return false;
      }
    }
    alert('Motorista já existe ou o nome é inválido.');
    return false;
  }, [drivers]);

  const handleRemoveDriver = useCallback(async (id: string) => {
    if (drivers.length <= 1) {
      alert("É necessário ter pelo menos um motorista.");
      return;
    }
    try {
      await deleteDoc(doc(db, 'drivers', id));
    } catch (e) {
      console.error("Error removing driver: ", e);
      alert('Falha ao remover motorista.');
    }
  }, [drivers.length]);

  const handleAddVehicle = useCallback(async (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName && !vehicles.find(v => v.name.toLowerCase() === trimmedName.toLowerCase())) {
      try {
        await addDoc(collection(db, 'vehicles'), { name: trimmedName });
        return true;
      } catch (e) {
        console.error("Error adding vehicle: ", e);
        alert('Falha ao adicionar veículo.');
        return false;
      }
    }
    alert('Veículo já existe ou o nome é inválido.');
    return false;
  }, [vehicles]);

  const handleRemoveVehicle = useCallback(async (id: string) => {
    if (vehicles.length <= 1) {
      alert("É necessário ter pelo menos um veículo.");
      return;
    }
    try {
      await deleteDoc(doc(db, 'vehicles', id));
    } catch (e) {
      console.error("Error removing vehicle: ", e);
      alert('Falha ao remover veículo.');
    }
  }, [vehicles.length]);

  const handleAddPlate = useCallback(async (number: string) => {
    const trimmedNumber = number.trim();
    if (trimmedNumber && !plates.find(p => p.number.toLowerCase() === trimmedNumber.toLowerCase())) {
      try {
        await addDoc(collection(db, 'plates'), { number: trimmedNumber });
        return true;
      } catch (e) {
        console.error("Error adding plate: ", e);
        alert('Falha ao adicionar placa.');
        return false;
      }
    }
    alert('Placa já existe ou o número é inválido.');
    return false;
  }, [plates]);

  const handleRemovePlate = useCallback(async (id: string) => {
    if (plates.length <= 1) {
      alert("É necessário ter pelo menos uma placa.");
      return;
    }
    try {
      await deleteDoc(doc(db, 'plates', id));
    } catch (e) {
      console.error("Error removing plate: ", e);
      alert('Falha ao remover placa.');
    }
  }, [plates.length]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          Controle de Viagens Kalfritec
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Gerencie os registros de viagens por KM.
        </p>
      </header>
      
      <main>
        <TripForm 
          drivers={drivers}
          vehicles={vehicles}
          plates={plates}
          onAddTrip={handleAddTrip}
          onAddDriver={handleAddDriver}
          onRemoveDriver={handleRemoveDriver}
          onAddVehicle={handleAddVehicle}
          onRemoveVehicle={handleRemoveVehicle}
          onAddPlate={handleAddPlate}
          onRemovePlate={handleRemovePlate}
        />
        <TripTable trips={trips} drivers={drivers} vehicles={vehicles} plates={plates} onDeleteTrip={handleDeleteTrip} />
      </main>

      <footer className="text-center mt-12 py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Desenvolvido por Alysson Krombauer
        </p>
      </footer>
    </div>
  );
}

export default App;
