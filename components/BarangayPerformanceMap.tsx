'use client';

import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet';

type BarangayPerformance = {
  name: string;
  coordinates: [number, number];
  collectionRate: number;
  assessedAmount: number;
  collectedAmount: number;  
};

const CENTER: [number, number] = [11.4525, 124.9450];

const STA_RITA_BARANGAY_COORDINATES: Array<{ name: string; coordinates: [number, number] }> = [
  { name: 'Alegria', coordinates: [11.3753963, 124.9942696] },
  { name: 'Anibongan', coordinates: [11.4691187, 124.9963205] },
  { name: 'Aslum', coordinates: [11.4337161, 124.9962983] },
  { name: 'Bagolibas', coordinates: [11.3942155, 125.0012056] },
  { name: 'Binanalan', coordinates: [11.4939885, 125.0273470] },
  { name: 'Cabacungan', coordinates: [11.3842767, 125.0076798] },
  { name: 'Cabunga-an', coordinates: [11.4691011, 124.8831102] },
  { name: 'Camayse', coordinates: [11.4692933, 125.0074848] },
  { name: 'Cansadong', coordinates: [11.4935259, 124.9049655] },
  { name: 'Caticugan', coordinates: [11.3324706, 125.0136457] },
  { name: 'Dampigan', coordinates: [11.3321189, 124.9903609] },
  { name: 'Guinbalot-an', coordinates: [11.4333593, 124.9778961] },
  { name: 'Hinangudtan', coordinates: [11.4674838, 124.9162914] },
  { name: 'Igang-igang', coordinates: [11.4651019, 124.8622936] },
  { name: 'La Paz', coordinates: [11.3988559, 124.9877928] },
  { name: 'Lupig', coordinates: [11.4283624, 125.0123349] },
  { name: 'Magsaysay', coordinates: [11.3622912, 125.0263337] },
  { name: 'Maligaya', coordinates: [11.4587867, 125.0528940] },
  { name: 'New Manunca', coordinates: [11.4444289, 125.0125344] },
  { name: 'Old Manunca', coordinates: [11.4380195, 125.0153845] },
  { name: 'Pagsulhogon', coordinates: [11.3728397, 125.0213201] },
  { name: 'Salvacion', coordinates: [11.4364937, 124.9644831] },
  { name: 'San Eduardo', coordinates: [11.4740910, 125.0410392] },
  { name: 'San Isidro', coordinates: [11.5062627, 125.0263517] },
  { name: 'San Juan', coordinates: [11.3186042, 124.9775722] },
  { name: 'San Pascual (Crossing)', coordinates: [11.4036400, 124.9964841] },
  { name: 'San Pedro', coordinates: [11.3079778, 124.9832423] },
  { name: 'San Roque', coordinates: [11.4525000, 124.9450000] },
  { name: 'Santa Elena', coordinates: [11.3553584, 125.0105753] },
  { name: 'Tagacay', coordinates: [11.4938223, 124.8843140] },
  { name: 'Tominamos', coordinates: [11.4523264, 125.0204000] },
  { name: 'Tulay', coordinates: [11.4691438, 125.0195549] },
  { name: 'Union', coordinates: [11.4457647, 125.0825161] },
  { name: 'Bokinggan Poblacion (Zone I)', coordinates: [11.4525024, 124.9449563] },
  { name: 'Bougainvilla Poblacion (Zone II)', coordinates: [11.4513904, 124.9425396] },
  { name: 'Gumamela Poblacion (Zone III)', coordinates: [11.4621237, 124.9451521] },
  { name: 'Rosal Poblacion (Zone IV)', coordinates: [11.4693052, 124.9532551] },
  { name: 'Santan Poblacion (Zone V)', coordinates: [11.4515928, 124.9407345] },
];

const PLACEHOLDER_RPT_PERFORMANCE: BarangayPerformance[] = STA_RITA_BARANGAY_COORDINATES.map((barangay, index) => {
  const collectionRate = 60 + ((index * 9) % 36);
  const assessedAmount = 750000 + index * 42500;
  const collectedAmount = Math.round((assessedAmount * collectionRate) / 100);

  return {
    name: barangay.name,
    coordinates: barangay.coordinates,
    collectionRate,
    assessedAmount,
    collectedAmount,
  };
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

function getPerformanceColor(collectionRate: number): string {
  if (collectionRate >= 80) return 'var(--color-chart-2)';
  if (collectionRate >= 70) return 'var(--color-chart-4)';
  return 'var(--color-destructive)';
}

export default function BarangayPerformanceMap() {
  return (
    <section className="mb-8 rounded-xl border border-border bg-card p-4">
      <div className="mb-3">
        <h2 className="font-lexend text-base font-semibold text-foreground">Sta. Rita Barangay RPT Map</h2>
        <p className="font-inter text-xs text-muted-foreground">Pinned barangays with quick RPT performance indicators.</p>
      </div>

      <div className="h-105 w-full overflow-hidden rounded-lg border border-border">
        <MapContainer center={CENTER} zoom={13} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {PLACEHOLDER_RPT_PERFORMANCE.map((barangay) => {
            const color = getPerformanceColor(barangay.collectionRate);

            return (
              <CircleMarker
                key={barangay.name}
                center={barangay.coordinates}
                radius={9}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.65, weight: 2 }}
              >
                <Tooltip>{barangay.name}</Tooltip>
                <Popup>
                  <div className="min-w-45 font-inter text-xs text-foreground">
                    <p className="mb-1 font-semibold text-foreground">{barangay.name}</p>
                    <p>Collection Rate: {barangay.collectionRate}%</p>
                    <p>Assessed: {formatCurrency(barangay.assessedAmount)}</p>
                    <p>Collected: {formatCurrency(barangay.collectedAmount)}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
}