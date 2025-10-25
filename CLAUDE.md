# プロンプト: ZeroKeyCI サンプルレポジトリのセットアップ

## 依頼内容

`/Users/susumu/ethglobal/ZeroKeyCI-sample` ディレクトリに、ZeroKeyCIのデモ用サンプルレポジトリを完全にセットアップしてください。

## 要件

- ETHOnline 2025ハッカソン用のデモプロジェクト
- ZeroKeyCIを使ってスマートコントラクトをデプロイ
- デモSafeアドレスを使用（秘密鍵不要）
- Hardhat + Solidity 0.8.20
- Base Sepoliaテストネット対応

## 作成するディレクトリ構造

```
/Users/susumu/ethglobal/ZeroKeyCI-sample/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── contracts/
│   └── HelloZeroKeyCI.sol
├── .gitignore
├── README.md
├── package.json
└── hardhat.config.js
```

## ファイル内容

### 1. package.json

```json
{
  "name": "zerokeyci-sample",
  "version": "1.0.0",
  "description": "Sample repository demonstrating ZeroKeyCI for ETHOnline 2025",
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test"
  },
  "keywords": ["ethereum", "hardhat", "zerokeyci", "gnosis-safe", "ethonline2025"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "hardhat": "^2.22.0"
  }
}
```

### 2. hardhat.config.js

```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
  },
};
```

### 3. contracts/HelloZeroKeyCI.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HelloZeroKeyCI
 * @dev デモ用のシンプルなコントラクト
 * ETHOnline 2025 - ZeroKeyCI demonstration
 */
contract HelloZeroKeyCI {
    string public message;
    address public owner;
    uint256 public deployedAt;

    event MessageUpdated(string oldMessage, string newMessage, address updatedBy);

    constructor() {
        message = "Hello from ZeroKeyCI! 🚀 No private keys in CI/CD!";
        owner = msg.sender;
        deployedAt = block.timestamp;
    }

    function setMessage(string memory _newMessage) public {
        string memory oldMessage = message;
        message = _newMessage;
        emit MessageUpdated(oldMessage, _newMessage, msg.sender);
    }

    function getInfo() public view returns (
        string memory currentMessage,
        address contractOwner,
        uint256 deploymentTime
    ) {
        return (message, owner, deployedAt);
    }
}
```

### 4. .github/workflows/deploy.yml

```yaml
name: Deploy Smart Contracts with ZeroKeyCI

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  deploy:
    if: github.event.pull_request.merged == true
    uses: susumutomita/ZeroKeyCI/.github/workflows/reusable-deploy.yml@main
    with:
      # デモモード: ZeroKeyCI提供のSafeを使用
      safe-address: 0xfbD23fcc0D45a3BD6CdBff38b8C03C2A8E9ec663
      network: base-sepolia
      contract-name: HelloZeroKeyCI
      verify-blockscout: true
    secrets:
      # Base Sepolia公開RPC URL (無料)
      rpc-url: https://sepolia.base.org
```

### 5. .gitignore

```
node_modules
.env
coverage
coverage.json
typechain
typechain-types

# Hardhat files
cache
artifacts

# IDE
.idea
.vscode
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

### 6. README.md

```markdown
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
```

## 実行手順

1. `/Users/susumu/ethglobal/ZeroKeyCI-sample` ディレクトリを作成（存在しない場合）
2. 上記のディレクトリ構造に従って全ファイルを作成
3. 各ファイルに上記の内容を正確に記述
4. ディレクトリに移動して `npm install` を実行
5. `npm run compile` でコンパイル成功を確認

## 期待される出力

- `npm install` が成功し、node_modulesが作成される
- `npm run compile` が成功し、artifacts/とcache/が作成される
- エラーなくコンパイルが完了する

## 確認事項

- [ ] 全6ファイルが正しい場所に作成されている
- [ ] package.jsonの依存関係がインストールされている
- [ ] Solidityコントラクトがコンパイルできる
- [ ] .gitignoreが設定されている
- [ ] README.mdが読みやすい

以上です。よろしくお願いします。

完了したらプルリクエストを出しておいてください。
