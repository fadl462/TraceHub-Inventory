import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, MapPin, Trash2 } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Input, EmptyState, Spinner } from '../../components/ui';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '' });

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
      await client.post('/locations', form);
      toast.success('Location added');
      setForm({ name: '', address: '' });
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Locations</h1>
          <p className="text-sm text-ink/60 mt-0.5">Define checkpoints (warehouses, branches, sites) staff can scan assets into.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}><Plus size={16} /> Add location</Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
            <Input label="Location name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save location</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : locations.length === 0 ? (
          <EmptyState icon={MapPin} title="No locations yet" description="Add warehouses or branches so staff can check assets in/out by scanning." />
        ) : (
          <div className="divide-y divide-primary-50">
            {locations.map((l) => (
              <div key={l.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center text-link"><MapPin size={16} /></div>
                  <div>
                    <p className="font-medium text-ink">{l.name}</p>
                    <p className="text-xs text-ink/50">{l.address || 'No address set'}</p>
                  </div>
                </div>
                <button onClick={() => remove(l.id)} className="text-ink/40 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
