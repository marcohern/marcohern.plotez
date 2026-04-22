import React, { useEffect, useRef, useState } from 'react';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function loadGoogleMaps() {
    return new Promise((resolve, reject) => {
        if (window.google?.maps) { resolve(window.google.maps); return; }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=drawing,geometry`;
        script.async = true;
        script.onload = () => resolve(window.google.maps);
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
    });
}

function sqmToHectares(sqm) {
    return sqm / 10000;
}

export default function PlotMap({ initialCoordinates = null, onChange, readOnly = false }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const polygonRef = useRef(null);
    const drawingManagerRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadGoogleMaps()
            .then(() => setLoaded(true))
            .catch(err => setError(err.message));
    }, []);

    useEffect(() => {
        if (!loaded || !mapRef.current) return;

        const google = window.google;
        const defaultCenter = { lat: 4.710989, lng: -74.072090 }; // Bogota, Colombia
        const center = initialCoordinates?.length
            ? initialCoordinates.reduce(
                (acc, p) => ({ lat: acc.lat + p.lat / initialCoordinates.length, lng: acc.lng + p.lng / initialCoordinates.length }),
                { lat: 0, lng: 0 }
              )
            : defaultCenter;

        const map = new google.maps.Map(mapRef.current, {
            center,
            zoom: initialCoordinates?.length ? 15 : 6,
            mapTypeId: 'satellite',
        });
        mapInstanceRef.current = map;

        if (initialCoordinates?.length >= 3) {
            const polygon = new google.maps.Polygon({
                paths: initialCoordinates,
                strokeColor: '#22c55e',
                strokeOpacity: 0.9,
                strokeWeight: 2,
                fillColor: '#22c55e',
                fillOpacity: 0.25,
                editable: !readOnly,
                draggable: !readOnly,
                map,
            });
            polygonRef.current = polygon;

            if (!readOnly) {
                attachPolygonListeners(polygon, google);
            }
        }

        if (!readOnly) {
            const dm = new google.maps.drawing.DrawingManager({
                drawingMode: initialCoordinates?.length ? null : google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                },
                polygonOptions: {
                    strokeColor: '#22c55e',
                    strokeOpacity: 0.9,
                    strokeWeight: 2,
                    fillColor: '#22c55e',
                    fillOpacity: 0.25,
                    editable: true,
                    draggable: true,
                },
            });
            dm.setMap(map);
            drawingManagerRef.current = dm;

            google.maps.event.addListener(dm, 'polygoncomplete', polygon => {
                if (polygonRef.current) {
                    polygonRef.current.setMap(null);
                }
                polygonRef.current = polygon;
                dm.setDrawingMode(null);
                attachPolygonListeners(polygon, google);
                emitChange(polygon, google);
            });
        }

        return () => {
            polygonRef.current?.setMap(null);
            drawingManagerRef.current?.setMap(null);
        };
    }, [loaded]);

    function attachPolygonListeners(polygon, google) {
        const update = () => emitChange(polygon, google);
        const path = polygon.getPath();
        path.addListener('insert_at', update);
        path.addListener('remove_at', update);
        path.addListener('set_at', update);
        google.maps.event.addListener(polygon, 'dragend', update);
    }

    function emitChange(polygon, google) {
        const path = polygon.getPath();
        if (path.getLength() < 3) {
            onChange && onChange({ coordinates: null, area_sqm: 0, hectares: 0 });
            return;
        }
        const coords = [];
        for (let i = 0; i < path.getLength(); i++) {
            const ll = path.getAt(i);
            coords.push({ lat: ll.lat(), lng: ll.lng() });
        }
        const areaSqm = google.maps.geometry.spherical.computeArea(path);
        onChange && onChange({
            coordinates: coords,
            area_sqm: areaSqm,
            hectares: sqmToHectares(areaSqm),
        });
    }

    if (error) return (
        <div className="border rounded bg-red-50 text-red-700 p-4 text-sm">
            {error}. Make sure VITE_GOOGLE_MAPS_API_KEY is set in .env.
        </div>
    );

    return (
        <div className="relative">
            <div ref={mapRef} style={{ width: '100%', height: '450px' }} className="rounded border border-gray-300" />
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                    <span className="text-gray-500 text-sm">Loading map…</span>
                </div>
            )}
        </div>
    );
}
