// src/ChakraProviderWrapper.jsx
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./system";

export default function ChakraProviderWrapper({ children }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
