# Personal Engineering Lab

技術者としての経験、制作物、設計判断を公開する個人ポートフォリオです。成果物だけでなく、アーキテクチャ、テスト、CI/CD、IaCもリポジトリで追跡します。

現在はサイトシェルと型付きコンテンツモデルまでを実装した段階です。掲載内容の多くは本人承認前のプレースホルダーであり、UI上でも明示的にその旨を表示します。

## まず読むもの

- [MVP定義](docs/product/mvp.md)
- [アーキテクチャ](docs/architecture/overview.md)
- [ロードマップ](docs/delivery/roadmap.md)
- [Architecture decision record（ADR）](docs/adr/README.md)
- [公開ポリシー](docs/repository-publication-policy.md)

## ローカルでの開発

Node.js 24以上を使用します。

```bash
npm install
```

| コマンド               | 内容                                                                         |
| ---------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`          | 開発サーバーを起動                                                           |
| `npm run build`        | 静的エクスポート（`out/`）を生成                                             |
| `npm run lint`         | ESLint                                                                       |
| `npm run typecheck`    | TypeScript strict の型検査                                                   |
| `npm test`             | Vitest によるユニット／コンポーネントテスト                                  |
| `npm run format:check` | Prettier フォーマットの検証                                                  |
| `npm run test:a11y`    | ビルド済み静的エクスポートに対する axe スモーク（要 `npm run build` 実行後） |
| `npm run validate`     | 公開ファイルと公開範囲ルール、公開ドキュメントの日本語比率の検証             |

## 継続的インテグレーション

すべての pull request と `main` への push で GitHub Actions が上記チェック一式（validate、format、lint、型検査、テスト、本番ビルド、アクセシビリティ・スモーク、依存関係監査）を実行します。依存関係レビューのみ pull request 限定です（base との差分比較が前提のため）。各ゲートの内容とローカルでの再現方法は [品質ゲート](docs/delivery/quality-gates.md) を参照してください。

## リポジトリ構成

```text
.
├── .github/workflows/      # CIの品質ゲート
├── docs/                   # プロダクト、アーキテクチャ、ADR、デリバリーポリシー
├── scripts/                # リポジトリ検証とローカル静的サーバー
├── src/                    # アプリケーション本体（Next.js App Router、静的エクスポート）
├── tests/                  # 挙動・アクセシビリティ・品質の自動テスト
└── infrastructure/         # Terraform（デプロイ構成・今後）
```

Terraformは、実装単位が着手された時点で追加します。ローカルの計画・Agent設定・下書きは公開リポジトリに含めません。
