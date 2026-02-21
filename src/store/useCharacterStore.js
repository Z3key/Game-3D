import { create } from 'zustand';

export const useCharacterStore = create((set) => ({
    currentAction: 'idle',
    setAction: (actionName) => set(() => ({ currentAction: actionName })),

    speed: 1.5,
    setSpeed: (value) => set(() => ({ speed: value })),

    position: [0, 0, 0],
    setPosition: (pos) => set((state) => ({
        position: typeof pos == 'function' ? pos(state.position) : pos
    })),

    rotation: 0,
    setRotation: (angle) => set({ rotation: angle }),
}));