import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, MapPin, Trash2, Pencil } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
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

const EMPTY_FORM = { name: '', address: '', latitude: '', longitude: '' };

/** Click-to-place-pin picker used inside the Add/Edit location form - no geocoding API needed. */
function LocationPicker({ position, onPick }) {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng); } });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

/** Gives the overview map a slow, living feel on load instead of sitting static - a gentle animated fly-in to the data's center. */
function IntroFlyIn({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.6 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/locations');
      setLocations(data.locations);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const startAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const startEdit = (l) => {
    setEditingId(l.id);
    setForm({
      name: l.name, address: l.address || '',
      latitude: l.latitude != null ? String(l.latitude) : '', longitude: l.longitude != null ? String(l.longitude) : '',
    });
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      latitude: form.latitude === '' ? null : Number(form.latitude),
      longitude: form.longitude === '' ? null : Number(form.longitude),
    };
    try {
      if (editingId) {
        await client.patch(`/locations/${editingId}`, payload);
        toast.success('Location updated');
      } else {
        await client.post('/locations', payload);
        toast.success('Location added');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save location');
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
  // coordinates exist.
  const mapCenter = withCoords.length > 0
    ? [withCoords.reduce((s, l) => s + l.latitude, 0) / withCoords.length, withCoords.reduce((s, l) => s + l.longitude, 0) / withCoords.length]
    : [15, 10];
  const mapZoom = withCoords.length > 0 ? 4 : 2;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Locations</h1>
          <p className="text-sm text-ink/60 mt-0.5">Define checkpoints (warehouses, branches, sites) staff can scan assets into.</p>
        </div>
        <Button onClick={startAdd}><Plus size={16} /> Add location</Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <h3 className="font-semibold text-ink mb-4">{editingId ? 'Edit location' : 'New location'}</h3>
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
                <MapContainer center={form.latitude && form.longitude ? [Number(form.latitude), Number(form.longitude)] : [15, 10]} zoom={form.latitude && form.longitude ? 12 : 2} style={{ height: '100%', width: '100%' }}>
                  <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker
                    position={form.latitude && form.longitude ? [Number(form.latitude), Number(form.longitude)] : null}
                    onPick={(lat, lng) => setForm((f) => ({ ...f, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }))}
                  />
                </MapContainer>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
              <Button type="submit">{editingId ? 'Save changes' : 'Save location'}</Button>
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
                        {l.latitude != null && ` · ${l.latitude.toFixed(4)}, ${l.longitude.toFixed(4)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button onClick={() => startEdit(l)} className="text-ink/40 hover:text-link p-1.5 rounded-md hover:bg-primary-50"><Pencil size={15} /></button>
                    <button onClick={() => remove(l.id)} className="text-ink/40 hover:text-red-600 p-1.5 rounded-md hover:bg-primary-50"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden p-0 min-h-[320px]">
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', minHeight: 320 }} worldCopyJump>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <IntroFlyIn center={mapCenter} zoom={mapZoom} />
              {withCoords.map((l) => (
                <Marker key={l.id} position={[l.latitude, l.longitude]} icon={markerIcon}>
                  <Popup>
                    <strong>{l.name}</strong>{l.address && <><br />{l.address}</>}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Card>
        </div>
      )}
    </div>
  );
}
