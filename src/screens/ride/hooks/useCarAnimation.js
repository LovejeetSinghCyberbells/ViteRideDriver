import { useEffect, useState, useRef } from 'react';
import { Animated, Easing } from 'react-native';


const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getPointAlongRoute = (coordinates, t) => {
  if (!coordinates || coordinates.length < 2) return coordinates?.[0] ?? null;
  const clamped = Math.max(0, Math.min(1, t));

  const segDistances = [];
  let total = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[i + 1];
    const d = haversineKm(lat1, lon1, lat2, lon2);
    segDistances.push(d);
    total += d;
  }
  if (total === 0) return coordinates[0];

  const target = clamped * total;
  let covered = 0;
  for (let i = 0; i < segDistances.length; i++) {
    const d = segDistances[i];
    if (covered + d >= target || i === segDistances.length - 1) {
      const segT = d === 0 ? 0 : Math.min(1, (target - covered) / d);
      const [lon1, lat1] = coordinates[i];
      const [lon2, lat2] = coordinates[i + 1];
      return [lon1 + (lon2 - lon1) * segT, lat1 + (lat2 - lat1) * segT];
    }
    covered += d;
  }
  return coordinates[coordinates.length - 1];
};

const getBearing = (from, to) => {
  if (!from || !to) return 0;
  const [lon1, lat1] = from;
  const [lon2, lat2] = to;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1R = (lat1 * Math.PI) / 180;
  const lat2R = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2R);
  const x =
    Math.cos(lat1R) * Math.sin(lat2R) -
    Math.sin(lat1R) * Math.cos(lat2R) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 90) / Math.PI + 360) % 360;
};

export const useCarAnimation = (coordinates, onComplete, duration) => {
  const RIDE_DURATION_MS = (duration / 1.5) * 60 * 1000;
  const MIN_DURATION_MS = (duration / 2) * 60 * 1000;
  const MAX_DURATION_MS = (duration * 1.5) * 60 * 1000;

  const progress = useRef(new Animated.Value(0)).current;
  const listenerRef = useRef(null);
  const animRef = useRef(null);
  const lastPosRef = useRef(null);

  const [carPosition, setCarPosition] = useState(coordinates?.[0] ?? null);
  const [carBearing, setCarBearing] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!coordinates || coordinates.length < 2) return;

    progress.setValue(0);
    setCarPosition(coordinates[0]);
    lastPosRef.current = coordinates[0];

    listenerRef.current = progress.addListener(({ value }) => {
      const pos = getPointAlongRoute(coordinates, value);
      if (!pos) return;
      const bearing = getBearing(lastPosRef.current, pos);
      setCarPosition(pos);
      setCarBearing(bearing);
      setProgressPct(Math.round(value * 100));
      lastPosRef.current = pos;
    });

    const duration = Math.max(
      MIN_DURATION_MS,
      Math.min(MAX_DURATION_MS, RIDE_DURATION_MS),
    );

    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });

    animRef.current.start(({ finished }) => {
      if (finished) {
        setCarPosition(coordinates[coordinates.length - 1]);
        setProgressPct(100);
        setIsFinished(true);
        onComplete?.();
      }
    });

    return () => {
      animRef.current?.stop();
      if (listenerRef.current) {
        progress.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, [coordinates, onComplete]);

  const elapsed = (progressPct / 100) * RIDE_DURATION_MS;
  const remaining = Math.max(0, RIDE_DURATION_MS - elapsed);
  const etaMinutes = Math.max(1, Math.ceil(remaining / 60000));

  return { carPosition, carBearing, progressPct, etaMinutes, isFinished };
};