# Personal Engineering Lab

技術者としての経験、制作物、設計判断を公開する個人ポートフォリオです。成果物だけでなく、Architecture、テスト、CI/CD、IaCもリポジトリで追跡します。

現在は **Foundation PR** の段階です。アプリケーション実装より先にMVP、Architecture、公開範囲を定義しています。

## Start here

- [MVP definition](docs/product/mvp.md)
- [Architecture](docs/architecture/overview.md)
- [Roadmap](docs/delivery/roadmap.md)
- [Architecture decisions](docs/adr/README.md)
- [Repository publication policy](docs/repository-publication-policy.md)

## Local workflow

Node.js 24以上を使用します。初期基盤は外部npm依存を持ちません。

```bash
npm run validate
```

## Repository map

```text
.
├── docs/                   # Product, Architecture, ADR, Delivery policy
├── scripts/                # Repository validation
├── src/                    # Application source (first implementation PR)
├── tests/                  # Automated behavior and quality evidence
└── infrastructure/         # Terraform (deployment Story)
```

アプリケーション、Terraform、GitHub Actionsは、それぞれの実装単位が着手された時点で追加します。ローカルの計画・Agent設定・下書きは公開リポジトリに含めません。
