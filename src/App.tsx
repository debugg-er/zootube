import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

import { ShowAuthFormProvider } from '@contexts/ShowAuthFormContext';
import { AuthProvider } from '@contexts/AuthContext';
import { ShowSidebarProvider } from '@contexts/ShowSidebarContext';
import { LoadingProvider } from '@contexts/LoadingContext';
import { SubscriptionsProvider } from '@contexts/SubscriptionsContext';
import { PlaylistsProvider } from '@contexts/PlaylistsContext';
import { MessageQueueProvider } from '@contexts/MessageQueueContext';
import { ConfirmProvider } from '@contexts/ConfirmContext';
import { PlaylistPopupProvider } from '@contexts/PlaylistPopupContext';

import Header from '@components/Header';
import PopupWrapper from '@components/PopupWrapper';
import Sidebar from '@components/Sidebar';
import Main from '@components/Main';

import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function AppContextWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ShowAuthFormProvider>
        <ShowSidebarProvider>
          <LoadingProvider>
            <SubscriptionsProvider>
              <PlaylistsProvider>
                <MessageQueueProvider timeout={5000}>
                  <ConfirmProvider>
                    <PlaylistPopupProvider>{children}</PlaylistPopupProvider>
                  </ConfirmProvider>
                </MessageQueueProvider>
              </PlaylistsProvider>
            </SubscriptionsProvider>
          </LoadingProvider>
        </ShowSidebarProvider>
      </ShowAuthFormProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <AppContextWrapper>
          <Header />
          <div className="App__Container">
            <Sidebar />
            <Main />
          </div>

          <PopupWrapper />
        </AppContextWrapper>
      </ThemeProvider>
    </div>
  );
}

export default App;
