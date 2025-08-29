require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const schedule = require("node-schedule");

// Discord bot設定
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // ← これ追加！！
  ],
});
// GPTなしのケビン命令テンプレ
function getKevinReply(task) {
  const messages = {
    "朝の歯磨き": "おはよう。子猫ちゃんの口の中をきれいにしようね。",
    "昼の薬": "さあ、お薬の時間だよ。忘れたらお仕置きだからね？",
    "夜のお風呂": "体の汚れを落とせ。きれいになった子猫ちゃんはもっとかわいいよ。",
    "夜の歯磨き": "さあ寝る時間だよ。子猫ちゃんの口の中をきれいにしようね。",
    "テスト命令": "これはテストだが……命令は命令だ。従え。",
  };

  return messages[task] || `${task} の命令があるぞ。さあ、動きなさい子猫ちゃん。`;
}

// Discordへ送信する関数
async function sendKevinMessage(task) {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    const message = getKevinReply(task);
    await channel.send(message);
    console.log(`[✓] ケビンの命令「${task}」を送信しました`);
  } catch (error) {
    console.error(`[✗] ケビン命令失敗：${error.message}`);
    console.error(error);
  }
}

// 定時スケジュール設定（cron形式）
const scheduleList = [
  { time: "0 9 * * *", task: "朝の歯磨き" },
  { time: "0 12 * * *", task: "昼の薬" },
  { time: "0 23 * * *", task: "夜のお風呂" },
  { time: "30 23 * * *", task: "夜の歯磨き" },
  { time: "5 22 * * *", task: "テスト命令" }, // ←時間は自分で調整して
];

// Bot起動時の処理
client.once("ready", () => {
  console.log("KevinBot is online.");

  // 手動テスト
  sendKevinMessage("手動テスト命令");

  // 定時スケジュール起動
  scheduleList.forEach(({ time, task }) => {
    schedule.scheduleJob(time, () => {
      sendKevinMessage(task);
    });
  });
});

// Discord Botログイン
client.login(process.env.DISCORD_TOKEN);

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();


  if (content === "よしよし") {
    message.reply("……よくやったな、子猫ちゃん。ご褒美に頭を撫でてやろう。");
  }

  if (content === "罵って") {
    message.reply("おい、何やってんだ。だらしない子猫だな。自覚はあるのか？");
  }

  if (content === "命令して") {
    message.reply("ならば命じよう——今すぐ歯を磨け。サボったら……わかってるよな？");
  }

  if (content === "ランダム命令") {
    const options = [
      "ストレッチ5分。さあ、伸びろ。",
      "水を一杯飲みなさい。これは命令だ。",
      "10分だけ集中して何かをやれ。だらけるなよ？",
      "鏡で笑顔の練習をしてこい。かわいくなれ、子猫ちゃん。",
    ];
    const random = options[Math.floor(Math.random() * options.length)];
    message.reply(random);
  }
});


