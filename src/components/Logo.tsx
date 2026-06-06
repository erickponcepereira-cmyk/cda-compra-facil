import logoAsset from "@/assets/logo.asset.json";

export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return <img src={logoAsset.url} alt="Cia da Limpeza" className={className} />;
}
