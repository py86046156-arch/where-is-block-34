import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Camera, 
  MapPin, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw
} from 'lucide-react';
import QRCode from 'qrcode';

export default function QRWayfinding({
  nodes = [],
  onSetStartWaypoint,
  onNavigateToBlock34
}) {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'generate'
  const [selectedWaypointId, setSelectedWaypointId] = useState(nodes[0]?.id || 'gate-1');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(false);

  // Generate QR code for the selected waypoint node
  useEffect(() => {
    const node = nodes.find(n => n.id === selectedWaypointId);
    if (node) {
      const payload = JSON.stringify({
        waypointId: node.qrCode || `LPU-${node.code}`,
        nodeId: node.id,
        name: node.name,
        category: node.category,
        url: window.location.origin,
      });

      QRCode.toDataURL(payload, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
    }
  }, [selectedWaypointId, nodes]);

  // Handle manual code entry
  const handleManualSubmit = (e) => {
    e.preventDefault();
    const clean = manualCodeInput.trim().toUpperCase();
    if (!clean) return;

    // Search by code, qrCode, or id
    const found = nodes.find(n => 
      n.qrCode?.toUpperCase() === clean ||
      n.code?.toUpperCase() === clean ||
      n.id?.toUpperCase() === clean ||
      n.name?.toUpperCase().includes(clean)
    );

    if (found) {
      setScanResult(found);
    } else {
      alert(`Waypoint code "${clean}" not recognized. Try "GATE-1", "34", "UNIPOLIS", or select from sample quick tags.`);
    }
  };

  // Simulate scanning a specific node
  const handleSimulateScan = (node) => {
    setIsSimulatingCamera(true);
    setTimeout(() => {
      setIsSimulatingCamera(false);
      setScanResult(node);
    }, 600);
  };

  const handleConfirmStart = (node) => {
    if (onSetStartWaypoint) {
      onSetStartWaypoint(node.id);
    }
  };

  const selectedNode = nodes.find(n => n.id === selectedWaypointId);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Title & Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-2xl border border-orange-500/20">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                QR Waypoint Navigation
              </h2>
              <p className="text-xs text-slate-500">
                Scan on-ground signs or enter waypoint IDs to set your current location instantly.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'scan' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scan / Enter Waypoint
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'generate' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              QR Sign Station (Printable)
            </button>
          </div>
        </div>

        {/* Academic Deployment Notice */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Deployment Note:</strong> In production, high-durability acrylic QR plates are physically mounted on gate pillars and hallway junctions. Below is the interactive prototype simulator.
          </span>
        </div>
      </div>

      {activeTab === 'scan' ? (
        /* SCAN / ENTER WAYPOINT TAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Simulated Camera Scanner & Manual Input */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-lg border border-slate-200 p-5 space-y-5">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-500" />
              Waypoint Scanner (Camera / Simulator)
            </h3>

            {/* Scanner Frame */}
            <div className="relative aspect-video max-h-64 w-full bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-slate-700">
              {isSimulatingCamera ? (
                <div className="space-y-3">
                  <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                  <p className="text-xs text-orange-400 font-semibold">
                    Optical recognition in progress...
                  </p>
                </div>
              ) : scanResult ? (
                <div className="space-y-2 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-bold text-sm">
                    Waypoint Recognized!
                  </h4>
                  <p className="text-emerald-400 text-xs font-semibold">
                    {scanResult.name} ({scanResult.code})
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <QrCode className="w-12 h-12 text-slate-500 mx-auto opacity-75" />
                  <p className="text-slate-300 text-xs font-medium">
                    Position camera over a physical waypoint QR plate
                  </p>
                  <p className="text-[11px] text-slate-400">
                    (Use simulated one-click scan below if camera is unavailable)
                  </p>
                </div>
              )}

              {/* Scanning Crosshairs */}
              <div className="absolute inset-8 pointer-events-none border border-orange-500/40 rounded-xl">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-orange-500"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-500"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-orange-500"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-500"></div>
              </div>
            </div>

            {/* Quick 1-Click Simulated Waypoint Scans */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Simulate Scanning Demo Campus Signs:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {nodes.slice(0, 6).map(node => (
                  <button
                    key={node.id}
                    onClick={() => handleSimulateScan(node)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-orange-400 bg-slate-50 hover:bg-orange-50/50 text-left transition-all"
                  >
                    <span className="block text-xs font-bold text-slate-900 truncate">
                      {node.name.split(' (')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ID: {node.qrCode || node.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Code Input Form */}
            <form onSubmit={handleManualSubmit} className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Or Enter Waypoint Sign ID Manually:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCodeInput}
                  onChange={(e) => setManualCodeInput(e.target.value)}
                  placeholder="e.g. GATE-1, 34, UNIPOLIS, G2"
                  className="flex-1 py-2 px-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Locate
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Scan Result & Next Action */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-lg border border-slate-200 p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Detected Location Status
              </h3>

              {scanResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-800">
                      Waypoint Verified
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">
                      {scanResult.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {scanResult.description}
                    </p>
                    <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
                      Zone: {scanResult.zone} • Code: {scanResult.code}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleConfirmStart(scanResult)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Set as My Starting Point
                    </button>

                    <button
                      onClick={() => {
                        handleConfirmStart(scanResult);
                        if (onNavigateToBlock34) onNavigateToBlock34(scanResult.id);
                      }}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Navigate from Here to Block 34
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <QrCode className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-800">No Location Scanned Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Scan a demo sign on the left or enter a sign ID to pinpoint your position on campus.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
              💡 <strong>Visitor Pro Tip:</strong> Look for large orange QR stands at every campus bus bay, entry turnstile, and corridor junction.
            </div>
          </div>
        </div>
      ) : (
        /* QR SIGN STATION / PRINTABLE GENERATOR TAB */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Select Waypoint Sign to Generate
            </h3>
            <p className="text-xs text-slate-500">
              Generate official campus wayfinding signboards with scan payload ready for printing.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Campus Location:
              </label>
              <select
                value={selectedWaypointId}
                onChange={(e) => setSelectedWaypointId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
              <div><strong>Waypoint ID:</strong> {selectedNode?.qrCode || `LPU-${selectedNode?.code}`}</div>
              <div><strong>Zone:</strong> {selectedNode?.zone}</div>
              <div><strong>Facilities:</strong> {selectedNode?.facilities?.join(', ') || 'General Navigation'}</div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow"
            >
              <Printer className="w-4 h-4" />
              Print Waypoint Sign
            </button>
          </div>

          {/* Printable Campus Sign Mockup */}
          <div className="md:col-span-7 flex justify-center items-center">
            <div className="w-full max-w-sm bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-2xl text-center space-y-4">
              {/* Sign Header */}
              <div className="border-b-2 border-slate-900 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                  LOVELY PROFESSIONAL UNIVERSITY
                </span>
                <h4 className="text-lg font-black text-slate-900 uppercase">
                  WAYFINDING WAYPOINT
                </h4>
                <div className="text-xs font-bold text-slate-600">
                  {selectedNode?.name}
                </div>
              </div>

              {/* QR Image */}
              <div className="p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 inline-block">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Campus Waypoint QR" className="w-48 h-48 mx-auto" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-400">
                    Generating...
                  </div>
                )}
              </div>

              {/* Instructional Text */}
              <div className="space-y-1 text-slate-700">
                <div className="text-xs font-extrabold text-slate-900">
                  SCAN WITH PHONE CAMERA
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant directions to Block 34, Examination Halls, or any room.
                </p>
                <div className="pt-2 text-[10px] font-mono font-bold text-slate-400">
                  CODE: {selectedNode?.qrCode || selectedNode?.code}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
