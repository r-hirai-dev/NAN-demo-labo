# Personal Engineering Lab

技術者としての経験、制作物、設計判断を公開する個人ポートフォリオです。成果物だけでなく、Architecture、テスト、CI/CD、IaCもリポジトリで追跡します。

現在はサイトシェルと型付きコンテンツモデルまでを実装した段階です。掲載内容の多くは本人承認前のプレースホルダーであり、UI上でも明示的にその旨を表示します。

## Start here

- [MVP definition](docs/product/mvp.md)
- [Architecture](docs/architecture/overview.md)
- [Roadmap](docs/delivery/roadmap.md)
- [Architecture decisions](docs/adr/README.md)
- [Repository publication policy](docs/repository-publication-policy.md)

## Local workflow

Node.js 24以上を使用します。

```bash
npm install
```

| コマンド            | 内容                                        |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | 開発サーバーを起動                          |
| `npm run build`     | 静的エクスポート（`out/`）を生成            |
| `npm run lint`      | ESLint                                      |
| `npm run typecheck` | TypeScript strict の型検査                  |
| `npm test`          | Vitest によるユニット／コンポーネントテスト |
| `npm run validate`  | 公開ファイルと公開範囲ルールの検証          |

## Repository map

```text
.
├── docs/                   # Product, Architecture, ADR, Delivery policy
├── scripts/                # Repository validation
├── src/                    # Application source (Next.js App Router, static export)
├── tests/                  # Automated behavior and quality evidence
└── infrastructure/         # Terraform (deployment Story)
```

Terraform、GitHub Actionsは、それぞれの実装単位が着手された時点で追加します。ローカルの計画・Agent設定・下書きは公開リポジトリに含めません。
