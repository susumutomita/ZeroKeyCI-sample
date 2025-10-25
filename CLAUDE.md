# ZeroKeyCI Sample - Development Guide

このファイルはClaude Codeなどの開発支援AIが、このプロジェクトのコンテキストを理解するためのドキュメントです。

## プロジェクト概要

**ZeroKeyCI Sample** は、[ZeroKeyCI](https://github.com/susumutomita/ZeroKeyCI)のデモンストレーション用サンプルリポジトリです。

### 目的

- CI/CDパイプラインで秘密鍵を使わずにスマートコントラクトをデプロイ
- Gnosis Safe multisigを使った安全なデプロイフロー
- ETHOnline 2025ハッカソンでのデモンストレーション

### 技術スタック

- **Smart Contract**: Solidity 0.8.20
- **Development Framework**: Hardhat 2.22.0
- **CI/CD**: GitHub Actions
- **Deployment**: ZeroKeyCI (Gnosis Safe integration)
- **Network**: Base Sepolia (testnet)

## ディレクトリ構造

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # ZeroKeyCI deployment workflow
├── contracts/
│   └── HelloZeroKeyCI.sol     # Demo smart contract
├── artifacts/                  # Compiled contracts (gitignored)
├── cache/                      # Hardhat cache (gitignored)
├── node_modules/              # npm dependencies (gitignored)
├── .gitignore
├── CLAUDE.md                  # このファイル
├── README.md                  # ユーザー向けドキュメント
├── hardhat.config.js          # Hardhat configuration
└── package.json               # Project dependencies
```

## 重要な開発ガイドライン

### 1. Solidityコーディング規約

#### ❌ Unicode文字の使用禁止

Solidity 0.8.20では文字列リテラル内のUnicode文字(絵文字など)がコンパイルエラーになります。

```solidity
// ❌ NG - コンパイルエラー
message = "Hello! 🚀";

// ✅ OK
message = "Hello!";
```

#### コントラクト設計の原則

- シンプルさを優先（デモ用途）
- ガス最適化よりも可読性
- イベントログを活用
- 必ずコメントを記述

### 2. GitHub Actions ワークフロー

#### デプロイトリガー

```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]
```

**重要**: デプロイは**PRがマージされた時のみ**実行されます。mainブランチへの直接pushでは動作しません。

#### ZeroKeyCI設定

```yaml
with:
  safe-address: 0xfbD23fcc0D45a3BD6CdBff38b8C03C2A8E9ec663  # Demo Safe
  network: base-sepolia
  contract-name: HelloZeroKeyCI
  verify-blockscout: true
```

### 3. 開発フロー

#### 新機能の追加

1. **ブランチを作成**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **コードを編集**
   - `contracts/` でSolidityコードを編集
   - `hardhat.config.js` で必要に応じて設定変更

3. **ローカルでテスト**
   ```bash
   npm run compile  # コンパイルチェック
   ```

4. **PRを作成**
   ```bash
   git add .
   git commit -m "feat: description"
   git push -u origin feat/your-feature-name
   gh pr create --title "feat: Your Feature" --body "Description"
   ```

5. **PRマージ後、Safe UIで署名**
   - GitHub Actionsがデプロイトランザクションを作成
   - Safe UIで承認・実行

### 4. トラブルシューティング

#### コンパイルエラー

**問題**: `Invalid character in string`
```
ParserError: Invalid character in string.
```

**解決**: 文字列から絵文字・特殊文字を削除

---

**問題**: `HH600: Compilation failed`

**解決**:
```bash
# キャッシュをクリア
rm -rf cache artifacts
npm run compile
```

#### デプロイエラー

**問題**: GitHub Actionsが実行されない

**チェックポイント**:
- PRがマージ済みか？
- ベースブランチは`main`か？
- ワークフローファイルに文法エラーがないか？

---

**問題**: Safe UIにトランザクションが表示されない

**チェックポイント**:
- 正しいネットワーク(Base Sepolia)に接続しているか？
- Safeアドレスが正しいか？
- GitHub Actionsのログを確認

## コード変更時の注意事項

### contracts/HelloZeroKeyCI.sol

- コンストラクタの初期メッセージは ASCII文字のみ使用
- 関数は public または external で可視性を明示
- イベント定義を維持（監査証跡のため）

### .github/workflows/deploy.yml

- `safe-address` の変更は慎重に（本番環境移行時のみ）
- `network` は Base Sepolia固定（デモ環境）
- `contract-name` はファイル名と一致させる

### hardhat.config.js

- Solidity バージョンは 0.8.20 固定
- Optimizer設定はデフォルト維持（200 runs）

## よくある質問

### Q: コントラクトを変更したらどうすればいい？

A: 以下の手順:
1. ローカルで `npm run compile` を実行
2. エラーがないことを確認
3. 新しいブランチでPRを作成
4. PRマージ後、Safe UIで新しいデプロイを承認

### Q: デモSafeを自分のSafeに変更するには？

A:
1. [app.safe.global](https://app.safe.global) で新しいSafeを作成
2. `.github/workflows/deploy.yml` の `safe-address` を更新
3. 必要に応じてRPC URLをGitHub Secretsに設定

### Q: テストネットからメインネットに移行するには？

A: **推奨しません**。このリポジトリはデモ専用です。本番環境では別リポジトリを作成してください。

## Claude向けのコンテキスト

### 開発支援時の推奨アクション

1. **コード変更前**: 必ず `npm run compile` で検証
2. **Solidityコード**: Unicode文字を使わない
3. **PR作成**: 常に新しいブランチから
4. **コミットメッセージ**: Conventional Commits形式

### このプロジェクトで避けるべきこと

- ❌ mainブランチへの直接push
- ❌ Solidity文字列内の絵文字使用
- ❌ Demo Safeアドレスの変更（デモ用途以外）
- ❌ 秘密鍵・RPCキーのハードコード
- ❌ テストなしでのコントラクト変更

### 推奨される改善提案

- ✅ テストケースの追加 (`test/` ディレクトリ)
- ✅ 複数コントラクトのサポート
- ✅ より複雑なSafeインタラクション
- ✅ デプロイスクリプトの追加

## 参考リンク

- **ZeroKeyCI**: https://github.com/susumutomita/ZeroKeyCI
- **Hardhat Docs**: https://hardhat.org/docs
- **Safe Documentation**: https://docs.safe.global/
- **Solidity Style Guide**: https://docs.soliditylang.org/en/latest/style-guide.html

---

**最終更新**: 2025-10-25
**対象**: ETHOnline 2025 Hackathon Demo
