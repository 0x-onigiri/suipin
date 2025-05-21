# Suipin

## Demo
https://youtu.be/FzatKA7orCw

## 🌐 English

### Catchphrase

Fair and Easy On-Chain Raffles with Sui! An On-Chain Picker for Everyone to Enjoy.

### Product Overview

Suipin is a transparent and user-friendly raffle platform built on the Sui blockchain. Event organizers can create raffle events in just a few steps, and participants can enter with a unique name. The entire raffle process, from execution to results, is recorded on-chain, ensuring a fair and verifiable experience for everyone.

### Key Features

* **Create Picker:** Set a title and image for your raffle.
* **Join Picker:** Enter a raffle with a unique name.
* **Execute Raffle:** Picker owners can trigger the raffle draw.
* **View Results:** See the winner, roulette animation, and transaction ID.
* **Share Picker Page:** Easily share the raffle page URL.
* **Get Testnet SUI:** For development and testing purposes.

### Tech Stack

* **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Sui dApp Kit (@mysten/dapp-kit), TanStack Query, react-custom-roulette, use-sound
* **Smart Contract:** Sui (Move)
* **Other Tools:** Bun

### Setup and Run

#### Prerequisites

* [Bun](https://bun.sh/)
* [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)

#### Sui Contract

1. Navigate to the `packages/sui/suipin` directory.
  ```bash
  cd packages/sui/suipin
  ```
2. Publish the contract.
    ```bash
    sui client publish --gas-budget 100000000
    ```
3. After deployment, copy the `packageId` and set it in the frontend constants file: `packages/frontend/src/constants/index.ts` (e.g., `SUIPIN.testnet.packageId`).

#### Frontend

1. Navigate to the `packages/frontend` directory.
    ```bash
    cd packages/frontend
    ```
2. Install dependencies.
    ```bash
    bun install
    ```
3. Run the development server.
    ```bash
    bun run dev
    ```

---

## 🇯🇵 日本語

### キャッチフレーズ

Suiで公正な抽選を簡単に！みんなで楽しめるオンチェーンピッカー

### プロダクト概要

Suipinは、Suiブロックチェーン上で動作する、透明性が高く、誰でも簡単に利用できる抽選プラットフォームです。イベント主催者は数ステップで抽選イベントを作成でき、参加者はユニークな名前でエントリーできます。抽選の実行と結果はすべてオンチェーンで記録されるため、公正な抽選プロセスを保証します。

### 主な機能

* **Pickerの作成:** タイトルと画像を設定して抽選を作成します。
* **Pickerへの参加:** ユニークな名前で抽選に参加します。
* **抽選の実行:** Pickerのオーナーが抽選を実行します。
* **抽選結果の表示:** ルーレットアニメーション、当選者名、トランザクションIDを確認できます。
* **PickerページのURL共有:** 抽選ページのURLを簡単に共有できます。
* **テストネットSUIの取得:** 開発・テスト用。

### 技術スタック

* **フロントエンド:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Sui dApp Kit (@mysten/dapp-kit), TanStack Query, react-custom-roulette, use-sound
* **スマートコントラクト:** Sui (Move)
* **その他ツール:** Bun

### セットアップと実行方法

#### 前提条件

* [Bun](https://bun.sh/)
* [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)

#### Suiコントラクト

1.  `packages/sui/suipin` ディレクトリへ移動します。
    ```bash
    cd packages/sui/suipin
    ```
2.  コントラクトを公開（デプロイ）します。
    ```bash
    sui client publish --gas-budget 100000000
    ```
3.  デプロイ後、出力された `packageId` をコピーし、フロントエンドの定数ファイル `packages/frontend/src/constants/index.ts` 内の `SUIPIN.testnet.packageId` に設定します。

#### フロントエンド

1.  `packages/frontend` ディレクトリへ移動します。
    ```bash
    cd packages/frontend
    ```
2.  依存関係をインストールします。
    ```bash
    bun install
    ```
3.  開発サーバーを起動します。
    ```bash
    bun run dev
