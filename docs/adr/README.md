# Architecture decision record（ADR）

ADRは、意味のある代替案と結果を伴う恒久的な決定を記録する。議事録でも、依存関係の選定を逐一記録するログでもない。

## Status値

- `Proposed`: レビュー中で、まだ制約になっていない。
- `Accepted`: 現在有効な決定。
- `Superseded`: 後続のADRに置き換えられた。置き換え元のADRは置き換え先へリンクすること。
- `Rejected`: 検討したが採用しなかった。

## 一覧

| ADR                                      | Status   | 決定内容                                                             |
| ---------------------------------------- | -------- | -------------------------------------------------------------------- |
| [0001](0001-static-first-aws-hosting.md) | Proposed | MVP向けにS3とCloudFrontによるstatic-firstなNext.jsデプロイを採用する |

## テンプレート

[template.md](template.md)をコピーし、ファイル番号を連番で振ること。
