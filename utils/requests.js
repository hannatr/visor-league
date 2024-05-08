const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch all results
async function fetchResults({ current = false, season = "" } = {}) {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    let url = `${apiDomain}/results`;
    if (current) {
      url += "/current";
    } else if (season !== "") {
      url += `/season/${season}`;
    }

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch results");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetch all players
async function fetchPlayers() {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/players`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch players");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}
export { fetchResults, fetchPlayers };
