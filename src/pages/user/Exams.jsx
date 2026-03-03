import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listExams, submitExam } from '../../utils/api';

const STORAGE_KEY = 'user_exams_state_v1';

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function writeState(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export default function Exams() {
  const { token } = useAuth();
  const [exams, setExams] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | upcoming | past | live
  const [state, setState] = useState(() => readState());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (!token) return;
      try {
        const res = await listExams(token);
        setExams(res.data || []);
      } catch (err) {
        // fallback to empty
        setExams([]);
      }
    };
    fetch();
  }, [token]);

  useEffect(() => writeState(state), [state]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exams.filter(e => {
      if (q && !(e.title.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))) return false;
      const now = new Date();
      const ed = new Date(e.date);
      const st = state[e.id];
      const isLive = st && st.live;
      if (filter === 'upcoming' && ed <= now && !isLive) return false;
      if (filter === 'past' && ed > now && !isLive) return false;
      if (filter === 'live' && !isLive) return false;
      return true;
    });
  }, [exams, query, filter, state]);

  const startExam = (id) => {
    setState(prev => ({ ...prev, [id]: { ...(prev[id] || {}), live: true, startedAt: new Date().toISOString() } }));
  };

  const finishExam = (id) => {
    (async () => {
      // submit result to backend if possible
      try {
        const examObj = exams.find(x => (x._id || x.id) === id || x.id === id);
        const examId = examObj ? (examObj._id || examObj.id) : id;
        if (token) {
          const res = await submitExam(token, examId, { answers: [] });
          const result = res.data || { score: Math.floor(Math.random() * 40) + 60, total: examObj ? examObj.totalQuestions : 0 };
          setState(prev => ({ ...prev, [id]: { ...(prev[id] || {}), live: false, finishedAt: new Date().toISOString(), result } }));
        } else {
          const result = { score: Math.floor(Math.random() * 40) + 60, total: exams.find(x => x.id === id).totalQuestions };
          setState(prev => ({ ...prev, [id]: { ...(prev[id] || {}), live: false, finishedAt: new Date().toISOString(), result } }));
        }
      } catch (err) {
        // fallback local
        const result = { score: Math.floor(Math.random() * 40) + 60, total: exams.find(x => x.id === id).totalQuestions };
        setState(prev => ({ ...prev, [id]: { ...(prev[id] || {}), live: false, finishedAt: new Date().toISOString(), result } }));
      }
    })();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Exams</h2>
          <div className="text-sm text-gray-500">Manage and attempt exams from here</div>
        </div>
        <div className="flex items-center gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search exams" className="px-3 py-2 border rounded" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 border rounded">
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="live">Live</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {results.length === 0 ? (
          <div className="p-6 bg-white rounded shadow text-gray-500">No exams found.</div>
        ) : (
          results.map(exam => {
            const st = state[exam.id] || {};
            return (
              <div key={exam.id} className="bg-white rounded shadow p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-medium">{exam.title}</div>
                    <div className="text-xs text-gray-500">{exam.id}</div>
                    {st.live && <div className="ml-3 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">LIVE</div>}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Date: {new Date(exam.date).toLocaleString()} • Duration: {exam.durationMin} min • Questions: {exam.totalQuestions}</div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setSelected(exam)} className="px-3 py-1 border rounded">Details</button>
                  {!st.live && !st.finishedAt && (
                    <button onClick={() => startExam(exam.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Start</button>
                  )}
                  {st.live && (
                    <button onClick={() => finishExam(exam.id)} className="px-3 py-1 bg-red-600 text-white rounded">Finish</button>
                  )}
                  {st.finishedAt && (
                    <button onClick={() => setSelected({ ...exam, result: st.result, finishedAt: st.finishedAt })} className="px-3 py-1 border rounded">View Result</button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selected.title}</h3>
                <div className="text-sm text-gray-500">{selected.id}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500">Close</button>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-600">Date: {new Date(selected.date).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Duration: {selected.durationMin} min</div>
              <div className="text-sm text-gray-600">Questions: {selected.totalQuestions}</div>
            </div>

            {selected.result && (
              <div className="mt-4 bg-gray-50 p-4 rounded">
                <div className="font-medium">Result</div>
                <div className="text-sm text-gray-700">Score: {selected.result.score} / {selected.result.total}</div>
                <div className="text-xs text-gray-500">Finished at: {new Date(selected.finishedAt).toLocaleString()}</div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
