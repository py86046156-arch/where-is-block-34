import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Play, 
  Square, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Download, 
  Plus, 
  Trash2
} from 'lucide-react';

export default function UsabilityTestLab({ nodes = [], onSelectRouteForTest }) {
  const [testSessions, setTestSessions] = useState(() => {
    const saved = localStorage.getItem('p10_test_sessions');
    return saved ? JSON.parse(saved) : [
      {
        id: "sample-session-01",
        participantName: "Evaluator Demo Participant (Sample)",
        startPoint: "Gate 1 (Main GT Road)",
        destination: "Block 34 (Seminar Hall 34-205)",
        durationSeconds: 42,
        foundRoute: true,
        reachedDestination: true,
        confusionPoints: "Paused momentarily near central fountain to check between Block 32 and 34.",
        askedForHelp: false,
        susScore: 85,
        feedback: "The last-50m guidance with door plaque details made finding the seminar hall effortless.",
        timestamp: "2026-10-21 10:15",
        isSample: true,
      }
    ];
  });

  // Active Test Timer
  const [isRunning, setIsRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    participantName: '',
    startPoint: 'Gate 1 (Main GT Road)',
    destination: 'Block 34 (School of Computer Science & Engineering)',
    foundRoute: true,
    reachedDestination: true,
    confusionPoints: '',
    askedForHelp: false,
    susScore: 80,
    feedback: '',
  });

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('p10_test_sessions', JSON.stringify(testSessions));
  }, [testSessions]);

  // Timer loop
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartTest = () => {
    setIsRunning(true);
    setTimerSeconds(0);
  };

  const handleStopTest = () => {
    setIsRunning(false);
  };

  const handleSubmitSession = (e) => {
    e.preventDefault();
    if (!formData.participantName.trim()) {
      alert("Please enter participant name or ID code.");
      return;
    }

    const newSession = {
      id: `session-${Date.now()}`,
      ...formData,
      durationSeconds: timerSeconds > 0 ? timerSeconds : 45,
      timestamp: new Date().toLocaleString(),
      isSample: false,
    };

    setTestSessions([newSession, ...testSessions]);
    setIsRunning(false);
    setTimerSeconds(0);
    setFormData({
      participantName: '',
      startPoint: 'Gate 1 (Main GT Road)',
      destination: 'Block 34 (School of Computer Science & Engineering)',
      foundRoute: true,
      reachedDestination: true,
      confusionPoints: '',
      askedForHelp: false,
      susScore: 80,
      feedback: '',
    });
  };

  const handleDeleteSession = (id) => {
    setTestSessions(testSessions.filter(s => s.id !== id));
  };

  const handleExportCSV = () => {
    const headers = "ID,Participant,Start,Destination,Duration(s),FoundRoute,ReachedDestination,ConfusionPoints,AskedHelp,SUS,Feedback,Timestamp\n";
    const rows = testSessions.map(s => 
      `"${s.id}","${s.participantName}","${s.startPoint}","${s.destination}",${s.durationSeconds},${s.foundRoute},${s.reachedDestination},"${s.confusionPoints || ''}",${s.askedForHelp},${s.susScore},"${s.feedback || ''}","${s.timestamp}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `p10-usability-test-log-${Date.now()}.csv`;
    a.click();
  };

  // Metrics
  const totalTests = testSessions.length;
  const successRate = totalTests > 0 
    ? Math.round((testSessions.filter(s => s.reachedDestination).length / totalTests) * 100) 
    : 0;
  const avgDuration = totalTests > 0 
    ? Math.round(testSessions.reduce((acc, s) => acc + s.durationSeconds, 0) / totalTests) 
    : 0;
  const avgSus = totalTests > 0 
    ? Math.round(testSessions.reduce((acc, s) => acc + Number(s.susScore || 80), 0) / totalTests) 
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Title */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-2xl border border-orange-500/20">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                Usability Testing Lab
              </h2>
              <p className="text-xs text-slate-500">
                Live participant navigation trials, error logging, and task completion metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export Test Log (.CSV)
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Evaluation Standard:</strong> This testing bench records live participant attempts. Do not fabricate testing sessions; entries tagged with "Sample" are provided for UI demonstration only.
          </span>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Sessions
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalTests}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Completion Rate
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {successRate}%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg. Task Duration
          </span>
          <div className="text-2xl font-black text-orange-600 mt-1">
            {avgDuration}s
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Mean SUS Score
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {avgSus} / 100
          </div>
        </div>
      </div>

      {/* Active Test Runner Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-orange-600" />
              Conduct a Usability Test Session
            </h3>
            <p className="text-xs text-slate-500">
              Set task, track time, observe participant struggles, and log usability results.
            </p>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl font-mono text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400 animate-spin-slow" />
              <span>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
            </div>

            {!isRunning ? (
              <button
                type="button"
                onClick={handleStartTest}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              >
                <Play className="w-3.5 h-3.5" /> Start Timer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopTest}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              >
                <Square className="w-3.5 h-3.5" /> Stop Timer
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmitSession} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Participant Name / ID
              </label>
              <input
                type="text"
                placeholder="e.g. User #04 (First-time visitor)"
                value={formData.participantName}
                onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Assigned Starting Gate
              </label>
              <select
                value={formData.startPoint}
                onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="Gate 1 (Main GT Road)">Gate 1 (Main GT Road)</option>
                <option value="Gate 2 (North Gate)">Gate 2 (North Gate)</option>
                <option value="Gate 4 (UniMall Gate)">Gate 4 (UniMall Gate)</option>
                <option value="Central Fountain">Central Fountain</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Destination
              </label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="Block 34 (School of Computer Science & Engineering)">
                  Block 34 (Main CSE Building)
                </option>
                <option value="Room 34-205 (Central Seminar Hall)">
                  Room 34-205 (Seminar Hall Floor 2)
                </option>
                <option value="Block 28 (Central Library)">Block 28 (Central Library)</option>
                <option value="Block 25 (UniMall Commercial)">Block 25 (UniMall)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="foundRouteCheck"
                checked={formData.foundRoute}
                onChange={(e) => setFormData({ ...formData, foundRoute: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <label htmlFor="foundRouteCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                Participant Found Route
              </label>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="reachedDestCheck"
                checked={formData.reachedDestination}
                onChange={(e) => setFormData({ ...formData, reachedDestination: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <label htmlFor="reachedDestCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                Reached Final Destination
              </label>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="helpCheck"
                checked={formData.askedForHelp}
                onChange={(e) => setFormData({ ...formData, askedForHelp: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <label htmlFor="helpCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                Requested External Assistance
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Errors / Points of Confusion Observed
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Hesitated at rotary fountain; tried to enter Block 32 first."
                value={formData.confusionPoints}
                onChange={(e) => setFormData({ ...formData, confusionPoints: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Participant Feedback / Suggestions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Loved the floor guidance; suggested larger gate signs."
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Estimated SUS Score:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.susScore}
                onChange={(e) => setFormData({ ...formData, susScore: Number(e.target.value) })}
                className="w-16 p-1 text-xs text-center font-bold bg-slate-50 border border-slate-300 rounded-lg"
              />
              <span className="text-[11px] text-slate-400">/ 100</span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Log Test Result
            </button>
          </div>
        </form>
      </div>

      {/* Logged Test Sessions Table */}
      <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-slate-900">
            Recorded Usability Test Sessions ({testSessions.length})
          </h4>
          <span className="text-xs text-slate-500">
            Stored locally in browser localStorage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Participant</th>
                <th className="p-3">Origin ➔ Destination</th>
                <th className="p-3">Time</th>
                <th className="p-3">Success?</th>
                <th className="p-3">Confusion Points</th>
                <th className="p-3">SUS</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testSessions.map(session => (
                <tr key={session.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{session.participantName}</span>
                    <span className="text-[10px] text-slate-400">{session.timestamp}</span>
                    {session.isSample && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                        Demo Sample
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-medium text-slate-800">
                    <div>{session.startPoint}</div>
                    <div className="text-orange-600 font-bold">➔ {session.destination}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-700">
                    {session.durationSeconds}s
                  </td>
                  <td className="p-3">
                    {session.reachedDestination ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Reached
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Incomplete
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500 max-w-xs">
                    {session.confusionPoints || 'None observed.'}
                  </td>
                  <td className="p-3 font-bold text-indigo-700">
                    {session.susScore}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Delete record"
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
  );
}
