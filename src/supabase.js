import { createClient } from "@supabase/supabase-js";

// Placeholder credentials – replace with your real Supabase project details.
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

let supabase;
if (SUPABASE_URL.includes("YOUR-PROJECT")) {
  // Simple mock with persistence via localStorage and chained .order() support.
  const STORAGE_KEY = "mock_recruiters_data";
  let mockData = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) mockData = JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load mock data from localStorage", e);
  }
  let nextId = mockData.length > 0 ? Math.max(...mockData.map(r => r.id)) + 1 : 1;
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData)); } catch (e) { console.error("Failed to save mock data", e); }
  };
  const mockTable = {
    select: () => {
      const result = {
        order: (col, opts) => {
          const sorted = [...mockData].sort((a, b) => {
            if (opts && opts.ascending) return a[col] - b[col];
            return b[col] - a[col];
          });
          return Promise.resolve({ data: sorted, error: null });
        },
        // If .order is not called, behave like normal select.
        then: (resolve) => resolve({ data: mockData.slice(), error: null })
      };
      return result;
    },
    insert: (rows) => {
      rows = Array.isArray(rows) ? rows : [rows];
      rows.forEach((row) => {
        row.id = nextId++;
        mockData.push(row);
      });
      save();
      return Promise.resolve({ data: rows, error: null });
    },
    update: (updates) => ({
      eq: (col, val) => {
        const record = mockData.find((r) => r[col] === val);
        if (record) Object.assign(record, updates);
        save();
        return Promise.resolve({ data: record ? [record] : [], error: null });
      },
    }),
    delete: () => ({
      eq: (col, val) => {
        const idx = mockData.findIndex((r) => r[col] === val);
        if (idx !== -1) mockData.splice(idx, 1);
        save();
        return Promise.resolve({ data: null, error: null });
      },
    }),
  };
  supabase = { from: () => mockTable };
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { supabase };
