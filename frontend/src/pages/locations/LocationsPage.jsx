import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, MapPin, Trash2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import client from '../../api/client';
import { Card, Button, Input, EmptyState, Spinner } from '../../components/ui';

// Leaflet's default marker icon paths don't resolve correctly through
// bundlers (Vite/webpack rewrite asset URLs) - point them at a CDN instead
// of shipping broken/missing marker images.
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

/** Click-to-place-pin picker used inside the Add/Edit location form - no geocoding API needed. */
function LocationPicker({ position, onPick }) {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng); } });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', latitude: '', longitude: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/locations');
      setLocations(data.locations);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/locations', {
        ...form,
        latitude: form.latitude === '' ? null : Number(form.latitude),
        longitude: form.longitude === '' ? null : Number(form.longitude),
      });
      toast.success('Location added');
      setForm({ name: '', address: '', latitude: '', longitude: '' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add location');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this location checkpoint?')) return;
    try {
      await client.delete(`/locations/${id}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const withCoords = locations.filter((l) => l.latitude != null && l.longitude != null);
  // Default view: whole world (a genuinely global product shouldn't assume
  // any one region) - re-centers automatically once locations with real
  // coordinates exist, via the `key` remount below.
  const mapCenter = withCoords.length > 0
    ? [withCoords.reduce((s, l) => s + l.latitude, 0) / withCoords.length, withCoords.reduce((s, l) => s + l.longitude, 0) / withCoords.length]
    : [20, 0];
  const mapZoom = withCoords.length > 0 ? 4 : 2;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Locations</h1>
          <p className="text-sm text-ink/60 mt-0.5">Define checkpoints (warehouses, branches, sites) staff can scan assets into.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}><Plus size={16} /> Add location</Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Location name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Input label="Latitude" type="number" step="any" placeholder="e.g. 5.6037" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
              <Input label="Longitude" type="number" step="any" placeholder="e.g. -0.1870" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/80 mb-1.5">Or click the map to set coordinates</p>
              <div className="rounded-lg overflow-hidden border border-primary-100" style={{ height: 260 }}>
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                  <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker
                    position={form.latitude && form.longitude ? [Number(form.latitude), Number(form.longitude)] : null}
                    onPick={(lat, lng) => setForm((f) => ({ ...f, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }))}
                  />
                </MapContainer>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save location</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      ) : locations.length === 0 ? (
        <Card><EmptyState icon={MapPin} title="No locations yet" description="Add warehouses or branches so staff can check assets in/out by scanning." /></Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="overflow-hidden">
            <div className="divide-y divide-primary-50">
              {locations.map((l) => (
                <div key={l.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center text-link shrink-0"><MapPin size={16} /></div>
                    <div className="min-w-0">
                      <p className="font-medium text-ink truncate">{l.name}</p>
                      <p className="text-xs text-ink/50 truncate">
                        {l.address || 'No address set'}
                        {l.latitude != null && ` \u00b7 ${l.latitude.toFixed(4)}, ${l.longitude.toFixed(4)}`}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => remove(l.id)} className="text-ink/40 hover:text-red-600 shrink-0 ml-2"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden p-0 min-h-[320px]">
            {withCoords.length === 0 ? (
              <div className="h-full min-h-[320px] flex items-center justify-center text-sm text-ink/50 text-center p-6">
                None of your locations have coordinates set yet. Edit a location above and click the map to place a pin.
              </div>
            ) : (
              <MapContainer key={withCoords.length} center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', minHeight: 320 }}>
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {withCoords.map((l) => (
                  <Marker key={l.id} position={[l.latitude, l.longitude]} icon={markerIcon}>
                    <Popup>
                      <strong>{l.name}</strong>{l.address && <><br />{l.address}</>}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
