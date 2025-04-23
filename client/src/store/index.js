import { create } from 'zustand';
import { createAuthSlice } from './auth_slice.js';
import { createJobSlice } from './jobs_slice.js';

export const useAppStore = create((...a) => ({
    ...createAuthSlice(...a),
    ...createJobSlice(...a)
}));
