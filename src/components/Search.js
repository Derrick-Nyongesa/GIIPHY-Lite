import React, { useState } from "react";
import { Flex, Input, IconButton } from "@chakra-ui/react";

export default function Search({ onSearch }) {
  const [q, setQ] = useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(q);
    else console.log("search:", q);
  };

  return (
    <Flex width="100%" maxW="640px" align="center">
      <Input
        placeholder="Search all the GIFs and Stickers"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        h="40px"
        borderRightRadius="0"
        // optional: set consistent border color
        borderColor="gray.200"
      />

      <IconButton
        aria-label="Search"
        onClick={handleSearch}
        h="40px"
        w="40px"
        minW="40px"
        borderLeftRadius="0"
        // remove the left border so the seam is flush (no double border)
        borderLeft="0"
        // match the rest of the border so it looks like one control
        border="1px solid"
        borderColor="gray.200"
        bg="#FF69B4"
        _hover={{ bg: "#ff4da6" }}
        // remove boxShadow if you want perfectly flush edges
        boxShadow="none"
      >
        {/* Inline SVG with explicit stroke/fill set to white */}
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            cx="11"
            cy="11"
            r="6.3"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="16.5"
            y1="16.5"
            x2="21"
            y2="21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </IconButton>
    </Flex>
  );
}
