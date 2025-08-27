import TradingPageComponent from "@/components/TradingPageComponent";

export default async function ExnessTradingPlatform({
  params,
}: {
  params: Promise<{ asset: string }>;
}) {
  const asset = (await params).asset;

  return <TradingPageComponent asset={asset} />;
}