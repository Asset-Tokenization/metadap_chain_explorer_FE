import type { TokenTransfer } from "types/api/tokenTransfer";

export const getTokenTransferTypeText = (type: TokenTransfer["type"]) => {
  switch (type) {
    case "token_minting":
      return "Certificate minting";
    case "token_burning":
      return "Certificate burning";
    case "token_spawning":
      return "Certificate creating";
    case "token_transfer":
      return "Certificate transfer";
  }
};
