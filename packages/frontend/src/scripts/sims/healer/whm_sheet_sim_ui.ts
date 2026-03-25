import {FieldBoundCheckBox, labeledCheckbox, FieldBoundFloatField, nonNegative, labelFor, quickElement} from "@xivgear/common-ui/components/util";
import {SimulationGui} from "../simulation_gui";
import {WhmSheetSimResult, WhmSheetSettings} from "@xivgear/core/sims/healer/whm_sheet_sim";

export class WhmSheetSimGui extends SimulationGui<WhmSheetSimResult, WhmSheetSettings, WhmSheetSettings> {

    makeConfigInterface(settings: WhmSheetSettings): HTMLElement {

        const outerDiv = document.createElement("div");
        const checkboxesDiv = document.createElement("div");

        const brdCheck = new FieldBoundCheckBox<WhmSheetSettings>(settings, 'hasBard', {id: 'brd-checkbox'});
        checkboxesDiv.appendChild(labeledCheckbox('隊伍中有詩人', brdCheck));
        const schCheck = new FieldBoundCheckBox<WhmSheetSettings>(settings, 'hasScholar', {id: 'sch-checkbox'});
        checkboxesDiv.appendChild(labeledCheckbox('隊伍中有學者', schCheck));
        const drgCheck = new FieldBoundCheckBox<WhmSheetSettings>(settings, 'hasDragoon', {id: 'drg-checkbox'});
        checkboxesDiv.appendChild(labeledCheckbox('隊伍中有龍騎', drgCheck));

        outerDiv.appendChild(checkboxesDiv);

        const ldPerMin = new FieldBoundFloatField<WhmSheetSettings>(settings, 'ldPerMin', {
            id: 'ldPerMin-input',
            postValidators: [nonNegative],
        });
        const ldPerMinLabel = labelFor('醒夢/分鐘', ldPerMin);
        outerDiv.appendChild(quickElement("div", ['labeled-item'], [ldPerMinLabel, ldPerMin]));

        const rezPerMin = new FieldBoundFloatField<WhmSheetSettings>(settings, 'rezPerMin', {
            id: 'rezPerMin-input',
            postValidators: [nonNegative],
        });
        const rezPerMinLabel = labelFor('復活/分鐘', rezPerMin);
        outerDiv.appendChild(quickElement("div", ['labeled-item'], [rezPerMinLabel, rezPerMin]));

        const m2perMin = new FieldBoundFloatField<WhmSheetSettings>(settings, 'm2PerMin', {
            id: 'm2PerMin-input',
            postValidators: [nonNegative],
        });
        const m2perMinLabel = labelFor('醫濟II/分鐘', m2perMin);
        outerDiv.appendChild(quickElement("div", ['labeled-item'], [m2perMinLabel, m2perMin]));

        const c3perMin = new FieldBoundFloatField<WhmSheetSettings>(settings, 'c3PerMin', {
            id: 'c3PerMin-input',
            postValidators: [nonNegative],
        });
        const c3perMinLabel = labelFor('癒療III/分鐘', c3perMin);
        outerDiv.appendChild(quickElement("div", ['labeled-item'], [c3perMinLabel, c3perMin]));

        return outerDiv;
    }

}
