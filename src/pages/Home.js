import React from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import { Grid, GridItem } from "@chakra-ui/react";

function Home() {
  return (
    <div>
      <Grid templateColumns="repeat(4, 1fr)" gap="6">
        <GridItem colSpan={1}></GridItem>
        <GridItem colSpan={2}>
          <Navbar />
          <Search />
        </GridItem>
        <GridItem colSpan={1}></GridItem>
      </Grid>
    </div>
  );
}

export default Home;
