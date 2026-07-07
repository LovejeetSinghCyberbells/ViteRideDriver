import React, { useMemo } from 'react';
import {
  GeoJSONSource as ShapeSource,
  Layer,
} from '@maplibre/maplibre-react-native';

const CarAnimatedMarker = ({ position, bearing }) => {
  const geoJson = useMemo(() => {
    if (!position) return null;
    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: position },
      properties: {},
    };
  }, [position]);

  if (!geoJson) return null;

  return (
    <>
      <ShapeSource id="carGlowSource" data={geoJson}>
        <Layer
          type="circle"
          id="carGlowLayer"
          style={{
            circleRadius: 30,
            circleColor: 'rgba(37,99,235,0.15)',
            circleStrokeWidth: 2,
            circleStrokeColor: 'rgba(37,99,235,0.3)',
            circlePitchAlignment: 'map',
          }}
        />
      </ShapeSource>

      {/* Car icon */}
      <ShapeSource id="carMarkerSource" data={geoJson}>
        <Layer
          type="symbol"
          id="carMarkerLayer"
          style={{
            iconImage: require('../../../assets/images/car_marker.png'),
            iconSize: 0.08,
            iconRotate: bearing,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            symbolZOrder: 'auto',
          }}
        />
      </ShapeSource>
    </>
  );
};

export default CarAnimatedMarker;