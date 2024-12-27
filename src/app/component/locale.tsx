"use client"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocaleState {
    locale: string;
    change: (newLocale : string) => void;
}

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: "contentJSONEng",
            change: (newLocale : string) =>
                set(() => ({
                    locale: newLocale
                })),
        }),
        {
            name: "locale-store", // Name for the storage key in localStorage
        }
    )
);
