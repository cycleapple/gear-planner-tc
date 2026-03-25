import {FieldBoundCheckBox, labeledCheckbox, labelFor} from "@xivgear/common-ui/components/util";
import {BaseMultiCycleSimGui} from "../multicyclesim_ui";

import {PldSKSSheetSettings, PldSKSSheetSimResult} from "@xivgear/core/sims/tank/pld/pldsks_sim";

// Restoring the PLD SKS Sim settings UI, via the new SimGui class

export class pldSKSSimGui extends BaseMultiCycleSimGui<PldSKSSheetSimResult, PldSKSSheetSettings> {
    override makeCustomConfigInterface(settings: PldSKSSheetSettings, _updateCallback: () => void): HTMLElement | null {

        const outerDiv = document.createElement("div");
        const behaviorDiv = document.createElement("div");
        const openerDiv = document.createElement("div");
        const oddbinsDiv = document.createElement("div");

        const sksCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'acknowledgeSKS', {id: 'sks-checkbox'});
        const justMinimiseCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'justMinimiseDrift', {id: 'justmin-checkbox'});
        const tryCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'attempt9GCDAbove247', {id: 'try-checkbox'});
        const lateCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'alwaysLateWeave', {id: 'late-checkbox'});
        const avoidDoubleHS9sCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'avoidDoubleHS9s', {id: 'avoid2hs-checkbox'});
        const hyperRobotCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'useHyperRobotPrecision', {id: 'hyper-checkbox'});
        const neverGet9Check = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'simulateMissing9th', {id: 'neverget9-checkbox'});


        const hcOpenCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'hardcastopener', {id: 'hc-checkbox'});
        const earlyOpenCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'burstOneGCDEarlier', {id: 'early-checkbox'});
        const disableBurnCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'disableBurnDown', {id: 'burn-checkbox'});

        const disableNewPrioCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'perform12312OldPrio', {id: 'prio-checkbox'});
        const use701potenciesCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'use701potencies', {id: 'potency701-checkbox'});
        const hideCommentsCheck = new FieldBoundCheckBox<PldSKSSheetSettings>(settings, 'hideCommentText', {id: 'hidecomms-checkbox'});


        const opt1 = document.createElement("options1");
        const space1 = document.createElement("space1");
        const opt2 = document.createElement("options2");
        const space2 = document.createElement("space2");
        const opt3 = document.createElement("options3");
        const space3 = document.createElement("space3");

        behaviorDiv.appendChild(labeledCheckbox('依技能速度調整循環', sksCheck));
        behaviorDiv.appendChild(labelFor("策略選項:", opt1));
        behaviorDiv.appendChild(labeledCheckbox('強制僅最小化漂移 & 8連', justMinimiseCheck));
        behaviorDiv.appendChild(labeledCheckbox('強制在2.47+嘗試9/8連', tryCheck));
        behaviorDiv.appendChild(labeledCheckbox('強制在2.43+始終延遲FOF', lateCheck));
        behaviorDiv.appendChild(labeledCheckbox('避免9 GCD FOF中的雙重及提前HS', avoidDoubleHS9sCheck));
        behaviorDiv.appendChild(labeledCheckbox('假設完美FOF延遲織入', hyperRobotCheck));
        behaviorDiv.appendChild(labeledCheckbox('模擬始終錯過第9個GCD', neverGet9Check));
        behaviorDiv.appendChild(labelFor("-", space1));

        openerDiv.appendChild(labelFor("開始與結束:", opt2));
        openerDiv.appendChild(labeledCheckbox('在起手中包含硬讀條HS', hcOpenCheck));
        openerDiv.appendChild(labeledCheckbox('提前1個GCD使用起手', earlyOpenCheck));
        openerDiv.appendChild(labeledCheckbox('停用20秒收尾優化', disableBurnCheck));
        openerDiv.appendChild(labelFor("-", space2));

        oddbinsDiv.appendChild(labelFor("特殊選項:", opt3));
        oddbinsDiv.appendChild(labeledCheckbox('假設？使用曉月12312優先順序', disableNewPrioCheck));
        oddbinsDiv.appendChild(labeledCheckbox('使用7.01版威力', use701potenciesCheck));
        oddbinsDiv.appendChild(labeledCheckbox('隱藏表上所有額外註解', hideCommentsCheck));
        oddbinsDiv.appendChild(labelFor("-", space3));

        // Add our 3 sets of options:
        outerDiv.appendChild(behaviorDiv);
        outerDiv.appendChild(openerDiv);
        outerDiv.appendChild(oddbinsDiv);

        return outerDiv;
    }
}
