"use client"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocaleState {
    locale: string;
    change: () => void;
}

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: "contentJSONEng",
            change: () =>
                set((state) => ({
                    locale:
                        state.locale === "contentJSONEng"
                            ? "contentJSONIndo"
                            : "contentJSONEng",
                })),
        }),
        {
            name: "locale-store", // Name for the storage key in localStorage
        }
    )
);
