import React from "react";
import LogoImage from "../images/logo.png";
import { Flex, Image, Text } from "@chakra-ui/react";

function Navbar() {
  return (
    <Flex as="nav">
      <Flex align="center" gap={3}>
        <Image
          src={LogoImage}
          alt="Giphy Clone logo"
          boxSize="48px"
          objectFit="contain"
        />
        <Text as="h1" fontSize="4xl" fontWeight="bold">
          GIPHY-CLONE
        </Text>
      </Flex>
    </Flex>
  );
}

export default Navbar;
