import { createContext, useContext, useState, type ReactNode } from "react";

interface ExtensionState {
  container: any;
  isOpen: boolean;
  theme: string | null;
  loading: boolean;
  panel: string;
  videoId: string;
  data: any;
}

const initialState: ExtensionState = {
  container: null,
  isOpen: false,
  theme: null,
  loading: false,
  panel: 'summary',
  videoId: '',
  data: null,
}

interface ExtensionAction {
  setContainer: (container: any) => void;
  setIsOpen: (isOpen: boolean) => void;
  setTheme: (theme: string | null) => void;
  setLoading: (loading: boolean) => void;
  setPanel: (panel: string) => void;
  setVideoId: (videoId: string) => void;
  setData: (data: any) => void;
  resetExtension: () => void;
}

interface ExtensionContext extends ExtensionState, ExtensionAction {}

const ExtensionContext = createContext<ExtensionContext | undefined>(undefined);

export function useExtension() {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error('useExtension must be used within an ExtensionProvider');
  }
  return context;
}

export function ExtensionProvider({ children }: { children: ReactNode }) {
  const [container, setContainer] = useState<any>(initialState.container);
  const [isOpen, setIsOpen] = useState<boolean>(initialState.isOpen);
  const [theme, setTheme] = useState<string | null>(initialState.theme);
  const [loading, setLoading] = useState<boolean>(initialState.loading);
  const [panel, setPanel] = useState<string>(initialState.panel);
  const [videoId, setVideoId] = useState<string>(initialState.videoId);
  const [data, setData] = useState<any>(initialState.data);

  const value = {
    container,
    isOpen,
    theme,
    loading,
    panel,
    videoId,
    data,
    setContainer,
    setIsOpen,
    setTheme,
    setLoading,
    setPanel,
    setVideoId,
    setData,
    resetExtension: () => {
      setContainer(initialState.container);
      setIsOpen(initialState.isOpen);
      setTheme(initialState.theme);
      setLoading(initialState.loading);
      setPanel(initialState.panel);
      setVideoId(initialState.videoId);
      setData(initialState.data);
    },
  };

  return <ExtensionContext.Provider value={value}>{children}</ExtensionContext.Provider>;
}
