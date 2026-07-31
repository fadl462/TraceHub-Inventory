import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { ScanLine, MapPin, CheckCircle2, Keyboard } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Select, Badge, statusTone } from '../../components/ui';

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState('');
  const [result, setResult] = useState(null);
  const scannerRef = useRef(null);
  const containerId = 'th-qr-reader';

  useEffect(() => {
    client.get('/locations').then(({ data }) => setLocations(data.locations)).catch(() => {});
    return () => stopScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const extractToken = (decodedText) => {
    // decodedText is the full scan URL: {CLIENT_URL}/scan/{qrToken}
    const parts = decodedText.split('/');
    return parts[parts.length - 1];
  };

  const handleScanSuccess = async (decodedText) => {
    stopScanner();
    await submitScan(extractToken(decodedText));
  };

  const startScanner = async () => {
    setResult(null);
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      setScanning(true);
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => {}
      );
    } catch (err) {
      toast.error('Could not access camera. You can enter the code manually below.');
      setScanning(false);
    }
  };

  const submitScan = async (qrToken) => {
    if (!qrToken) return;
    try {
      const { data } = await client.post('/locations/scan', {
        qrToken, locationId: locationId || undefined, eventType: 'scan_in',
      });
      setResult(data.asset);
      toast.success('Scan recorded');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Scan failed - unrecognized code');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink flex items-center gap-2"><ScanLine size={22} /> Scan asset</h1>
        <p className="text-sm text-ink/60 mt-0.5">Scan an asset's QR tag to check it in at a location, or look it up manually.</p>
      </div>

      <Card className="p-5">
        <Select label="Checkpoint / location for this scan" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
          <option value="">Don't update location (just look up)</option>
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </Select>
      </Card>

      <Card className="p-5">
        <div id={containerId} className="rounded-lg overflow-hidden bg-primary-900/5 min-h-[240px] flex items-center justify-center">
          {!scanning && <p className="text-sm text-ink/40">Camera preview will appear here</p>}
        </div>
        <div className="mt-4 flex gap-3">
          {!scanning ? (
            <Button className="flex-1" onClick={startScanner}><ScanLine size={16} /> Start camera scan</Button>
          ) : (
            <Button variant="outline" className="flex-1" onClick={stopScanner}>Stop scanning</Button>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-sm font-medium text-ink mb-3 flex items-center gap-2"><Keyboard size={15} /> Or enter the asset code manually</p>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
            placeholder="Paste QR token or asset code"
            value={manualToken} onChange={(e) => setManualToken(e.target.value)}
          />
          <Button onClick={() => submitScan(manualToken)}>Submit</Button>
        </div>
      </Card>

      {result && (
        <Card className="p-5 border-accent/40 bg-accent/5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-accent-dark shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-ink">{result.name}</p>
              <p className="text-xs text-ink/60 font-mono">{result.assetTag}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge tone={statusTone(result.status)}>{result.status.replace('_', ' ')}</Badge>
                {result.Location && (
                  <span className="text-xs text-ink/60 flex items-center gap-1"><MapPin size={12} /> {result.Location.name}</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
