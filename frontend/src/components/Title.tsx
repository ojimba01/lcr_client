import TitleIcon from "../assets/dice.svg";
import { Box, Heading, Link } from "@chakra-ui/react";

export const TitleHeader: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
    >
      <Box mr={2}>
        <img
          src={TitleIcon}
          alt="Dice Icon"
          style={{ width: "24px", height: "24px" }}
        />
      </Box>
      <Box>
        <Heading as="h1" size="2xl" textAlign={{ base: "center", md: "left" }}>
          <Link href="https://github.com/ojimba01/lcr_client" fontWeight="bold">
            LCR Online (v.1.0.1)
          </Link>
        </Heading>
      </Box>
    </Box>
  );
};
