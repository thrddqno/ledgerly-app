import { create } from 'zustand'

type DropdownStore = {
    active: string | null
    open: (id: string) => void
    close: (id: string) => void
    toggle: (id: string) => void
    closeAll: () => void
}

export const useDropdownStore = create<DropdownStore>((set) => ({
    active: null,

    open: (id: string) => set({ active: id }),
    close: (id: string) =>
        set((state) => (state.active === id ? { active: null } : state)),
    toggle: (id: string) =>
        set((state) => ({
            active: state.active === id ? null : id,
        })),
    closeAll: () => set({ active: null }),
}))
