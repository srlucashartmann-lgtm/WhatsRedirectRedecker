import { NextResponse } from "next/server";

type NominatimResponse = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
  };
  display_name?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Informe lat e lon." },
      { status: 400 },
    );
  }

  const latNum = Number(lat);
  const lonNum = Number(lon);

  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
    return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "json");
  url.searchParams.set("lat", String(latNum));
  url.searchParams.set("lon", String(lonNum));
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "pt-BR");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "redirect-whats-lucas-redecker/1.0 (grupos regionais)",
        Accept: "application/json",
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Não foi possível identificar a localização." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as NominatimResponse;
    const address = data.address ?? {};
    const cityName =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      null;

    return NextResponse.json({
      cityName,
      state: address.state ?? null,
      displayName: data.display_name ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Falha ao consultar o serviço de localização." },
      { status: 502 },
    );
  }
}
