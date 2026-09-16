/**
 * Collection $jsonSchema validators. Applied with
 * validationLevel: moderate, validationAction: warn.
 * Re-run: node --env-file=.env.local scripts/apply-mongo-validation.mjs
 */
export const NUMBER = ["int", "long", "double"];

export const collectionValidators = {
  admin: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "password"],
      properties: {
        username: { bsonType: "string", minLength: 1 },
        password: { bsonType: "string", minLength: 1 },
      },
    },
  },
  players: {
    $jsonSchema: {
      bsonType: "object",
      required: ["player_id", "name"],
      properties: {
        player_id: { bsonType: NUMBER },
        name: { bsonType: "string", minLength: 1 },
        in_league: { bsonType: "bool" },
        start_year: { bsonType: NUMBER },
      },
    },
  },
  results: {
    $jsonSchema: {
      bsonType: "object",
      required: ["season", "current", "events"],
      properties: {
        season: { bsonType: NUMBER },
        current: { bsonType: "bool" },
        events: {
          bsonType: "array",
          maxItems: 40,
          items: {
            bsonType: "object",
            required: ["id", "name", "description", "date", "results"],
            properties: {
              id: { bsonType: NUMBER },
              name: { bsonType: "string" },
              description: { bsonType: "string" },
              date: { bsonType: "string" },
              results: {
                bsonType: "array",
                maxItems: 50,
                items: {
                  bsonType: "object",
                  required: ["player", "raw", "points"],
                  properties: {
                    player: { bsonType: NUMBER },
                    raw: { bsonType: NUMBER },
                    points: { bsonType: NUMBER },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  tournaments: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "year",
        "title",
        "date",
        "current",
        "course",
        "time",
        "holes",
        "scorecards",
      ],
      properties: {
        year: { bsonType: NUMBER },
        title: { bsonType: "string", minLength: 1 },
        date: { bsonType: "string" },
        current: { bsonType: "bool" },
        course: { bsonType: "string" },
        time: { bsonType: "string" },
        winner: { bsonType: "string" },
        holes: {
          bsonType: "array",
          maxItems: 18,
          items: {
            bsonType: "object",
            required: ["holeNumber", "par", "handicap"],
            properties: {
              holeNumber: { bsonType: NUMBER },
              par: { bsonType: NUMBER },
              handicap: { bsonType: NUMBER },
            },
          },
        },
        scorecards: {
          bsonType: "array",
          maxItems: 32,
          items: {
            bsonType: "object",
            required: ["scorecard_id", "team", "playerIds", "scores"],
            properties: {
              scorecard_id: { bsonType: NUMBER },
              team: { bsonType: "string" },
              tee_time: { bsonType: "string" },
              playerIds: {
                bsonType: "array",
                maxItems: 8,
                items: { bsonType: NUMBER },
              },
              scores: {
                bsonType: "array",
                maxItems: 18,
                items: {
                  bsonType: "object",
                  required: ["holeNumber", "score"],
                  properties: {
                    holeNumber: { bsonType: NUMBER },
                    score: { bsonType: NUMBER },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "dfs-results": {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "season",
        "current",
        "weeks",
        "season_places",
        "weekly_places",
        "players",
      ],
      properties: {
        season: { bsonType: NUMBER },
        current: { bsonType: "bool" },
        weeks: { bsonType: NUMBER },
        season_places: { bsonType: NUMBER },
        weekly_places: { bsonType: NUMBER },
        players: {
          bsonType: "array",
          maxItems: 100,
          items: {
            bsonType: "object",
            required: ["name", "scores"],
            properties: {
              name: { bsonType: "string", minLength: 1 },
              scores: {
                bsonType: "array",
                maxItems: 30,
                items: { bsonType: NUMBER },
              },
            },
          },
        },
      },
    },
  },
};
