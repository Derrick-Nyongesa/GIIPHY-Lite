import React from "react";
import LogoImage from "../images/logo.png";
import { Flex, Image, Text } from "@chakra-ui/react";

function Navbar() {
  return (
    <Flex
      as="nav"
      px={9}
      py={3}
      align="center"
      style={{ backgroundColor: "#333333" }}
    >
      <Flex align="center" gap={3}>
        <Image
          src={LogoImage}
          alt="Giphy Clone logo"
          boxSize="48px"
          objectFit="contain"
        />
        <Text
          as="h1"
          fontSize="4xl"
          fontWeight="bold"
          style={{ color: "#FFFFFF" }}
        >
          GIPHY-CLONE
        </Text>
      </Flex>
    </Flex>
  );
}

export default Navbar;
