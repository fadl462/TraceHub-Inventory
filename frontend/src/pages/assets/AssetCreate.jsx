import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Input, Select } from '../../components/ui';

export default function AssetCreate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', categoryId: '', brand: '', model: '', color: '', serialNumber: '',
    manufactureYear: '', purchaseDate: '', purchasePrice: '', condition: 'good',
    currentLocationId: '', freeTextLocation: '', description: '',
  });

  useEffect(() => {
    client.get('/categories').then(({ data }) => setCategories(data.categories));
    client.get('/locations').then(({ data }) => setLocations(data.locations));
  }, []);

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const profile = selectedCategory?.DepreciationProfile;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach((k) => { if (payload[k] === '') delete payload[k]; });
      const { data } = await client.post('/assets', payload);
      toast.success('Asset registered successfully');
      navigate(`/assets/${data.asset.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Register a new asset</h1>
        <p className="text-sm text-ink/60 mt-0.5">A QR code and AI-estimated disposal timeline will be generated automatically.</p>
      </div>

      <form onSubmit={onSubmit}>
        <Card className="p-6 space-y-5">
          <Input label="Asset name *" required placeholder="e.g. Dell Latitude Laptop" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label="Condition" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">Damaged</option>
            </Select>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <Input label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            <Input label="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>

          <Input label="Serial number" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} />

          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Manufacture year" type="number" placeholder="2023" value={form.manufactureYear} onChange={(e) => setForm({ ...form, manufactureYear: e.target.value })} />
            <Input label="Purchase date" type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
            <Input label="Purchase price" type="number" step="0.01" placeholder="500" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} />
          </div>

          {profile && form.purchasePrice && (
            <div className="rounded-lg bg-accent/10 border border-accent/30 p-4 flex gap-3">
              <Sparkles size={18} className="text-accent-dark shrink-0 mt-0.5" />
              <div className="text-sm text-ink/80">
                <p className="font-medium text-ink">AI depreciation preview ({selectedCategory.name})</p>
                <p className="mt-1">
                  Useful life: <strong>{profile.usefulLifeYears} years</strong> · Scrap value: <strong>~{profile.scrapValuePercent}%</strong> of purchase price
                  ({(form.purchasePrice * profile.scrapValuePercent / 100).toFixed(2)}) once registered, TraceHub will calculate the current value and suggested disposal date automatically.
                </p>
              </div>
            </div>
          )}

          <Select label="Current location" value={form.currentLocationId} onChange={(e) => setForm({ ...form, currentLocationId: e.target.value })}>
            <option value="">No fixed checkpoint / not set</option>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Select>

          {locations.length === 0 && (
            <Input label="Or describe location (e.g. 'Accra office, 2nd floor store')" value={form.freeTextLocation} onChange={(e) => setForm({ ...form, freeTextLocation: e.target.value })} />
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/80">Description</span>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register asset'}</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
