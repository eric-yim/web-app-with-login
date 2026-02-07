/**
 * Root layout for React Router framework mode
 */

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import { ChakraProvider, defaultSystem, Box, Heading, Text } from "@chakra-ui/react";
import { AuthProvider } from "../src/context/AuthContext";

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Theme color */}
        <meta name="theme-color" content="#6B46C1" />

        {/* SEO */}
        <meta name="description" content="FILLIN_APP_DESCRIPTION" />
        <meta property="og:title" content="FILLIN_APP_TITLE" />
        <meta property="og:description" content="FILLIN_APP_OG_DESCRIPTION" />
        <meta property="og:type" content="website" />

        <Meta />
        <Links />
      </head>
      <body>
        <ChakraProvider value={defaultSystem}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ChakraProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404
      ? "The requested page could not be found."
      : error.statusText || details;
  } else if (error && error instanceof Error) {
    details = error.message;
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Box textAlign="center" p="8">
        <Heading size="4xl" color="gray.700">{message}</Heading>
        <Text mt="4" color="gray.500">{details}</Text>
      </Box>
    </Box>
  );
}
