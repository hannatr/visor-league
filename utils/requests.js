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
async function fetchPlayers(leagueOnly = false) {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/players`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch players");
    }

    const players = await res.json();

    if (leagueOnly) {
      return players.filter(
        (player) => player.player_id >= 1 && player.player_id <= 10
      );
    }

    return players;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetch all tournaments
async function fetchTournaments({ current = false, season = "" } = {}) {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    let url = `${apiDomain}/tournaments`;
    if (current) {
      url += "/current";
    } else if (season !== "") {
      url += `/season/${season}`;
    }

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch tournaments");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function updateScore({ scorecard_id, holeNumber, score }) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token"); // Retrieve the token from the URL

    let url = `${apiDomain}/tournaments`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token, // Include the token in the request headers
      },
      body: JSON.stringify({ scorecard_id, holeNumber, score }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update score: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export { fetchResults, fetchPlayers, fetchTournaments, updateScore };
