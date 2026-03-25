import {FieldBoundCheckBox, labeledCheckbox} from "@xivgear/common-ui/components/util";
import {SimulationGui} from "../simulation_gui";
import {SgeSheetSettings, SgeSheetSimResult} from "@xivgear/core/sims/healer/sge_sheet_sim";

export class SgeSimGui extends SimulationGui<SgeSheetSimResult, SgeSheetSettings, SgeSheetSettings> {

    makeConfigInterface(settings: SgeSheetSettings): HTMLElement {
        const div = document.createElement("div");
        const brdCheck = new FieldBoundCheckBox<SgeSheetSettings>(settings, 'hasBard', {id: 'brd-checkbox'});
        div.appendChild(labeledCheckbox('隊伍中有詩人', brdCheck));
        const schCheck = new FieldBoundCheckBox<SgeSheetSettings>(settings, 'hasScholar', {id: 'sch-checkbox'});
        div.appendChild(labeledCheckbox('隊伍中有學者', schCheck));
        const drgCheck = new FieldBoundCheckBox<SgeSheetSettings>(settings, 'hasDragoon', {id: 'drg-checkbox'});
        div.appendChild(labeledCheckbox('隊伍中有龍騎', drgCheck));
        return div;
    }
}
