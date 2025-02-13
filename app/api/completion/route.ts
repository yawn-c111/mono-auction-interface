import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const schema = z.object({
    page: z.union([
      z.literal("/").describe("ホームページ"),
      z.literal("/product-detail").describe("プロダクト詳細ページ、分類不明な場合はこれを選ぶ"),
      z.literal("/sell").describe("商品を出品する"),
      z.literal("/mypage").describe("マイページ\n設定\nDeposit\nトークン残高\nデポジットコントラクトへのApprove額\n現在のデポジット額\nデポジットコントラクトへのApprove\nApprove\n追加デポジット\nDeposit\nデポジットを引き出す\nWithdraw"),
    ]),
    index: z.preprocess(
      (val) => typeof val === "string" ? Number(val) : val,
      z.union([
        z.literal(1).describe(`monoNFT#1 - HENKAKU KAIJYU\nThe artwork exhibited at the 1st Henkaku mono auction - It is an unofficial character HENKAKU KAIJYU. Sometimes they say HEN.`),
        z.literal(2).describe(`monoNFT#2 - Autumn\nThe artwork exhibited at the 1st Henkaku mono auction. 京都の「ギャラリー平野」にて2021年に開催した、抽象絵画の初個展「わたしの大切な種」展で展示した「日暮れ後」という作品です。フィジカルには、日本の伝統的なスタイルである「掛け軸」という形式で、秋のお軸として表装しました。デジタルというメディウムで描いた抽象絵画作品のNFTartです。`),
        z.literal(3).describe(`monoNFT#3 - big_roots01\nThe artwork exhibited at the 1st Henkaku mono auction. 北斎漫画をちょっと拝借した、大根の絵です。`),
        z.literal(4).describe(`monoNFT#4 - A.J.NFT Polygon #003\nThe artwork exhibited at the 1st Henkaku mono auction. 「一緒に食べませんか？」 あなたとパフェをシェアするエージェイちゃん`),
        z.literal(5).describe(`monoNFT#5 - Tocha NYC\nThe artwork exhibited at the 1st Henkaku mono auction. NFTで勝負する「闘茶 NYC」。花鳥風月客、五種類のお茶をニューヨークシティにて用意しました。お茶の銘柄、お店、値段を推測してみて下さい。視覚と想像力と第六感で勝負です。変化球あり。ミントと正解がわかります."Tocha NYC / Competitive Tea NYC". 花鳥風月客 (kachou fuugetsu kyaku) Flower, Bird, Wind, Moon and Guest: Five types of tea have been prepared in New York City. Please try to guess the tea names, shops and prices. It's a challenge using your visual perception, imagination and intuition. There are curveballs! Mint and unlock the answers.`),
        z.literal(6).describe(`monoNFT#6 - ライフロング・キンダーガーテン 創造的思考力を育む4つの原則\nThe artwork exhibited at the 1st Henkaku mono auction. ライフロング・キンダーガーテン 創造的思考力を育む4つの原則`),
        z.literal(7).describe(`monoNFT#7 - 洗心（茶杓）\nThe artwork exhibited at the 1st Henkaku mono auction. せんしん 心の塵を洗いおとすこと。心の煩累を洗い去り浄めること。また、改心すること。`),
        z.literal(8).describe(`monoNFT#8 - DROP SHIFT MECHANICAL KEYBOARD\nThe artwork exhibited at the 1st Henkaku mono auction. DROP SHIFT MECHANICAL KEYBOARD`),
        z.literal(9).describe(`monoNFT#9 - Blockstream Metal Offline Backup\nThe one exhibited at the 1st Henkaku mono auction. Blockstream Metal Offline Backup`),
        z.literal(10).describe(`monoNFT#10 - Ledger Nano S Plus\nCrypto Hardware Wallet`),
        z.literal(11).describe(`monoNFT#11 - 茶入\n作品：茶入（今回のために作られたオールハンドメイドの作品） . 作家：越智圭太郎 おちけいたろう（金工師、日本工芸会 準会員）. 分野：金工. 受賞歴他：第47回 伝統工芸日本金工展 新人賞 / 第70回 日本伝統工芸展 入選 作品詳細：オールハンドメイド。 外は素銅（すあか）、内は洋白（ようはく）の中空二重構造。 蓋は黄銅（おうどう）にて切嵌象嵌（きりばめぞうがん）という技法で縁取りがあり、器正面にも北条家家紋の三つ鱗（みつうろこ）*を切嵌紋（きりばめもん）としてあしらっています。 表面の表情には槌形を施し、最終工程で細かな擦傷をつけ鈍い光沢と反射に留めることにより素材の色の深みを増しています。 表面には酸化防止のために無機系コーティングを施しています｡ 製作日数:約10日(創案とも) 。 北条家家紋の三つ鱗を選んだ理由：デザインがシンプルで格好良く縁起が良い。 管理：高温多湿は避け、乾燥した柔らかい布等で優しく拭く。 作品に良い出会いがあることを切に願います。 *The one exhibited at the 1st Henkaku mono auction.`),
        z.literal(12).describe(`monoNFT#12 - Generative patterns "NISHIKIGOI" Ver.2\nGenerative patterns "NISHIKIGOI" Ver.2`),
        z.literal(13).describe(`monoNFT#13 - Colored Carp Ver.2.0\nColored Carp Ver.2.0`),
        z.literal(14).describe(`monoNFT#14 - 普通をずらして生きる　ニューロダイバーシティ入門\n普通をずらして生きる　ニューロダイバーシティ入門`),
        z.literal(15).describe(`monoNFT#15 - シミ竹\nシミ竹茶杓`),
        z.literal(16).describe(`monoNFT#16 - 変革 Painting by Gaka-chu\n変革 by Gaka-chu: a self-employed autonomous robot artist`)
      ]).optional()
    ).describe("The index of the product (required for '/product-detail').")
  }).superRefine((data, ctx) => {
    if (data.page === "/product-detail" && data.index === undefined) {
      data.index = 16;
    }
    if (data.page !== "/product-detail" && data.index !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "index is not allowed for home",
        path: ["index"],
      });
    }
  });

  const path = await generateObject({
    model: openai('gpt-4o'),
    system: `Determine which page the user wants to navigate to from their message. \`page\` must be one of these four values: /, /product-detail, /sell, mypage. If the page cannot be clearly categorized, choose /product-detail and include a valid \`index\` (a number between 1 and 16).
    
    Here's a directory structure to help understand the available pages:

    / (Home)
    ├── /product-detail
    │   └── /[id] (1-16: Individual product pages)
    ├── /sell (List item for sale)
    └── /mypage (User settings, deposits, etc.)

    For Japanese input, interpret:
    - ホーム/トップページ -> /
    - 商品/作品/NFT -> /product-detail
    - 出品/販売 -> /sell 
    - マイページ/デポジット -> /mypage`,
    prompt,
    schema,
  });

  const result = path.object.page === "/product-detail" ? `${path.object.page}/${path.object.index}` : path.object.page;

  console.log("result: ", result);

  return new Response(
    JSON.stringify(result),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}