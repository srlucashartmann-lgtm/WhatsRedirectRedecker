import Image from "next/image";
import { LocationHub } from "@/components/LocationHub";

export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0072da_0%,_#003e89_42%,_#002456_100%)]" />
        <div className="absolute -left-24 top-24 size-72 rounded-full bg-[var(--brand-yellow)]/15 blur-3xl" />
        <div className="absolute -right-16 bottom-10 size-80 rounded-full bg-[var(--brand-green)]/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, transparent 0 46%, #be1622 46% 54%, transparent 54%), linear-gradient(135deg, transparent 0 58%, #ffea22 58% 66%, transparent 66%), linear-gradient(135deg, transparent 0 70%, #00a759 70% 78%, transparent 78%)",
            backgroundSize: "220% 220%",
            backgroundPosition: "12% 0%",
          }}
        />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-2 pt-10 text-center sm:pt-14">
        <div className="float-soft mb-8 rounded-2xl bg-black/25 px-5 py-4 backdrop-blur-sm ring-1 ring-white/15">
          <Image
            src="/logos/logo-fundos-escuros.png"
            alt="Lucas Redecker — Deputado Federal"
            width={420}
            height={140}
            priority
            className="h-auto w-[min(78vw,320px)]"
          />
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-yellow)]">
          Rio Grande do Sul
        </p>
        <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight text-white sm:text-5xl">
          Encontre o grupo da sua região
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">
          Receba informações e acompanhe o trabalho do Deputado Lucas Redecker
          com gente da sua cidade e do seu vale.
        </p>
      </header>

      <LocationHub />

      <footer className="relative z-10 mt-auto border-t border-white/10 px-4 py-6 text-center text-xs text-blue-100/70">
        <p>Deputado Federal Lucas Redecker · Grupos regionais no Rio Grande do Sul</p>
        <p className="mt-1">
          Sua localização não é armazenada — serve só para indicar o grupo certo.
        </p>
      </footer>
    </main>
  );
}
