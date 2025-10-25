# ZeroKeyCI Sample - ETHOnline 2025

**デモ用サンプルリポジトリ**: ZeroKeyCIを使って秘密鍵なしでスマートコントラクトをデプロイ

## 🎯 このレポジトリについて

このリポジトリは[ZeroKeyCI](https://github.com/susumutomita/ZeroKeyCI)の実動デモです。

- ✅ **秘密鍵をCI/CDに保存しない**
- ✅ **Gnosis Safe multisigで承認**
- ✅ **完全な監査証跡**

## 🚀 クイックスタート (デモモード)

### 前提条件

- Node.js 18以上
- GitHub アカウント
- MetaMask (Safe UIでの署名用)

### セットアップ

```bash
# 1. 依存関係をインストール
npm install

# 2. コントラクトをコンパイル
npm run compile

# 3. GitHubにpush
git add .
git commit -m "feat: add HelloZeroKeyCI contract"
git push origin main
```

### デプロイ方法

1. **ブランチを作成してPRを開く**
   ```bash
   git checkout -b feat/test-deploy
   echo "# Test" >> test.txt
   git add test.txt
   git commit -m "test: trigger deployment"
   git push -u origin feat/test-deploy
   gh pr create --title "Test ZeroKeyCI Deployment" --body "Testing deployment"
   ```

2. **PRをマージ**
   - GitHub UIでPRをマージ
   - GitHub Actionsが自動実行される

3. **Safe UIで署名**
   - [app.safe.global](https://app.safe.global)にアクセス
   - **Base Sepolia**ネットワークに切り替え
   - デモSafe (`0xfbD23fcc0D45a3BD6CdBff38b8C03C2A8E9ec663`) をロード
   - 自分を所有者として追加(初回のみ):
     - Settings → Owners → Add Owner
     - あなたのウォレットアドレスを入力
   - Transactionsタブで提案を確認
   - **Sign**ボタンをクリック
   - MetaMaskで署名を確認
   - **Execute**をクリック

4. **デプロイ完了!** 🎉
   - コントラクトがBase Sepoliaにデプロイされる
   - Blockscoutで自動的に検証される
   - PRにデプロイアドレスがコメントされる

## 📝 デモSafeについて

このサンプルはZeroKeyCI提供の**デモSafe**を使用しています:

- **Address**: `0xfbD23fcc0D45a3BD6CdBff38b8C03C2A8E9ec663`
- **Network**: Base Sepolia (testnet)
- **用途**: 学習とテスト専用
- **⚠️ 重要**: 本番環境では自分のSafeを作成してください

## 🔄 本番環境への移行

デモで動作を確認したら、自分のSafeを作成:

1. [app.safe.global](https://app.safe.global)で新しいSafeを作成
2. `.github/workflows/deploy.yml`の`safe-address`を更新
3. 本番用RPC URLをGitHub Secretsに設定
4. デプロイ!

詳細: [ZeroKeyCI Documentation](https://github.com/susumutomita/ZeroKeyCI/blob/main/docs/DEMO_MODE.md)

## 📚 コントラクト

### HelloZeroKeyCI.sol

シンプルなメッセージストレージコントラクト:

- `message`: 現在のメッセージ
- `owner`: デプロイしたアドレス
- `deployedAt`: デプロイ時刻
- `setMessage(string)`: メッセージを更新
- `getInfo()`: 全情報を取得

## 🛠 開発

```bash
# コンパイル
npm run compile

# テスト (追加する場合)
npm run test
```

## 🔗 リンク

- **ZeroKeyCI**: https://github.com/susumutomita/ZeroKeyCI
- **Demo Mode Guide**: https://github.com/susumutomita/ZeroKeyCI/blob/main/docs/DEMO_MODE.md
- **ETHOnline 2025**: https://ethglobal.com/events/ethonline2025

## 📜 ライセンス

MIT
