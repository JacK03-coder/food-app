import { useEffect, useState } from 'react';

export default function useUserLocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setLocation({ latitude, longitude });
                    setError(null);
                },
                (err) => {
                    console.log('Error getting Location: ', err);
                    setError(err);
                }
            );
        } else {
            console.log('Geolocation not supported by this browser.');
            setError(new Error('Geolocation not supported'));
        }
    }, []);

    return { location, error };
}