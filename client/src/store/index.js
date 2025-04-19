import { create } from 'zustand';
import { createAuthSlice } from './auth_slice.js';

export const useAppStore = create((...a) => ({
    ...createAuthSlice(...a),
}));
