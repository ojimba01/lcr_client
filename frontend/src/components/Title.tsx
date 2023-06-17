import TitleIcon from "../assets/dice.svg";

import { Box, Heading } from "@chakra-ui/react";

export const TitleHeader: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      p={2.5}
    >
      <img
        src={TitleIcon}
        alt="Dice Icon"
        style={{ width: "24px", height: "24px", marginRight: "0.5rem" }}
      />
      <Heading>
        <a href="https://github.com/ojimba01/lcr_client">
          <b>LCR Online (v.1.0.1)</b>
        </a>
      </Heading>
    </Box>
  );
};
