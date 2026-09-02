# Pull requestの品質ゲート

GitHub Actions（`.github/workflows/ci.yml`）は、`main`向けのすべてのpull requestと、`main`へのすべてのpushで実行される。人間のレビューの前に再現可能な証拠をレビュアーへ提供するものであり、各チェックはCIと同じコマンドでローカルに再現できる。

## ゲート一覧

| ゲート              | 検証内容                                                                                                                                                              | ローカルでの再現                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Validate            | 必須の公開ファイルと公開範囲・ignoreルールの存在、公開ドキュメントの日本語比率、trackedな全ファイルが公開識別子の規約に沿っているか（`scripts/validate-project.mjs`） | `npm run validate`                   |
| Format              | Prettierのフォーマットがリポジトリの規約に沿っているか                                                                                                                | `npm run format:check`               |
| Lint                | Next.js・アクセシビリティ関連ルールを含むESLintルール                                                                                                                 | `npm run lint`                       |
| Types               | TypeScript strictモードがエラーなくコンパイルできるか                                                                                                                 | `npm run typecheck`                  |
| Unit tests          | Vitest + Testing Libraryによる挙動テストと回帰テスト                                                                                                                  | `npm run test`                       |
| Production build    | CloudFront/S3が配信する静的エクスポート（`out/`）がクリーンにビルドできるか                                                                                           | `npm run build`                      |
| Accessibility smoke | 公開済みの全ルートでWCAG 2.1 A/AAのaxe違反が0件であること                                                                                                             | `npm run build && npm run test:a11y` |
| Dependency review   | このpull requestで新規追加・変更された依存関係（pull request限定）                                                                                                    | CI上でのみPRとの差分に対して実行     |
| Dependency audit    | 依存関係ツリー内の既知のhigh/critical脆弱性                                                                                                                           | `npm audit --audit-level=high`       |

アクセシビリティスモークは、汎用のE2Eスイートではなく、ビルド済み静的エクスポートに対する狭い範囲のPlaywright + axe-coreチェックである。ルート一覧はハードコードしていない。`tests/a11y/routes.spec.ts`はビルド済みの`out/`ディレクトリを走査して見つかった`index.html`（現時点では`/`、`/projects/`、`/lab/`、`/experience/`。Next.js自身の予約された404/not-foundページは除く）それぞれについて検出可能な違反がないことを確認するので、新しく公開されたページもテストファイルを編集することなく自動的にカバーされる。`scripts/serve-static.mjs`は、このためだけに書かれた小さなNodeの`http`静的ファイルサーバーで、CIジョブが追加のサーバー依存を必要としないようにしている。`trailingSlash: true`のエクスポート形式に合わせて`<route>/`を`<route>/index.html`へ解決し、`out/`の外側へのパスは配信を拒否する。

## 最小権限のpermissionモデル

- ワークフローはトップレベルで`permissions: contents: read`を設定し、各ジョブでも改めて明示している。どのジョブにも書き込み権限は付与していない。これらのチェックはコミットのpush、リリース作成、pull requestへのコメントのいずれも必要としないため。
- pull requestは`pull_request`イベントで動作し、`pull_request_target`ではない。`pull_request`はPR自身のコードをチェックアウトし、そのPRに限定されたトークンで実行するため、悪意あるPRがCIを介してリポジトリのsecretsへ到達したり、権限の強い変更をpushしたりできない。`pull_request_target`は同じ信頼できないコードをbaseブランチの書き込み可能なトークンで実行してしまうため、このリポジトリでは採用しない。
- 依存関係レビューのジョブは`contents: read`のみに絞り、`pull_request`イベントでのみ実行する。依存関係の変更をbase refと比較するという性質上、直接pushには意味がないため。依存関係監査のジョブは別で、`pull_request`と`main`へのpushの両方で実行するので、マージ後に公開された脆弱性情報も新しいpull requestを待たずに検出できる。

## ワークフローYAMLではなく、リポジトリ設定で管理するもの

いくつかの制御は、CIのステップではなくアカウント／リポジトリの設定である。

- **Secret scanningとpush protection** — このリポジトリでは必須であり、コミット前に認証情報の混入を防ぐことが、ここにある依存関係・監査ゲートを補完する（重複ではない）理由になっている。どちらもワークフローYAMLからは有効化できない。現在の状態はリポジトリのCode securityの設定ページか、APIで確認すること。

  ```bash
  gh api repos/<owner>/<repo> --jq '.security_and_analysis | {secret_scanning, secret_scanning_push_protection}'
  ```

- **Dependency graph** — `actions/dependency-review-action`が比較対象を持つために必須。公開リポジトリではデフォルトで有効だが、非公開リポジトリではGitHub Advanced Securityが必要。Dependency graphが無効な場合、dependency-reviewジョブは失敗する。この失敗は意図的なもので`continue-on-error`では握りつぶしていないため、前提条件の欠落が黙って見過ごされることはない。

## スコープ外

Branch protectionルール（これらのチェックを"required"にする設定）、Dependabot/Renovateの設定、デプロイワークフロー、より広範なend-to-endシナリオのカバレッジは、意図的にこのゲート一式には含めていない。

## 文書の言語規約の検査

`scripts/validate-project.mjs`は`git ls-files "*.md"`でtrackedなMarkdownをすべて列挙し、fenced code block・インラインコード・HTMLコメント・front matter・URL・リンクのhref・テーブル区切り行を除いた「散文」部分に含まれる日本語文字（ひらがな・カタカナ・CJK統合漢字）の比率が30%未満のファイルをエラーにする。見出しと導入部だけ日本語で本文が英語のままという中途半端な翻訳も検出できる水準として30%を選んでいる。このリポジトリのドキュメント・ADR・pull request本文は日本語で書くという規約を、レビュー時の注意力だけに頼らず機械的に強制するための検査で、`npm run validate`から実行される。

## 公開識別子規約の検査

同じスクリプトが`git ls-files`でtrackedな全ファイルを走査し、公開文書で定義されていない識別子形式やローカル専用パスへの参照が残っていないかを検査する。境界の詳細は[公開ポリシー](../repository-publication-policy.md)を参照。
