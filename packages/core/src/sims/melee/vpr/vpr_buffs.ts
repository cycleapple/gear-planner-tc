import {Ability, BuffController, PersonalBuff} from "@xivgear/core/sims/sim_types";
import * as Actions from "./vpr_actions";
import {noStatusId} from "../../buff_helpers";

export const HonedReavers: PersonalBuff = {
    name: "蛇銳牙【穿裂】 ",
    saveKey: "Honed Reavers",
    duration: 60,
    selfOnly: true,
    effects: {
        // Increases potency of Reaving Fang by 100
    },
    statusId: 3772,
    appliesTo: ability => ability.id === Actions.ReavingFangs.id,
    beforeSnapshot<X extends Ability>(buffController: BuffController, ability: X): X {
        buffController.removeSelf();
        return {
            ...ability,
            potency: ability.potency + 100,
        };
    },
};

export const HonedSteel: PersonalBuff = {
    name: "蛇銳牙【咬創】 ",
    saveKey: "Honed Steel",
    duration: 60,
    selfOnly: true,
    effects: {
        // Increases potency of Reaving Fang by 100
    },
    statusId: 3772,
    appliesTo: ability => ability.id === Actions.SteelFangs.id,
    beforeSnapshot<X extends Ability>(buffController: BuffController, ability: X): X {
        buffController.removeSelf();
        return {
            ...ability,
            potency: ability.potency + 100,
        };
    },
};

export const HuntersInstinct: PersonalBuff = {
    name: "Hunter's Instinct",
    saveKey: "Hunter's Instinct",
    duration: 40,
    selfOnly: true,
    effects: {
        dmgIncrease: 0.1,
    },
    statusId: 3668,
};

export const Swiftscaled: PersonalBuff = {
    name: "疾速",
    saveKey: "SwiftScaled",
    duration: 40,
    selfOnly: true,
    effects: {
        haste: 15,
    },
    statusId: 3669,
};

const ComboFinisherBaseBuff = {
    duration: 60,
    selfOnly: true,
    effects: {
        // Only applies to Hindsting strike, buffing potency by 100p
    },
    beforeSnapshot<X extends Ability>(buffController: BuffController, ability: X): X {
        buffController.removeSelf();
        return {
            ...ability,
            potency: ability.potency + 100,
        };
    },
} as const satisfies Readonly<Partial<PersonalBuff>>;

export const FlankstungVenom: PersonalBuff = {
    ...ComboFinisherBaseBuff,
    name: "銳牙【側擊】",
    saveKey: "Flankstung Venom",
    appliesTo: ability => ability.id === Actions.FlankstingStrike.id,
    statusId: 3645,
};

export const FlanksbaneVenom: PersonalBuff = {
    ...ComboFinisherBaseBuff,
    name: "銳牙【側裂】",
    saveKey: "Flanksbane Venom",
    appliesTo: ability => ability.id === Actions.FlanksbaneFang.id,
    statusId: 3646,
};

export const HindstungVenom: PersonalBuff = {
    ...ComboFinisherBaseBuff,
    name: "銳牙【背擊】",
    saveKey: "Hindstung Venom",
    appliesTo: ability => ability.id === Actions.HindstingStrike.id,
    statusId: 3647,
};

export const HindsbaneVenom: PersonalBuff = {
    ...ComboFinisherBaseBuff,
    name: "銳牙【背裂】",
    saveKey: "Hindsbane Venom",
    appliesTo: ability => ability.id === Actions.HindsbaneFang.id,
    statusId: 3648,
};

export const ReadyToReawaken: PersonalBuff = {
    name: "祖靈降臨預備",
    saveKey: "Ready to Reawaken",
    duration: 30,
    selfOnly: true,
    effects: {
        // Makes reawaken free
    },
    appliesTo: ability => ability.id === Actions.Reawaken.id,
    statusId: 3671,
    beforeSnapshot<VprGcdAbility>(buffController: BuffController, ability: VprGcdAbility): VprGcdAbility {
        buffController.removeSelf();
        return {
            ...ability,
            updateGaugeLegacy: null,
        };
    },
};

export const HuntersVenom: PersonalBuff = {
    name: "Hunter's Venom",
    saveKey: "Hunter's Venom",
    duration: 30,
    selfOnly: true,
    effects: {
        // Increases Twinfang Bite potency by 50
    },
    appliesTo: ability => ability.id === Actions.TwinfangBite.id,
    beforeAbility<VprOgcdAbility>(buffController: BuffController, ability: VprOgcdAbility): VprOgcdAbility {
        buffController.removeSelf();
        return {
            ...ability,
            potency: 170,
        };
    },
    statusId: noStatusId(),
};

export const SwiftskinsVenom: PersonalBuff = {
    name: "Swiftskin's Venom",
    saveKey: "Swiftskin's Venom",
    duration: 30,
    selfOnly: true,
    effects: {
        // Increases Twinfang Bite potency by 50
    },
    appliesTo: ability => ability.id === Actions.TwinbloodBite.id,
    beforeAbility<VprOgcdAbility>(buffController: BuffController, ability: VprOgcdAbility): VprOgcdAbility {
        buffController.removeSelf();
        return {
            ...ability,
            potency: 170,
        };
    },
    statusId: noStatusId(),
};

export const PoisedForTwinfang: PersonalBuff = {
    name: "飛銳尾【連尾】",
    saveKey: "Poised for Twinfang",
    duration: 60,
    selfOnly: true,
    effects: {
        // Increases Twinfang Bite potency by 50
    },
    appliesTo: ability => ability.id === Actions.UncoiledTwinfang.id,
    beforeAbility<VprOgcdAbility>(buffController: BuffController, ability: VprOgcdAbility): VprOgcdAbility {
        buffController.removeSelf();
        return {
            ...ability,
            potency: 170,
        };
    },
    statusId: noStatusId(),
};

export const PoisedForTwinblood: PersonalBuff = {
    name: "飛銳尾【亂尾】",
    saveKey: "Poised for Twinblood",
    duration: 60,
    selfOnly: true,
    effects: {
        // Increases Twinfang Bite potency by 50
    },
    appliesTo: ability => ability.id === Actions.UncoiledTwinblood.id,
    beforeAbility<VprOgcdAbility>(buffController: BuffController, ability: VprOgcdAbility): VprOgcdAbility {
        buffController.removeSelf();
        return {
            ...ability,
            potency: 170,
        };
    },
    statusId: noStatusId(),
};
