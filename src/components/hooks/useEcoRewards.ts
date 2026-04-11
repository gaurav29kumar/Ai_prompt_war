import { useState } from 'react';
import { useVenueStore } from '../../store/useVenueStore';

export const useEcoRewards = () => {
  const { reportEWaste } = useVenueStore();
  const [logged, setLogged] = useState(false);

  const handleRecycle = () => {
    reportEWaste(2.5); // Randomly logged a 2.5kg deposit (e.g., an old laptop or tablet)
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  return { logged, handleRecycle };
};
