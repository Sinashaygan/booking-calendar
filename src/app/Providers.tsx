"use client";

import { useState, useEffect } from "react";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "var(--font-vazirmatn), Arial, Helvetica, sans-serif",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
    },
    background: {
      default: "#f8fafc",
    },
  },
});

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    let isMounted = true;

    async function startMockWorker() {
      try {
        const { worker } = await import("./mocks/browser");

        if (isMounted) {
          await worker.start({
            onUnhandledRequest: "bypass",
          });
        }
      } catch (error) {
        console.error("[MSW] Failed to start browser worker", error);
      }
    }

    void startMockWorker();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
