import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert
} from 'lucide-react';

export default function AdminManager({
  nodes,
  edges,
  rooms,
  onSaveNodes,
  onSaveEdges,
  onSaveRooms,
  onResetToDefault,
}) {
  const [activeTab, setActiveTab] = useState('nodes'); // 'nodes' | 'edges' | 'rooms' | 'json'
  const [nodeForm, setNodeForm] = useState({
    id: '',
    name: '',
    code: '',
    category: 'block',
    x: 500,
    y: 300,
    description: '',
    zone: 'Central Academic',
    accessible: true,
  });
  const [edgeForm, setEdgeForm] = useState({
    source: '',
    target: '',
    distance: 100,
    type: 'boulevard',
    description: '',
  });
  const [roomForm, setRoomForm] = useState({
    id: '',
    blockId: 'block-34',
    blockNumber: '34',
    roomNumber: '',
    name: '',
    floor: 1,
    floorName: 'First Floor',
    category: 'lab',
    description: '',
    indoorDirections: '',
    landmarkNearRoom: '',
  });

  const [jsonExportString, setJsonExportString] = useState('');
  const [jsonImportString, setJsonImportString] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const triggerSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Node Management
  const handleAddNode = (e) => {
    e.preventDefault();
    if (!nodeForm.name || !nodeForm.code) {
      setErrorMessage("Please provide a node name and code.");
      return;
    }

    const newNodeId = nodeForm.id || `custom-${nodeForm.code.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const updated = [...nodes, { ...nodeForm, id: newNodeId }];
    onSaveNodes(updated);
    setNodeForm({
      id: '',
      name: '',
      code: '',
      category: 'block',
      x: 500,
      y: 300,
      description: '',
      zone: 'Central Academic',
      accessible: true,
    });
    triggerSuccess(`Node "${nodeForm.name}" added successfully.`);
  };

  const handleDeleteNode = (id) => {
    if (confirm("Delete this campus node and associated edges?")) {
      const updatedNodes = nodes.filter(n => n.id !== id);
      const updatedEdges = edges.filter(e => e.source !== id && e.target !== id);
      onSaveNodes(updatedNodes);
      onSaveEdges(updatedEdges);
      triggerSuccess("Node removed.");
    }
  };

  // Edge Management
  const handleAddEdge = (e) => {
    e.preventDefault();
    if (!edgeForm.source || !edgeForm.target) {
      setErrorMessage("Please select both source and destination nodes.");
      return;
    }
    if (edgeForm.source === edgeForm.target) {
      setErrorMessage("Source and destination cannot be identical.");
      return;
    }

    const updated = [...edges, { ...edgeForm, distance: Number(edgeForm.distance) }];
    onSaveEdges(updated);
    setEdgeForm({
      source: '',
      target: '',
      distance: 100,
      type: 'boulevard',
      description: '',
    });
    triggerSuccess("Pathway connection created.");
  };

  const handleDeleteEdge = (index) => {
    const updated = edges.filter((_, idx) => idx !== index);
    onSaveEdges(updated);
    triggerSuccess("Pathway deleted.");
  };

  // Room Management
  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!roomForm.roomNumber || !roomForm.name) {
      setErrorMessage("Please specify room number and name.");
      return;
    }
    const newRoomId = roomForm.id || `room-${Date.now()}`;
    const updated = [...rooms, { ...roomForm, id: newRoomId }];
    onSaveRooms(updated);
    setRoomForm({
      id: '',
      blockId: 'block-34',
      blockNumber: '34',
      roomNumber: '',
      name: '',
      floor: 1,
      floorName: 'First Floor',
      category: 'lab',
      description: '',
      indoorDirections: '',
      landmarkNearRoom: '',
    });
    triggerSuccess(`Room "${roomForm.roomNumber}" added.`);
  };

  const handleDeleteRoom = (id) => {
    const updated = rooms.filter(r => r.id !== id);
    onSaveRooms(updated);
    triggerSuccess("Room deleted.");
  };

  // Export JSON
  const handleGenerateExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      metadata: { institution: "Lovely Professional University", system: "P10 Wayfinding" },
      nodes,
      edges,
      rooms,
    };
    setJsonExportString(JSON.stringify(data, null, 2));
    setActiveTab('json');
  };

  // Import JSON
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonImportString);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        onSaveNodes(parsed.nodes);
        onSaveEdges(parsed.edges);
        if (Array.isArray(parsed.rooms)) onSaveRooms(parsed.rooms);
        triggerSuccess("Campus data successfully imported!");
      } else {
        alert("Invalid format: JSON must contain 'nodes' and 'edges' arrays.");
      }
    } catch (err) {
      alert("JSON Syntax Error: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-2xl border border-orange-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                Campus Data Management (Demo Admin)
              </h2>
              <p className="text-xs text-slate-500">
                Configure campus nodes, physical pathway edges, room catalogs, and export verified datasets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateExport}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export Data JSON
            </button>
            <button
              onClick={() => {
                if (confirm("Reset all campus nodes, edges, and rooms to default demo dataset?")) {
                  onResetToDefault();
                  triggerSuccess("Reset to initial dataset.");
                }
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
            </button>
          </div>
        </div>

        {/* Security & Academic Disclaimer */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Administrative Prototype Notice:</strong> Changes are saved to your browser's local storage for simulation. In production, this module requires a secure backend with Role-Based Access Control (RBAC) and university administration credentials.
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          {errorMessage}
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 pb-2">
        <button
          onClick={() => setActiveTab('nodes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'nodes' ? 'bg-navy-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Campus Nodes ({nodes.length})
        </button>
        <button
          onClick={() => setActiveTab('edges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'edges' ? 'bg-navy-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pathways / Edges ({edges.length})
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rooms' ? 'bg-navy-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Rooms Directory ({rooms.length})
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'json' ? 'bg-navy-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Backup / Import JSON
        </button>
      </div>

      {/* TAB 1: NODES */}
      {activeTab === 'nodes' && (
        <div className="space-y-6">
          {/* Add Node Form */}
          <form onSubmit={handleAddNode} className="bg-white p-5 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-500" />
              Add Campus Node (Block, Gate, Landmark)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Block 40"
                  value={nodeForm.name}
                  onChange={(e) => setNodeForm({ ...nodeForm, name: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Code / Label</label>
                <input
                  type="text"
                  placeholder="e.g. 40"
                  value={nodeForm.code}
                  onChange={(e) => setNodeForm({ ...nodeForm, code: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Category</label>
                <select
                  value={nodeForm.category}
                  onChange={(e) => setNodeForm({ ...nodeForm, category: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="block">Academic Block</option>
                  <option value="gate">Entrance Gate</option>
                  <option value="landmark">Landmark / Facility</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Map X Coordinate</label>
                <input
                  type="number"
                  value={nodeForm.x}
                  onChange={(e) => setNodeForm({ ...nodeForm, x: Number(e.target.value) })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Map Y Coordinate</label>
                <input
                  type="number"
                  value={nodeForm.y}
                  onChange={(e) => setNodeForm({ ...nodeForm, y: Number(e.target.value) })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Zone</label>
                <input
                  type="text"
                  placeholder="e.g. East Academic"
                  value={nodeForm.zone}
                  onChange={(e) => setNodeForm({ ...nodeForm, zone: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
              <input
                type="text"
                placeholder="Brief information about this destination..."
                value={nodeForm.description}
                onChange={(e) => setNodeForm({ ...nodeForm, description: e.target.value })}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Add Node to Graph
            </button>
          </form>

          {/* Nodes Table */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Zone</th>
                    <th className="p-3">Coords (X,Y)</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nodes.map(node => (
                    <tr key={node.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{node.code}</td>
                      <td className="p-3 font-semibold text-slate-800">{node.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-700">
                          {node.category}
                        </span>
                      </td>
                      <td className="p-3">{node.zone}</td>
                      <td className="p-3 font-mono">{node.x}, {node.y}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteNode(node.id)}
                          className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                          title="Delete Node"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDGES */}
      {activeTab === 'edges' && (
        <div className="space-y-6">
          {/* Add Edge Form */}
          <form onSubmit={handleAddEdge} className="bg-white p-5 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-500" />
              Connect Two Campus Nodes (Pathway Segment)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Source Node</label>
                <select
                  value={edgeForm.source}
                  onChange={(e) => setEdgeForm({ ...edgeForm, source: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="">Select origin...</option>
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Target Node</label>
                <select
                  value={edgeForm.target}
                  onChange={(e) => setEdgeForm({ ...edgeForm, target: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="">Select destination...</option>
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Distance (Meters)</label>
                <input
                  type="number"
                  min="10"
                  max="2000"
                  value={edgeForm.distance}
                  onChange={(e) => setEdgeForm({ ...edgeForm, distance: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Pathway Type</label>
                <select
                  value={edgeForm.type}
                  onChange={(e) => setEdgeForm({ ...edgeForm, type: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="boulevard">Main Boulevard</option>
                  <option value="covered">Covered Corridor / Bridge</option>
                  <option value="paved">Paved Walkway</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Add Pathway Edge
            </button>
          </form>

          {/* Edges Table */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">From</th>
                    <th className="p-3">To</th>
                    <th className="p-3">Distance</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {edges.map((edge, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">{edge.source}</td>
                      <td className="p-3 font-semibold text-slate-900">{edge.target}</td>
                      <td className="p-3 font-bold text-orange-600">{edge.distance}m</td>
                      <td className="p-3 capitalize">{edge.type}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteEdge(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                          title="Delete pathway"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROOMS */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          {/* Add Room Form */}
          <form onSubmit={handleAddRoom} className="bg-white p-5 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-500" />
              Add Room / Laboratory / Office to a Block
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Belongs to Block</label>
                <select
                  value={roomForm.blockId}
                  onChange={(e) => {
                    const blk = nodes.find(n => n.id === e.target.value);
                    setRoomForm({
                      ...roomForm,
                      blockId: e.target.value,
                      blockNumber: blk ? blk.code : '34'
                    });
                  }}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {nodes.filter(n => n.category === 'block').map(n => (
                    <option key={n.id} value={n.id}>
                      {n.name} (Block {n.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. 34-210"
                  value={roomForm.roomNumber}
                  onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Room Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Security Lab"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Floor</label>
                <select
                  value={roomForm.floor}
                  onChange={(e) => setRoomForm({ ...roomForm, floor: Number(e.target.value), floorName: `Floor ${e.target.value}` })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value={1}>Ground / Floor 1</option>
                  <option value={2}>Floor 2</option>
                  <option value={3}>Floor 3</option>
                  <option value={4}>Floor 4</option>
                  <option value={5}>Floor 5</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Indoor Walking Directions</label>
                <input
                  type="text"
                  placeholder="e.g. Turn right from elevator, 2nd door on left."
                  value={roomForm.indoorDirections}
                  onChange={(e) => setRoomForm({ ...roomForm, indoorDirections: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nearby Visual Cue / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Next to Faculty Cabin 208 and water cooler."
                  value={roomForm.landmarkNearRoom}
                  onChange={(e) => setRoomForm({ ...roomForm, landmarkNearRoom: e.target.value })}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Add Room
            </button>
          </form>

          {/* Rooms Table */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Room #</th>
                    <th className="p-3">Block</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Floor</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map(room => (
                    <tr key={room.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-purple-700">{room.roomNumber}</td>
                      <td className="p-3 font-semibold text-slate-900">Block {room.blockNumber}</td>
                      <td className="p-3 font-medium text-slate-800">{room.name}</td>
                      <td className="p-3">{room.floorName}</td>
                      <td className="p-3 uppercase text-[10px] font-bold text-slate-500">{room.category}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JSON EXPORT & IMPORT */}
      {activeTab === 'json' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Side */}
          <div className="bg-white p-5 rounded-2xl shadow border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-orange-600" />
              Export Campus Dataset
            </h4>
            <p className="text-xs text-slate-500">
              Download this JSON to share with college evaluators or persist verified campus records.
            </p>
            <textarea
              readOnly
              value={jsonExportString || JSON.stringify({ nodes, edges, rooms }, null, 2)}
              className="w-full h-64 p-3 font-mono text-[11px] bg-slate-900 text-slate-200 rounded-xl"
            />
            <button
              onClick={() => {
                const blob = new Blob([jsonExportString || JSON.stringify({ nodes, edges, rooms }, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `lpu-campus-dataset-${Date.now()}.json`;
                a.click();
              }}
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download .json File
            </button>
          </div>

          {/* Import Side */}
          <div className="bg-white p-5 rounded-2xl shadow border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              Import Verified Dataset
            </h4>
            <p className="text-xs text-slate-500">
              Paste or upload real university survey JSON to replace demo coordinates.
            </p>
            <textarea
              placeholder="Paste JSON structure with { nodes: [...], edges: [...], rooms: [...] }"
              value={jsonImportString}
              onChange={(e) => setJsonImportString(e.target.value)}
              className="w-full h-64 p-3 font-mono text-[11px] bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleImportJson}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Load & Apply Dataset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
