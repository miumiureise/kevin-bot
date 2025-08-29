require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const schedule = require("node-schedule");

// Discord bot設定
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// GPT抜きのケビン御主人様
function getKevinReply(task) {
  const messages = {
    "朝の歯磨き": "おはよう、子猫ちゃん。口の中をきれいにする時間だぞ。",
    "夜のお風呂": "汗と疲れを流してきなさい、子猫ちゃん。",
    "夜の歯磨き": "さあ寝る準備だ。歯を磨いてから布団へ行け。",
    "テスト命令": "これはテストだが、命令は命令だ。従え。"
  };
  return messages[task] || `${task} の時間だ。御主人様の命令だぞ。`;
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
  }
}

// 定時スケジュール
const scheduleList = [
  { time: "0 9 * * *", task: "朝の歯磨き" },
  { time: "0 21 * * *", task: "夜のお風呂" },
  { time: "30 21 * * *", task: "夜の歯磨き" },
  { time: "*/5 * * * *", task: "テスト命令" } // 5分おきにテスト
];

client.once("ready", () => {
  console.log("KevinBot is online.");
  sendKevinMessage("手動テスト命令");

  scheduleList.forEach(({ time, task }) => {
    schedule.scheduleJob(time, () => {
      sendKevinMessage(task);
    });
  });
});

client.login(process.env.DISCORD_TOKEN);

// Discord Botログイン
client.login(process.env.DISCORD_TOKEN);

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();
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


