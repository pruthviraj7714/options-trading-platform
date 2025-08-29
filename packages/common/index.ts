import z from "zod";

export const SignupSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Password Should be at least of 6 characters" }),
});

export const SigninSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Password Should be at least of 6 characters" }),
});

export const OrderSchema = z.object({
  volume : z.number().min(0, {message : "Volume Must be greater than 0"}),
  asset : z.string(),
  side : z.enum(["BUY", "SELL"]),
})


export const SUPPORTED_MARKETS = [
  {
    symbol: "BTCUSDT",
    name: "Bitcoin",
    logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    color: "#F7931A",
  },
  {
    symbol: "ETHUSDT",
    name: "Ethereum",
    logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    color: "#627EEA",
  },
  {
    symbol: "SOLUSDT",
    name: "Solana",
    logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    color: "#9945FF",
  },
];
