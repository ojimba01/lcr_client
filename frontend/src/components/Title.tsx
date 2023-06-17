import TitleIcon from "../assets/dice.svg";
import { Box, Heading } from "@chakra-ui/react";

export const TitleHeader: React.FC = () => {
  return (
    <Box display="flex" alignItems="center">
      <img
        src={TitleIcon}
        alt="Dice Icon"
        style={{ width: "24px", height: "24px", marginRight: "0.5rem" }}
      />
      <Heading>LCR Online (v.1.0.1)</Heading>
    </Box>
  );
};
