'use client';

/**
 * PropertyMap — Leaflet map for the Linked Properties page.
 *
 * Loaded via Next.js dynamic() with ssr: false to avoid window errors.
 *
 * Behavior:
 *   - Default: centers on Sta. Rita, Samar at zoom 13
 *   - When `properties` are provided: shows markers for all of them
 *     and fits the viewport to their bounds
 *   - When `focusedId` is set: flies to that property at zoom 17
 *   - When `focusedId` is cleared: flies back to fit all markers
 *     (or default center if no markers)
 */

import { useEffect, useRef, useState } from 'react';
import { MapPinned } from 'lucide-react';

// Approximate centroid of Sta. Rita, Samar
const STA_RITA_CENTER: [number, number] = [11.4833, 125.0];
const DEFAULT_ZOOM = 13;
const FOCUS_ZOOM = 17;

export type MapProperty = {
  id: number;
  pin: string;
  tdNumber: string;
  lat: number;
  lng: number;
  ownerName?: string;
};

type Props = {
  properties: MapProperty[];
  focusedId: number | null;
};

export default function PropertyMap({ properties, focusedId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  // ── 1. Mount Leaflet once ────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    // Inject Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    import('leaflet').then((mod) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const L = mod.default ?? mod;
      LRef.current = L;

      // Fix Webpack asset URL for default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current!, {
        center: STA_RITA_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      LRef.current = null;
      document.head.removeChild(link);
    };
  }, []);

  // ── 2. Sync markers whenever properties list changes ─────────────────────
  useEffect(() => {
    if (!mapReady || !LRef.current || !mapRef.current) return;

    const L = LRef.current;
    const map = mapRef.current;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    if (properties.length === 0) {
      map.flyTo(STA_RITA_CENTER, DEFAULT_ZOOM, { duration: 1 });
      return;
    }

    // Add new markers
    properties.forEach((p) => {
      const marker = L.marker([p.lat, p.lng])
        .bindPopup(
          `<div style="font-family:sans-serif;font-size:12px;min-width:140px">
            <b style="font-size:13px">${p.pin}</b><br/>
            TD: ${p.tdNumber}
            ${p.ownerName ? `<br/><span style="color:#475569">${p.ownerName}</span>` : ''}
          </div>`,
        )
        .addTo(map);
      markersRef.current.set(p.id, marker);
    });

    // If no property is focused, fit bounds to all markers
    if (focusedId === null) {
      const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng]));
      map.flyToBounds(bounds, { padding: [48, 48], duration: 1 });
    }
  }, [mapReady, properties]);

  // ── 3. Handle focusedId changes ──────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current || !LRef.current) return;

    const L = LRef.current;
    const map = mapRef.current;

    if (focusedId !== null) {
      const prop = properties.find((p) => p.id === focusedId);
      if (prop) {
        map.flyTo([prop.lat, prop.lng], FOCUS_ZOOM, { duration: 1.2 });
        // Open popup after fly animation
        setTimeout(() => {
          markersRef.current.get(focusedId)?.openPopup();
        }, 1300);
      }
    } else {
      // Zoom back out
      if (properties.length > 0) {
        const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng]));
        map.flyToBounds(bounds, { padding: [48, 48], duration: 1.2 });
      } else {
        map.flyTo(STA_RITA_CENTER, DEFAULT_ZOOM, { duration: 1 });
      }
    }
  }, [mapReady, focusedId]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full rounded-sm" />

      {/* Placeholder shown before Leaflet boots */}
      {!mapReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-50">
          <MapPinned className="h-8 w-8 animate-pulse text-slate-300" />
          <p className="font-inter text-xs text-slate-400">Loading map…</p>
        </div>
      )}
    </div>
  );
}
