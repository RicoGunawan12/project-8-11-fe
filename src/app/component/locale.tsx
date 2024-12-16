"use client"
import { create } from 'zustand'

interface LocaleState {
    locale: string;
    change: () => void;
  }
  

// Simple counter store
export const useLocaleStore = create<LocaleState>((set) => ({
  locale: "contentJSONEng",

  // Action to change locale
  change: () => set((state : any) => ({
    locale: state.locale === "contentJSONEng" 
      ? "contentJSONIndo" 
      : "contentJSONEng"
  }))
}));

const LocaleButton = () => {

    const {locale, change} = useLocaleStore()

    return (
        <button
    onClick={change}
    className="fixed bottom-4 right-4 bg-secondary text-white text-sm py-2 px-4 w-12 h-12 aspect-square shadow-lg rounded-full flex items-center justify-center transition-all"
>
    {locale === "contentJSONEng" ? "ID" : "EN"}
</button>
    );
};

export default LocaleButton