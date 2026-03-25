import {FieldBoundFloatField, labelFor} from "@xivgear/common-ui/components/util";
import {NamedSection} from "../../components/general/section";
import {ResultSettings} from "@xivgear/core/sims/cycle_sim";

export class ResultSettingsArea extends NamedSection {
    constructor(resultSettings: ResultSettings) {
        super("結果設定");
        const inputField = new FieldBoundFloatField(resultSettings, 'stdDevs');
        const label = labelFor('+/- 標準差', inputField);
        label.style.display = 'block';
        this.contentArea.appendChild(label);
        this.contentArea.appendChild(inputField);
    }
}

customElements.define('result-settings-area', ResultSettingsArea);
