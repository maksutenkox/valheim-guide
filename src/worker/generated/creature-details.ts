export type GeneratedCreatureResistance = {
  type: string;
  level: "weak" | "very-weak" | "resistant" | "very-resistant" | "immune" | "ignore";
};

export type GeneratedCreatureDrop = {
  name: string;
  chance: string | null;
  amount: string | null;
};

export type GeneratedCreatureDetail = {
  health: number;
  image_url: string | null;
  resistances: GeneratedCreatureResistance[];
  drops: GeneratedCreatureDrop[];
};

// Versioned combat snapshot. Data is verified before committing so production does not
// depend on third-party pages being reachable from Cloudflare or GitHub Actions.
export const generatedCreatureDetails: Record<string, GeneratedCreatureDetail> = {
  "eikthyr": {
    "health": 500,
    "image_url": null,
    "resistances": [],
    "drops": [
      {
        "name": "Eikthyr Trophy",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Hard Antler",
        "chance": "100%",
        "amount": "3"
      }
    ]
  },
  "the-elder": {
    "health": 2500,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "very-weak"
      },
      {
        "type": "poison",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "The Elder Trophy",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Swamp Key",
        "chance": "100%",
        "amount": "1"
      }
    ]
  },
  "bonemass": {
    "health": 5000,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "weak"
      },
      {
        "type": "slash",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "very-resistant"
      },
      {
        "type": "fire",
        "level": "very-resistant"
      },
      {
        "type": "frost",
        "level": "weak"
      },
      {
        "type": "poison",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Bonemass Trophy",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Wishbone",
        "chance": "100%",
        "amount": "1"
      }
    ]
  },
  "moder": {
    "health": 7500,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "weak"
      },
      {
        "type": "frost",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Moder Trophy",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Dragon Tear",
        "chance": "100%",
        "amount": "10"
      }
    ]
  },
  "yagluth": {
    "health": 10000,
    "image_url": null,
    "resistances": [
      {
        "type": "pierce",
        "level": "very-resistant"
      },
      {
        "type": "fire",
        "level": "resistant"
      },
      {
        "type": "poison",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Yagluth Trophy",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Torn Spirit",
        "chance": "100%",
        "amount": "3"
      }
    ]
  },
  "the-queen": {
    "health": 12500,
    "image_url": null,
    "resistances": [
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "The Queen Trophy",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Majestic Carapace",
        "chance": "100%",
        "amount": "5"
      }
    ]
  },
  "fader": {
    "health": 25000,
    "image_url": null,
    "resistances": [
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "fire",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Fader Trophy",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Kindled Ribs",
        "chance": "100%",
        "amount": "5"
      }
    ]
  },
  "kall-fimbulbringer": {
    "health": 52800,
    "image_url": null,
    "resistances": [
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "fire",
        "level": "resistant"
      },
      {
        "type": "frost",
        "level": "resistant"
      },
      {
        "type": "lightning",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Sacrificial Blood",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Crown Jewel",
        "chance": "100%",
        "amount": "1"
      }
    ]
  },
  "morgen": {
    "health": 1600,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "resistant"
      },
      {
        "type": "slash",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "fire",
        "level": "resistant"
      },
      {
        "type": "lightning",
        "level": "weak"
      }
    ],
    "drops": [
      {
        "name": "Morgen Sinew",
        "chance": "100%",
        "amount": "1-2"
      },
      {
        "name": "Morgen Heart",
        "chance": "80%",
        "amount": "1"
      },
      {
        "name": "Morgen Trophy",
        "chance": "5%",
        "amount": "1"
      }
    ]
  },
  "fallen-valkyrie": {
    "health": 1500,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "resistant"
      },
      {
        "type": "poison",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "weak"
      }
    ],
    "drops": [
      {
        "name": "Celestial Feather",
        "chance": "100%",
        "amount": "2-4"
      },
      {
        "name": "Fallen Valkyrie Trophy",
        "chance": "5%",
        "amount": "1"
      }
    ]
  },
  "asksvin": {
    "health": 800,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "resistant"
      },
      {
        "type": "poison",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Asksvin Bladder",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Asksvin Hide",
        "chance": "100%",
        "amount": "2-3"
      },
      {
        "name": "Asksvin Tail",
        "chance": "100%",
        "amount": "2-3"
      },
      {
        "name": "Asksvin Trophy",
        "chance": "10%",
        "amount": "1"
      }
    ]
  },
  "barka": {
    "health": 2200,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "resistant"
      },
      {
        "type": "slash",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "fire",
        "level": "weak"
      },
      {
        "type": "frost",
        "level": "resistant"
      },
      {
        "type": "lightning",
        "level": "resistant"
      },
      {
        "type": "poison",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Frozen Branch",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Barka Trophy",
        "chance": "10%",
        "amount": "1"
      }
    ]
  },
  "hexen": {
    "health": 800,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "weak"
      },
      {
        "type": "frost",
        "level": "very-resistant"
      },
      {
        "type": "poison",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Nornathread",
        "chance": "100%",
        "amount": "1-3"
      },
      {
        "name": "Hexen Trophy",
        "chance": "10%",
        "amount": "1"
      },
      {
        "name": "Intricate Key",
        "chance": "10%",
        "amount": "1"
      }
    ]
  },
  "eyeless-one": {
    "health": 1400,
    "image_url": null,
    "resistances": [
      {
        "type": "frost",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Long Claws",
        "chance": "100%",
        "amount": "1-2"
      },
      {
        "name": "Eyeless One Trophy",
        "chance": "10%",
        "amount": "1"
      },
      {
        "name": "Mould: Intricate Key",
        "chance": "50%",
        "amount": "1"
      }
    ]
  },
  "elaking": {
    "health": 350,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "weak"
      },
      {
        "type": "frost",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Elaking Hair Bundle",
        "chance": "100%",
        "amount": "1-2"
      },
      {
        "name": "Elaking Trophy",
        "chance": "10%",
        "amount": "1"
      },
      {
        "name": "Mould: Intricate Key",
        "chance": "20%",
        "amount": "1"
      }
    ]
  },
  "seal": {
    "health": 400,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "weak"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Seal Pelt",
        "chance": "100%",
        "amount": "2-3"
      },
      {
        "name": "Seal Blubber",
        "chance": "100%",
        "amount": "2-3"
      },
      {
        "name": "Seal Trophy",
        "chance": "10%",
        "amount": "1"
      }
    ]
  },
  "stone-golem": {
    "health": 800,
    "image_url": null,
    "resistances": [
      {
        "type": "slash",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "pickaxe",
        "level": "very-weak"
      },
      {
        "type": "fire",
        "level": "immune"
      },
      {
        "type": "frost",
        "level": "immune"
      },
      {
        "type": "poison",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Stone",
        "chance": "100%",
        "amount": "5-10"
      },
      {
        "name": "Crystal",
        "chance": "100%",
        "amount": "8-12"
      },
      {
        "name": "Stone Golem Trophy",
        "chance": "5%",
        "amount": "1"
      }
    ]
  },
  "abomination": {
    "health": 800,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "very-resistant"
      },
      {
        "type": "fire",
        "level": "weak"
      },
      {
        "type": "frost",
        "level": "immune"
      },
      {
        "type": "poison",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Root",
        "chance": "100%",
        "amount": "5"
      },
      {
        "name": "Guck",
        "chance": "100%",
        "amount": "3-5"
      },
      {
        "name": "Abomination Trophy",
        "chance": "50%",
        "amount": "1"
      }
    ]
  },
  "troll": {
    "health": 600,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "weak"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Coins",
        "chance": "100%",
        "amount": "20-30"
      },
      {
        "name": "Troll Hide",
        "chance": "100%",
        "amount": "5"
      },
      {
        "name": "Troll Trophy",
        "chance": "50%",
        "amount": "1"
      }
    ]
  },
  "seeker": {
    "health": 200,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "resistant"
      },
      {
        "type": "slash",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Seeker Meat",
        "chance": "100%",
        "amount": "1-2"
      },
      {
        "name": "Carapace",
        "chance": "100%",
        "amount": "1-2"
      },
      {
        "name": "Seeker Trophy",
        "chance": "5%",
        "amount": "1"
      }
    ]
  },
  "tick": {
    "health": 50,
    "image_url": null,
    "resistances": [
      {
        "type": "pierce",
        "level": "weak"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Blood Clot",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Tick Trophy",
        "chance": "5%",
        "amount": "1"
      }
    ]
  },
  "aspect-of-the-lightning-stag": {
    "health": 3000,
    "image_url": null,
    "resistances": [],
    "drops": []
  },
  "aspect-of-the-crawling-matriarch": {
    "health": 1700,
    "image_url": null,
    "resistances": [
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": []
  },
  "aspect-of-the-emerald-flame": {
    "health": 1700,
    "image_url": null,
    "resistances": [
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "fire",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": []
  },
  "aspect-of-the-twisted-soul": {
    "health": 1700,
    "image_url": null,
    "resistances": [
      {
        "type": "pierce",
        "level": "very-resistant"
      },
      {
        "type": "fire",
        "level": "resistant"
      },
      {
        "type": "poison",
        "level": "immune"
      }
    ],
    "drops": []
  },
  "aspect-of-the-living-forest": {
    "health": 1600,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "very-weak"
      },
      {
        "type": "poison",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": []
  },
  "aspect-of-the-writhing-dead": {
    "health": 1600,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "weak"
      },
      {
        "type": "slash",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "very-resistant"
      },
      {
        "type": "fire",
        "level": "very-resistant"
      },
      {
        "type": "frost",
        "level": "weak"
      },
      {
        "type": "poison",
        "level": "immune"
      }
    ],
    "drops": []
  },
  "aspect-of-the-dragon-mother": {
    "health": 1500,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "weak"
      },
      {
        "type": "frost",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": []
  },
  "zil-and-thungr": {
    "health": 4200,
    "image_url": null,
    "resistances": [
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Hildir's Bronze Chest",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Zil Trophy",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Thungr Trophy",
        "chance": "100%",
        "amount": "1"
      }
    ]
  },
  "boar": {
    "health": 10,
    "image_url": null,
    "resistances": [
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Boar Meat",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Leather Scraps",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Boar Trophy",
        "chance": "15%",
        "amount": "1"
      }
    ]
  },
  "greydwarf-brute": {
    "health": 150,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "very-weak"
      },
      {
        "type": "poison",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Greydwarf Eye",
        "chance": "50%",
        "amount": "2"
      },
      {
        "name": "Stone",
        "chance": "100%",
        "amount": "2"
      },
      {
        "name": "Wood",
        "chance": "100%",
        "amount": "3-5"
      },
      {
        "name": "Dandelion",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Ancient Seed",
        "chance": "33%",
        "amount": "1"
      },
      {
        "name": "Greydwarf Brute Trophy",
        "chance": "10%",
        "amount": "1"
      }
    ]
  },
  "bear": {
    "health": 500,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "fire",
        "level": "weak"
      },
      {
        "type": "frost",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Bear Paw",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Bear Meat",
        "chance": "100%",
        "amount": "2-3"
      },
      {
        "name": "Bear Hide",
        "chance": "100%",
        "amount": "4-5"
      },
      {
        "name": "Bear Trophy",
        "chance": "10%",
        "amount": "1"
      }
    ]
  },
  "blob": {
    "health": 50,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "weak"
      },
      {
        "type": "slash",
        "level": "resistant"
      },
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "fire",
        "level": "resistant"
      },
      {
        "type": "frost",
        "level": "weak"
      },
      {
        "type": "lightning",
        "level": "weak"
      },
      {
        "type": "poison",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Blob Trophy",
        "chance": "10%",
        "amount": "1"
      },
      {
        "name": "Ooze",
        "chance": "100%",
        "amount": "1-2"
      }
    ]
  },
  "draugr-elite": {
    "health": 200,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "resistant"
      },
      {
        "type": "poison",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Entrails",
        "chance": "100%",
        "amount": "2-3"
      },
      {
        "name": "Draugr Elite Trophy",
        "chance": "10%",
        "amount": "1"
      }
    ]
  },
  "wolf": {
    "health": 80,
    "image_url": null,
    "resistances": [
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Wolf Trophy",
        "chance": "10%",
        "amount": "1"
      },
      {
        "name": "Wolf Meat",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Wolf Pelt",
        "chance": "100%",
        "amount": "1-2"
      },
      {
        "name": "Wolf Fang",
        "chance": "40%",
        "amount": "1"
      }
    ]
  },
  "ulv": {
    "health": 50,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "very-resistant"
      },
      {
        "type": "poison",
        "level": "weak"
      }
    ],
    "drops": [
      {
        "name": "Wolf Fang",
        "chance": "50%",
        "amount": "1-2"
      },
      {
        "name": "Ulv Trophy",
        "chance": "10%",
        "amount": "1"
      }
    ]
  },
  "lox": {
    "health": 1000,
    "image_url": null,
    "resistances": [
      {
        "type": "blunt",
        "level": "resistant"
      },
      {
        "type": "slash",
        "level": "resistant"
      },
      {
        "type": "fire",
        "level": "weak"
      },
      {
        "type": "frost",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Lox Meat",
        "chance": "100%",
        "amount": "4-6"
      },
      {
        "name": "Lox Trophy",
        "chance": "10%",
        "amount": "1"
      },
      {
        "name": "Lox Pelt",
        "chance": "100%",
        "amount": "2-3"
      }
    ]
  },
  "gjall": {
    "health": 1500,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Bilebag",
        "chance": "100%",
        "amount": "1"
      },
      {
        "name": "Gjall Trophy",
        "chance": "30%",
        "amount": "1"
      }
    ]
  },
  "bonemaw": {
    "health": 1100,
    "image_url": null,
    "resistances": [
      {
        "type": "fire",
        "level": "immune"
      },
      {
        "type": "frost",
        "level": "weak"
      },
      {
        "type": "poison",
        "level": "resistant"
      },
      {
        "type": "spirit",
        "level": "immune"
      }
    ],
    "drops": [
      {
        "name": "Bonemaw Trophy",
        "chance": "33%",
        "amount": "1"
      },
      {
        "name": "Bonemaw Meat",
        "chance": "100%",
        "amount": "6-8"
      },
      {
        "name": "Bonemaw Tooth",
        "chance": "100%",
        "amount": "8-10"
      }
    ]
  },
  "krigen": {
    "health": 1300,
    "image_url": null,
    "resistances": [
      {
        "type": "pierce",
        "level": "resistant"
      },
      {
        "type": "frost",
        "level": "very-resistant"
      },
      {
        "type": "poison",
        "level": "immune"
      },
      {
        "type": "spirit",
        "level": "ignore"
      }
    ],
    "drops": [
      {
        "name": "Mould: Chestpiece of the Vanguard",
        "chance": "3%",
        "amount": "1"
      },
      {
        "name": "Mould: Hood of the Vanguard",
        "chance": "3%",
        "amount": "1"
      },
      {
        "name": "Mould: Trousers of the Vanguard",
        "chance": "3%",
        "amount": "1"
      },
      {
        "name": "Memorial Coal",
        "chance": "20%",
        "amount": "1"
      },
      {
        "name": "Krigen Trophy",
        "chance": "10%",
        "amount": "1"
      },
      {
        "name": "Leather Straps",
        "chance": "100%",
        "amount": "1-3"
      },
      {
        "name": "Mould: Trousers of the Protector",
        "chance": "3%",
        "amount": "1"
      },
      {
        "name": "Mould: Breastplate of the Protector",
        "chance": "3%",
        "amount": "1"
      },
      {
        "name": "Mould: Helmet of the Protector",
        "chance": "3%",
        "amount": "1"
      }
    ]
  }
};
