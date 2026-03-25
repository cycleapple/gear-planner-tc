import {AutoAttack, GcdAbility, OgcdAbility, DamagingAbility, Ability} from "@xivgear/core/sims/sim_types";

export const fast: GcdAbility = {
    id: 9,
    type: 'gcd',
    name: "先鋒劍",
    potency: 220,
    attackType: "Weaponskill",
    gcd: 2.5,
    fixedGcd: true,
};

export const riot: GcdAbility = {
    id: 15,
    type: 'gcd',
    name: "暴亂劍",
    potency: 330,
    attackType: "Weaponskill",
    gcd: 2.5,
    fixedGcd: true,
};

export const royal: GcdAbility = {
    id: 3539,
    type: 'gcd',
    name: "王權劍",
    potency: 460,
    attackType: "Weaponskill",
    gcd: 2.5,
    fixedGcd: true,
};

export const atone: GcdAbility = {
    id: 16460,
    type: 'gcd',
    name: "贖罪劍",
    potency: 460,
    attackType: "Weaponskill",
    gcd: 2.5,
    fixedGcd: true,
};

export const supp: GcdAbility = {
    id: 36918,
    type: 'gcd',
    name: "祈告劍",
    potency: 500,
    attackType: "Weaponskill",
    gcd: 2.5,
    fixedGcd: true,
};

export const sep: GcdAbility = {
    id: 36919,
    type: 'gcd',
    name: "葬送劍",
    potency: 540,
    attackType: "Weaponskill",
    gcd: 2.5,
    fixedGcd: true,
};

export const hs: GcdAbility = {
    id: 7384,
    type: 'gcd',
    name: "聖靈",
    potency: 500,
    attackType: "Spell",
    gcd: 2.5,
    fixedGcd: true,
};

export const goring: GcdAbility = {
    id: 3538,
    type: 'gcd',
    name: "瀝血劍",
    potency: 700,
    attackType: "Weaponskill",
    gcd: 2.5,
    fixedGcd: true,
};

export const conf: GcdAbility = {
    id: 16459,
    type: 'gcd',
    name: "悔罪",
    potency: 1000,
    attackType: "Spell",
    gcd: 2.5,
    fixedGcd: true,
};

export const faith: GcdAbility = {
    id: 25748,
    type: 'gcd',
    name: "信念之劍",
    potency: 760,
    attackType: "Spell",
    gcd: 2.5,
    fixedGcd: true,
};

export const truth: GcdAbility = {
    id: 25749,
    type: 'gcd',
    name: "真理之劍",
    potency: 880,
    attackType: "Spell",
    gcd: 2.5,
    fixedGcd: true,
};

export const valor: GcdAbility = {
    id: 25750,
    type: 'gcd',
    name: "英勇之劍",
    potency: 1000,
    attackType: "Spell",
    gcd: 2.5,
    fixedGcd: true,
};

export const cos: OgcdAbility = {
    id: 23,
    type: 'ogcd',
    name: "厄運流轉",
    potency: 140,
    dot: {
        id: 248,
        duration: 15,
        tickPotency: 30,
    },
    attackType: "Ability",
};

export const exp: OgcdAbility = {
    id: 25747,
    type: 'ogcd',
    name: "償贖劍",
    potency: 450,
    attackType: "Ability",
};

export const int: OgcdAbility = {
    id: 16461,
    type: 'ogcd',
    name: "調停",
    potency: 150,
    attackType: "Ability",
};

export const imp: OgcdAbility = {
    id: 36921,
    type: 'ogcd',
    name: "絕對統治",
    potency: 580,
    attackType: "Ability",
};

export const honor: OgcdAbility = {
    id: 36922,
    type: 'ogcd',
    name: "榮耀之劍",
    potency: 1000,
    attackType: "Ability",
};

export const auto: AutoAttack = {
    name: '自動攻擊',
    type: 'autoattack',
    potency: 90,
    attackType: 'Auto-attack',
    id: 7,
};

export const fof: OgcdAbility = {
    id: 20,
    type: 'ogcd',
    name: "戰逃反應",
    potency: null,
    attackType: "Ability",
    activatesBuffs: [
        {
            statusId: 76,
            name: "戰逃反應",
            selfOnly: true,
            duration: 20,
            effects: {
                dmgIncrease: 0.25,
            },
        },
    ],
};

export function buffed(ability: Ability & Partial<DamagingAbility>): Ability {
    if (!ability.dot) {
        return {
            ...ability,
            name: `${ability.name} (FoF)`,
            potency: ability.potency * 1.25,
            id: -ability.id,
        };
    }

    const {dot: d, ...rest} = ability;

    return {
        ...rest,
        name: `${ability.name} (FoF)`,
        potency: ability.potency * 1.25,
        id: -ability.id,
        dot: {
            ...d,
            id: -d.id,
            tickPotency: d.tickPotency * 1.25,
        },
    };
}
