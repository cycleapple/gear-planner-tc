import {VprGcdAbility, VprOgcdAbility} from "./vpr_types";
import {FlanksbaneVenom, FlankstungVenom, HindsbaneVenom, HindstungVenom, HonedReavers, HonedSteel, HuntersInstinct, ReadyToReawaken, Swiftscaled} from "./vpr_buffs";


export const SteelFangs: VprGcdAbility = {
    type: 'gcd',
    name: "壹之牙【咬創】",
    id: 34606,
    potency: 200,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [HonedReavers],
};

export const ReavingFangs: VprGcdAbility = {
    type: 'gcd',
    name: "壹之牙【穿裂】",
    id: 34607,
    potency: 200,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [HonedSteel],
};

export const HuntersSting: VprGcdAbility = {
    type: 'gcd',
    name: "Hunter's Sting",
    id: 34608,
    potency: 300,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [HuntersInstinct],
};

export const SwiftskinsSting: VprGcdAbility = {
    type: 'gcd',
    name: "Swiftskin's Sting",
    id: 34609,
    potency: 300,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [Swiftscaled],
};

export const FlankstingStrike: VprGcdAbility = {
    type: 'gcd',
    name: "參之牙【側擊】",
    id: 34610,
    potency: 400,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [HindstungVenom],
    updateGaugeLegacy: gauge => gauge.serpentOfferings += 10,
};

export const FlanksbaneFang: VprGcdAbility = {
    type: 'gcd',
    name: "參之牙【側裂】",
    id: 34611,
    potency: 400,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [HindsbaneVenom],
    updateGaugeLegacy: gauge => gauge.serpentOfferings += 10,
};

export const HindstingStrike: VprGcdAbility = {
    type: 'gcd',
    name: "參之牙【背擊】",
    id: 34612,
    potency: 400,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [FlanksbaneVenom],
    updateGaugeLegacy: gauge => gauge.serpentOfferings += 10,
};

export const HindsbaneFang: VprGcdAbility = {
    type: 'gcd',
    name: "參之牙【背裂】",
    id: 34613,
    potency: 400,
    attackType: "Weaponskill",
    gcd: 2.5,
    cast: 0,
    activatesBuffs: [FlankstungVenom],
    updateGaugeLegacy: gauge => gauge.serpentOfferings += 10,
};

export const Vicewinder: VprGcdAbility = {
    type: 'gcd',
    name: "壹之蛇【強碎】",
    id: 34620,
    potency: 500,
    attackType: "Weaponskill",
    gcd: 3.0,
    cast: 0,
    cooldown: {
        time: 40,
        charges: 2,
    },
    updateGaugeLegacy: gauge => gauge.rattlingCoils += 1,
};

export const HuntersCoil: VprGcdAbility = {
    type: 'gcd',
    name: "Hunter's Coil",
    id: 34621,
    potency: 620,
    attackType: "Weaponskill",
    gcd: 3.0,
    cast: 0,
    activatesBuffs: [HuntersInstinct],
    updateGaugeLegacy: gauge => gauge.serpentOfferings += 5,
};

export const SwiftskinsCoil: VprGcdAbility = {
    type: 'gcd',
    name: "Swiftskin's Coil",
    id: 34622,
    potency: 620,
    attackType: "Weaponskill",
    gcd: 3.0,
    cast: 0,
    activatesBuffs: [Swiftscaled],
    updateGaugeLegacy: gauge => gauge.serpentOfferings += 5,
};

export const UncoiledFury: VprGcdAbility = {
    type: 'gcd',
    name: "飛蛇之尾",
    id: 34633,
    potency: 680,
    attackType: "Weaponskill",
    gcd: 3.5,
    cast: 0,
    updateGaugeLegacy: gauge => gauge.rattlingCoils -= 1,
};

export const Reawaken: VprGcdAbility = {
    type: 'gcd',
    name: "祖靈降臨",
    id: 34626,
    potency: 750,
    attackType: "Weaponskill",
    gcd: 2.2,
    cast: 0,
    updateGaugeLegacy: gauge => gauge.serpentOfferings -= 50,
};

const GenerationBase: VprGcdAbility = {
    name: null,
    id: null,
    type: 'gcd',
    potency: 680,
    attackType: "Weaponskill",
    gcd: 2.0,
    cast: 0,
};

export const FirstGeneration: VprGcdAbility = {
    ...GenerationBase,
    name: "祖靈之牙【壹】",
    id: 34627,
};

export const SecondGeneration: VprGcdAbility = {
    ...GenerationBase,
    name: "祖靈之牙【貳】",
    id: 34628,
};

export const ThirdGeneration: VprGcdAbility = {
    ...GenerationBase,
    name: "祖靈之牙【參】",
    id: 34629,
};

export const FourthGeneration: VprGcdAbility = {
    ...GenerationBase,
    name: "祖靈之牙【肆】",
    id: 34630,
};

export const Ouroboros: VprGcdAbility = {
    name: "祖靈大蛇牙",
    id: 34631,
    type: 'gcd',
    potency: 1150,
    attackType: "Weaponskill",
    gcd: 2.0,
    cast: 0,
};

const LegacyBase: VprOgcdAbility = {
    name: null,
    id: null,
    type: 'ogcd',
    potency: 320,
    attackType: 'Ability',
};

export const FirstLegacy: VprOgcdAbility = {
    ...LegacyBase,
    name: "祖靈之蛇【壹】",
    id: 34640,
};

export const SecondLegacy: VprOgcdAbility = {
    ...LegacyBase,
    name: "祖靈之蛇【貳】",
    id: 34641,
};

export const ThirdLegacy: VprOgcdAbility = {
    ...LegacyBase,
    name: "祖靈之蛇【參】",
    id: 34642,
};

export const FourthLegacy: VprOgcdAbility = {
    ...LegacyBase,
    name: "祖靈之蛇【肆】",
    id: 34643,
};

export const SerpentsIre: VprOgcdAbility = {
    name: "Serpent's Ire",
    id: 34647,
    type: 'ogcd',
    potency: 0,
    cooldown: {
        time: 120,
        charges: 1,
    },
    attackType: 'Ability',
    updateGaugeLegacy: gauge => gauge.rattlingCoils += 1,
    activatesBuffs: [ReadyToReawaken],
};

export const TwinfangBite: VprOgcdAbility = {
    name: "雙牙連擊",
    id: 34636,
    type: 'ogcd',
    potency: 120,
    attackType: 'Ability',
};

export const TwinbloodBite: VprOgcdAbility = {
    name: "雙牙亂擊",
    id: 34637,
    type: 'ogcd',
    potency: 120,
    attackType: 'Ability',
};

export const DeathRattle: VprOgcdAbility = {
    name: "蛇尾擊",
    id: 34634,
    type: 'ogcd',
    potency: 280,
    attackType: 'Ability',
};

export const UncoiledTwinfang: VprOgcdAbility = {
    name: "飛蛇連尾擊",
    id: 34644,
    type: 'ogcd',
    potency: 120,
    attackType: 'Ability',
};

export const UncoiledTwinblood: VprOgcdAbility = {
    name: "飛蛇亂尾擊",
    id: 34645,
    type: 'ogcd',
    potency: 120,
    attackType: 'Ability',
};
