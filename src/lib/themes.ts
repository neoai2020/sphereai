import { cn } from "@/lib/utils";

export interface ThemeStyles {
  section: string;
  card: string;
  heading: string;
  text: string;
  button: string;
  accent: string;
}

export function getThemeStyles(themeId: string = "1", primaryColor: string = "#4F46E5"): ThemeStyles {
  switch (themeId) {
    case "2": // Minimal Agency
      return {
        section: "py-24 px-6 bg-white",
        card: "bg-gray-50/50 p-8 rounded-none border-l-4 border-gray-900",
        heading: "text-4xl font-black text-gray-900 tracking-tighter uppercase",
        text: "text-lg text-gray-500 font-medium leading-relaxed",
        button: "px-10 py-4 bg-gray-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all",
        accent: "text-gray-900",
      };
    case "3": // Glass Modern
      return {
        section: "py-24 px-6 relative overflow-hidden bg-white",
        card: "bg-white/40 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl shadow-brand-500/10",
        heading: "text-5xl font-black text-gray-900 tracking-tight",
        text: "text-lg text-gray-600 font-medium",
        button: "px-8 py-4 rounded-2xl text-white font-black shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-brand-600 to-indigo-600",
        accent: "text-brand-600",
      };
    case "4": // Dark Tech
      return {
        section: "py-24 px-6 bg-gray-950 text-white",
        card: "bg-gray-900/50 border border-gray-800 p-8 rounded-3xl hover:border-brand-500/50 transition-colors",
        heading: "text-5xl font-black text-white tracking-widest uppercase",
        text: "text-lg text-gray-400 font-medium",
        button: "px-8 py-4 rounded-xl bg-white text-gray-950 font-black hover:bg-brand-500 hover:text-white transition-all",
        accent: "text-brand-400",
      };
    case "5": // Soft Elegant
      return {
        section: "py-24 px-6 bg-[#FAF9F6]",
        card: "bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100",
        heading: "text-4xl font-serif text-gray-900 italic",
        text: "text-lg text-gray-500 font-medium",
        button: "px-12 py-4 rounded-full bg-gray-900 text-white font-bold hover:shadow-xl transition-all",
        accent: "text-brand-700",
      };
    default: // SaaS Classic
      return {
        section: "py-24 px-6 bg-white",
        card: "bg-white border border-gray-100 p-8 rounded-3xl shadow-lg shadow-gray-200/20 hover:shadow-xl transition-all",
        heading: "text-4xl font-black text-gray-900",
        text: "text-lg text-gray-600 font-medium",
        button: "px-8 py-4 rounded-2xl bg-brand-600 text-white font-black shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all",
        accent: "text-brand-600",
      };
  }
}
