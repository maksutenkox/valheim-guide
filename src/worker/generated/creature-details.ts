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

export const generatedCreatureDetails: Record<string, GeneratedCreatureDetail> = {
  "morgen": {
    health: 1600,
    image_url: null,
    resistances: [
      { type: "blunt", level: "resistant" },
      { type: "slash", level: "resistant" },
      { type: "pierce", level: "resistant" },
      { type: "fire", level: "resistant" },
      { type: "lightning", level: "weak" }
    ],
    drops: [
      { name: "Morgen Sinew", chance: "100%", amount: "1-2" },
      { name: "Morgen Heart", chance: "80%", amount: "1" },
      { name: "Morgen Trophy", chance: "5%", amount: "1" }
    ]
  }
};
