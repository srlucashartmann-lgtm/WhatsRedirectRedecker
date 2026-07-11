"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  findCityByName,
  resolveGroupForCity,
  searchCities,
  type City,
} from "@/lib/cities";
import type { WhatsGroup } from "@/data/groups";

type FlowState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "ready"; city: City; group: WhatsGroup; source: "geo" | "manual" }
  | { status: "error"; message: string };

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function LocationHub() {
  const [flow, setFlow] = useState<FlowState>({ status: "idle" });
  const [query, setQuery] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputId = useId();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => searchCities(query, 10), [query]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  function selectCity(city: City, source: "geo" | "manual") {
    const group = resolveGroupForCity(city);
    setFlow({ status: "ready", city, group, source });
    setManualOpen(false);
    setQuery("");
  }

  function openManual() {
    setManualOpen(true);
    setFlow({ status: "idle" });
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function requestLocation() {
    if (!navigator.geolocation) {
      setFlow({
        status: "error",
        message:
          "Este navegador não libera a localização. Sem problema, digite sua cidade abaixo.",
      });
      setManualOpen(true);
      return;
    }

    setFlow({ status: "locating" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`,
          );
          const data = (await res.json()) as {
            cityName?: string | null;
            error?: string;
          };

          if (!res.ok || !data.cityName) {
            throw new Error(data.error || "Cidade não encontrada");
          }

          const city = findCityByName(data.cityName);
          if (!city) {
            setFlow({
              status: "error",
              message: `Encontramos “${data.cityName}”, mas ela não bateu com a lista do RS. Busque sua cidade pelo nome.`,
            });
            setManualOpen(true);
            setQuery(data.cityName);
            return;
          }

          selectCity(city, "geo");
        } catch {
          setFlow({
            status: "error",
            message:
              "Não conseguimos identificar sua cidade agora. Digite o nome dela abaixo.",
          });
          setManualOpen(true);
        }
      },
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED;
        setFlow({
          status: "error",
          message: denied
            ? "Tudo bem se preferir não compartilhar a localização. É só buscar sua cidade."
            : "A localização não respondeu a tempo. Busque sua cidade pelo nome.",
        });
        setManualOpen(true);
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const city = suggestions[highlight];
      if (city) selectCity(city, "manual");
    } else if (event.key === "Escape") {
      setQuery("");
    }
  }

  return (
    <section
      className="relative z-10 mx-auto w-full max-w-xl px-4 pb-16 pt-2 sm:px-6"
      aria-labelledby="hub-title"
    >
      <div className="rounded-3xl border border-white/15 bg-white shadow-[0_24px_80px_rgba(0,62,137,0.28)]">
        <div className="overflow-hidden rounded-t-3xl border-b border-[var(--brand-blue)]/10 bg-gradient-to-br from-[#f3f8ff] via-white to-[#eefbf4] px-5 py-6 sm:px-8 sm:py-8">
          <p className="mb-3 inline-flex max-w-full items-start gap-2 rounded-2xl bg-[var(--brand-blue)]/8 px-3 py-1.5 text-left text-xs font-semibold leading-snug tracking-wide text-[var(--brand-blue)] sm:items-center">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 sm:mt-0" aria-hidden />
            Sua localização não é armazenada, usamos só para achar o melhor grupo para você
          </p>
          <h2
            id="hub-title"
            className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-[var(--brand-navy)] sm:text-3xl"
          >
            Como entrar no grupo certo
          </h2>

          <ol className="mt-5 space-y-2.5 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-xs font-bold text-white">
                1
              </span>
              <span>Informe sua localização ou digite sua cidade.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-xs font-bold text-white">
                2
              </span>
              <span>A gente indica o grupo do seu vale ou região.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-xs font-bold text-white">
                3
              </span>
              <span>Você entra no WhatsApp e passa a receber as novidades.</span>
            </li>
          </ol>

          <p className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm leading-relaxed text-slate-600">
            <Info
              className="mt-0.5 size-4 shrink-0 text-[var(--brand-blue)]"
              aria-hidden
            />
            <span>
              <strong className="font-semibold text-slate-800">O que é este grupo:</strong>{" "}
              canal de avisos do Deputado para a sua região.{" "}
              <strong className="font-semibold text-slate-800">Não é</strong> um
              grupo de conversa entre participantes.
            </span>
          </p>
        </div>

        <div className={`space-y-4 px-5 py-6 sm:px-8 ${query.trim().length > 0 ? "pb-8 sm:pb-10" : "sm:py-8"}`}>
          {flow.status !== "ready" && (
            <button
              type="button"
              onClick={requestLocation}
              disabled={flow.status === "locating"}
              className="group flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[var(--brand-blue)] px-5 text-base font-semibold text-white transition duration-200 hover:bg-[var(--brand-navy)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-blue)]/35 disabled:cursor-wait disabled:opacity-80"
            >
              {flow.status === "locating" ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                  Buscando sua região…
                </>
              ) : (
                <>
                  <MapPin className="size-5 transition group-hover:scale-110" aria-hidden />
                  Continuar com minha localização
                </>
              )}
            </button>
          )}

          {flow.status === "error" && (
            <p
              role="alert"
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            >
              {flow.message}
            </p>
          )}

          {flow.status === "ready" && (
            <div className="animate-in space-y-4 rounded-2xl border border-[var(--brand-green)]/25 bg-[var(--brand-green)]/5 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 size-6 shrink-0 text-[var(--brand-green)]"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {flow.source === "geo"
                      ? "Encontramos você em"
                      : "Você escolheu"}
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--brand-navy)]">
                    {flow.city.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Pronto. O grupo indicado para você é{" "}
                    <span className="font-semibold text-[var(--brand-blue)]">
                      {flow.group.name}
                    </span>
                    . Toque abaixo para entrar no WhatsApp.
                  </p>
                </div>
              </div>

              <a
                href={flow.group.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[var(--brand-green)] px-5 text-base font-bold text-white shadow-[0_12px_30px_rgba(0,167,89,0.35)] transition duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-green)]/40 active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-6" />
                Entrar no grupo de WhatsApp
                <ArrowRight className="size-5" aria-hidden />
              </a>

              <button
                type="button"
                onClick={openManual}
                className="min-h-11 w-full cursor-pointer rounded-xl px-3 text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-[var(--brand-navy)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/40"
              >
                Essa não é minha cidade
              </button>
            </div>
          )}

          {(manualOpen || flow.status === "idle" || flow.status === "error") &&
            flow.status !== "ready" && (
              <div className="space-y-3">
                <div className="relative flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    ou digite sua cidade
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />
                    <input
                      ref={inputRef}
                      id={inputId}
                      type="search"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setManualOpen(true);
                      }}
                      onKeyDown={onSearchKeyDown}
                      autoComplete="off"
                      inputMode="search"
                      placeholder="Digite aqui… Ex.: Montenegro"
                      aria-label="Buscar município"
                      role="combobox"
                      aria-expanded={suggestions.length > 0}
                      aria-controls={listId}
                      aria-autocomplete="list"
                      className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-blue)] focus:ring-4 focus:ring-[var(--brand-blue)]/20"
                    />
                  </div>

                  {query.trim().length > 0 && (
                    <ul
                      id={listId}
                      role="listbox"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
                    >
                      {suggestions.length === 0 ? (
                        <li className="px-3 py-3 text-sm text-slate-500">
                          Não achamos essa cidade. Confira se o nome está certo.
                        </li>
                      ) : (
                        suggestions.map((city, index) => {
                          const active = index === highlight;
                          return (
                            <li key={city.id} role="option" aria-selected={active}>
                              <button
                                type="button"
                                onMouseEnter={() => setHighlight(index)}
                                onClick={() => selectCity(city, "manual")}
                                className={`flex min-h-12 w-full cursor-pointer items-center rounded-xl px-3 py-2.5 text-left transition ${
                                  active
                                    ? "bg-[var(--brand-blue)] text-white"
                                    : "hover:bg-slate-50"
                                }`}
                              >
                                <span className="font-semibold">{city.name}</span>
                              </button>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}

          {flow.status === "ready" && !manualOpen && (
            <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <MessageCircle className="size-3.5" aria-hidden />
              Depois de entrar, você só recebe avisos. Não precisa responder.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
