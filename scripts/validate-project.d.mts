// scripts/validate-project.mjsはプレーンなNode ESMスクリプトとして`node`から
// 直接実行するため、TypeScriptのallowJsは有効にしない。テストからimportする
// 純粋関数の型だけをここで宣言する。
export declare function extractProse(markdown: string): string;
export declare function japaneseProseRatio(markdown: string): number;
export declare const JAPANESE_PROSE_RATIO_THRESHOLD: number;
