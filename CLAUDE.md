# CLAUDE.md

## 專案概述

這是 [xivgear.app](https://xivgear.app) 的繁體中文 (TC) fork，基於 [gear-planner](https://github.com/xiv-gear-planner/gear-planner) 開發。
提供 FFXIV 繁體中文玩家使用的配裝規劃與模擬工具。

## 建置與執行

```bash
pnpm i          # 安裝依賴（首次或依賴變更時）
pnpm build      # 建置
pnpm serve      # 啟動本機開發伺服器（預設 http://localhost:8076）
pnpm test       # 執行測試
```

## 繁中化架構

### 語言系統
- `packages/i18n/src/translation.ts` — 語言列表加入 `'tc'`，預設語言為 `'tc'`
- `packages/data-api-client/src/dataapi.ts` — `XivApiLangValueString` 加入可選 `tc` 欄位
- XIVAPI 不支援 TC，請求時映射為 `ja`（僅取 icon，不覆蓋名稱）
  - `packages/core/src/external/xivapi.ts` — `lang === 'tc'` 時改用 `'ja'`
  - `packages/frontend/src/scripts/components/sim/abilities.ts` — TC 時不從 XIVAPI 覆蓋技能名
  - `packages/frontend/src/scripts/components/sim/status_effects.ts` — TC 時不從 XIVAPI 覆蓋增益名

### 物品名稱對照
- `scripts/generate_tc_names.mjs` — 從 datamining-tc CSV 產生 TC 名稱對照表
- `packages/core/src/tc_names.ts` — 自動產生的 item ID → 繁中名稱映射（43158 個物品）
- `packages/core/src/datamanager_new.ts` — `withTcName()` 函數注入 TC 翻譯到 `nameTranslations`
- TC 語言下只顯示有繁中翻譯的裝備/食物/魔晶石（`hasTcName()` 過濾）

### 更新物品名稱
當 ffxiv-datamining-tc 更新時，重新執行：
```bash
node scripts/generate_tc_names.mjs "E:/FFXIV/XIVLauncher/ffxiv-datamining-tc"
pnpm build
```

### 資料來源
- EN datamining: `E:\FFXIV\XIVLauncher\ffxiv-datamining`
- TC datamining: `E:\FFXIV\XIVLauncher\ffxiv-datamining-tc`
- TC 版本較舊，部分新物品可能缺少繁中翻譯，會被隱藏不顯示

### 技能名稱翻譯
- 所有職業的技能名稱（482 個）已從 datamining EN/TC Action.csv 對照批量替換
- 直接寫在各職業的 action 定義檔案中（`packages/core/src/sims/` 下各職業資料夾）
- 帶括號前綴的複合技能（如 Living Shadow 系列）需手動翻譯

### 種族名稱
- 內部 key 保持英文（`RaceName` type）以維持序列化相容性
- `RACE_DISPLAY_NAMES` 對照表提供繁中顯示名稱
- 職業縮寫使用繁中單字（暗、戰、騎等），定義在 `job_name_translator.ts` 的 `TC_JOB_ABBREVS`

## 關鍵翻譯位置

| 類別 | 檔案 |
|------|------|
| 屬性全名 | `packages/xivmath/src/xivconstants.ts` → `STAT_FULL_NAMES` |
| 屬性縮寫 | `packages/xivmath/src/xivconstants.ts` → `STAT_ABBREVIATIONS` |
| 種族名稱 | `packages/xivmath/src/xivconstants.ts` → `RACE_DISPLAY_NAMES` |
| 裝備欄位 | `packages/xivmath/src/geartypes.ts` → `EquipSlotInfo` |
| 裝備來源 | `packages/xivmath/src/xivconstants.ts` → `formatAcquisitionSource()` |
| 模擬名稱 | 各職業 `*_sheet_sim.ts` 的 `displayName` |
| 團隊增益 | `packages/core/src/sims/buffs.ts` |
| 表頭欄位 | `packages/frontend/src/scripts/components/sheet/sheet_gui.ts` |
| 工具列按鈕 | `packages/frontend/src/scripts/components/sheet/toolbar/gear_edit_toolbar.ts` |
| 設定頁面 | `packages/common-ui/src/settings/settings_modal.ts` |

## 注意事項

- 遺物武器在此專案中翻譯為「肝武」（非官方翻譯，但繁中玩家通用說法）
- 模擬的 `displayName` 會被序列化保存，已建立的配裝表會保留舊名稱，新建的才會顯示繁中
- 裝備篩選預設品級範圍已改為 700~999（配合 TC 版本可用的裝備範圍）
- `packages/core/src/tc_names.ts` 是自動產生的大檔案，不要手動編輯
