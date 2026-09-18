/* 落實321 — App Shell（卷一試用版）
   以《321建造 教會領導力》App v1.3.16 的殼層為基底：語音朗讀／跟讀、句子畫線與領受、小智陪讀、提詞機、
   字級、深淺色等全部承襲；新增每課「讀／享／講／帶」四模式、十單元分包載入、操練勾選、信心宣告、920操練簿。
   單一 JS 檔、無框架、無建置步驟。 */
(function () {
  "use strict";

  var VERSION = "1.0.1";
  var STORAGE_KEY = "ls321_user_v1";
  var LANG_KEY = "ls321_lang";
  var THEME_KEY = "ls321_theme";
  var FONT_KEY = "ls321_font";
  var FONT_CLASS = ["", "fs-lg", "fs-xl", "fs-xxl"];

  // ---------------------------------------------------------------
  // i18n（試用版先上繁體；簡體／英文欄位保留給後續版本，未填者自動回退繁體）
  // ---------------------------------------------------------------
  var UI_ZH = {
    brand: "落實321", tabToday: "今日", tabCourse: "課程", tabTools: "工具", tabCompanion: "陪讀", tabMe: "我的",
    continueReading: "繼續閱讀", startPart: "開始新的單元", todayVerse: "今日金句",
    partLabel: "單元", lessonLabel: "課", allParts: "十單元・173課總覽",
    readBtn: "閱讀本課", markDone: "標記完成本課", doneLabel: "已完成", inProgress: "閱讀中", notStarted: "尚未開始",
    tools: "工具", toolJourney: "321旅程地圖", toolJourneyDesc: "八大步驟×十單元進度視覺化",
    toolTracks: "關鍵詞軌跡", toolTracksDesc: "無己、謙卑、920…在全書的軌跡",
    toolChecklist: "教導誠信檢核", toolChecklistDesc: "講員／小組長自我檢核",
    toolPrompter: "提詞機／小組帶領", toolPrompterDesc: "全螢幕投影片＋討論題＋計時",
    toolSpeaker: "講員工具箱", toolSpeakerDesc: "投影片文字一鍵匯出、講章計時",
    tool920: "920操練簿", tool920Desc: "我的「2」與操練紀錄",
    companionTitle: "小智．落實教練", companionIntro: "我在這裡陪你把這一課「落實」到生活裡：先回到聖經，再回到321理念，最後找出一個今天就能做的最小行動。你可以問我任何關於這一課、或321理念的問題。",
    companionPlaceholder: "輸入你的問題…", companionSend: "送出", companionNeedNet: "陪讀需要網路連線",
    meHighlights: "我的畫線筆記", meDeclarations: "宣告簿", meProgress: "閱讀進度", meSettings: "設定", mePractices: "操練紀錄",
    meNoHighlights: "還沒有畫線筆記。閱讀時點一下句子即可畫線。",
    meNoDeclarations: "還沒有宣告紀錄。讀到「信心宣告」時，點一下宣告句或寫下你的宣告。",
    meNoPractices: "還沒有操練紀錄。讀完一課，勾選一項操練，今天就去做。",
    themeLight: "淺色", themeDark: "深色", themeAuto: "跟隨系統",
    writeDeclaration: "寫下你的宣告", saveDecl: "儲存宣告", declSaved: "已儲存", declPick: "點一下宣告句，存入宣告簿",
    startPrompterMsg: "小組帶領模式", phase: "階段", question: "題", closing: "收尾",
    wakeLockOn: "螢幕保持喚醒", exitPrompter: "結束", promptClose: "退出", prev: "上一頁", next: "下一頁",
    backHome: "首頁", backToc: "目錄", readAloud: "朗讀", pauseAloud: "暫停", resumeAloud: "繼續朗讀", stopAloud: "停止", ttsUnsupported: "這台裝置不支援語音朗讀", ttsLoading: "準備語音中…", fontSizeLabel: "調整字級大小",
    hlAddNote: "加筆記", hlEditNote: "編輯筆記", hlAskXz: "問小智", hlNotePlaceholder: "寫下你的領受或問題…", hlSave: "儲存", hlCancel: "取消", askAboutLine: "關於這一段：「", askAboutLineEnd: "」——",
    hlSheetTitle: "✍️ 寫下你的領受", hlReflectionPlaceholder: "這句話帶給你什麼領受、感動，或聖靈的提醒？寫下來，把焦點對準耶穌……", hlSaveReflection: "儲存領受", hlClearNote: "刪除領受", hlRemoveHighlight: "移除畫線", hlColorLabel: "畫線顏色",
    hlHint: "💡 讀到聖靈光照、有感動的句子，點一下就能畫線；畫線後再點一下可以寫下你的領受。",
    tracksTitle: "關鍵詞軌跡", occurrences: "次", chaptersSpanned: "課出現",
    checklistTitle: "教導誠信檢核", checklistPickChapter: "選擇要檢核的課別", checklistDone: "已完成",
    journeyTitle: "321旅程地圖",
    tier: { A: "A｜聖經明文教導", B: "B｜可討論的神學推論", C: "C｜321應用性表達" },
    companionQsToggle: "💡 範例問題", companionQsHide: "收起範例問題", companionQsHint: "點一下問題，直接問小智",
    msgExpand: "展開全部", msgCollapse: "收合", msgSave: "收藏", msgSaved: "已收藏", msgDelete: "刪除", msgDeleteConfirm: "要刪除這則回覆嗎？",
    meFavorites: "我的收藏", meNoFavorites: "還沒有收藏。在陪讀對話中點一下「收藏」，把小智的回答留下來。",
    meFontSize: "字級大小", fontStandard: "標準", fontLarge: "大", fontXLarge: "特大", fontXXLarge: "超大",
    meVoice: "朗讀聲音",
    modeRead: "讀", modeShare: "享", modeTeach: "講", modeLead: "帶",
    modeReadDesc: "完整版講章", modeShareDesc: "部落格文章・一鍵分享", modeTeachDesc: "投影片＋講解重點＋逐字稿", modeLeadDesc: "全螢幕帶領：投影片→討論→操練",
    keyVerse: "主題經文", practices: "本課操練", practiceHint: "勾選你今天要去做的一項，記入操練簿。", practiceFor: "為誰操練？（可不填）", practiceSaved: "已記入操練簿",
    declarations: "信心宣告", prayer: "回應禱告", discussion: "小組討論",
    copyAll: "複製全文", copied: "已複製 ✓", shareBtn: "分享", exportSlides: "匯出投影片文字", slides12: "12張（15分鐘）", slides21: "21張（30分鐘）",
    speakerNotes: "講解重點", script: "口語逐字稿", loading: "載入中…",
    my2: "我的「2」", my2Hint: "每一個跟你有關係的人，都是你的「2」。寫下他們的名字，在他們面前操練無己「0」的生命，結出聖靈的「9」樣果子。", my2Add: "新增", my2Placeholder: "名字或稱呼",
    unitOverview: "單元總覽",
  };
var UI_ZS = {
    brand: "落实321", tabToday: "今日", tabCourse: "课程", tabTools: "工具", tabCompanion: "陪读", tabMe: "我的",
    continueReading: "继续阅读", startPart: "开始新的单元", todayVerse: "今日金句",
    partLabel: "单元", lessonLabel: "课", allParts: "十单元・173课总览",
    readBtn: "阅读本课", markDone: "标记完成本课", doneLabel: "已完成", inProgress: "阅读中", notStarted: "尚未开始",
    tools: "工具", toolJourney: "321旅程地图", toolJourneyDesc: "八大步骤×十单元进度视觉化",
    toolTracks: "关键词轨迹", toolTracksDesc: "无己、谦卑、920…在全书的轨迹",
    toolChecklist: "教导诚信检核", toolChecklistDesc: "讲员／小组长自我检核",
    toolPrompter: "提词机／小组带领", toolPrompterDesc: "全萤幕投影片＋讨论题＋计时",
    toolSpeaker: "讲员工具箱", toolSpeakerDesc: "投影片文字一键汇出、讲章计时",
    tool920: "920操练簿", tool920Desc: "我的「2」与操练纪录",
    companionTitle: "小智．落实教练", companionIntro: "我在这里陪你把这一课「落实」到生活里：先回到圣经，再回到321理念，最后找出一个今天就能做的最小行动。你可以问我任何关于这一课、或321理念的问题。",
    companionPlaceholder: "输入你的问题…", companionSend: "送出", companionNeedNet: "陪读需要网路连线",
    meHighlights: "我的画线笔记", meDeclarations: "宣告簿", meProgress: "阅读进度", meSettings: "设定", mePractices: "操练纪录",
    meNoHighlights: "还没有画线笔记。阅读时点一下句子即可画线。",
    meNoDeclarations: "还没有宣告纪录。读到「信心宣告」时，点一下宣告句或写下你的宣告。",
    meNoPractices: "还没有操练纪录。读完一课，勾选一项操练，今天就去做。",
    themeLight: "浅色", themeDark: "深色", themeAuto: "跟随系统",
    writeDeclaration: "写下你的宣告", saveDecl: "储存宣告", declSaved: "已储存", declPick: "点一下宣告句，存入宣告簿",
    startPrompterMsg: "小组带领模式", phase: "阶段", question: "题", closing: "收尾",
    wakeLockOn: "萤幕保持唤醒", exitPrompter: "结束", promptClose: "退出", prev: "上一页", next: "下一页",
    backHome: "首页", backToc: "目录", readAloud: "朗读", pauseAloud: "暂停", resumeAloud: "继续朗读", stopAloud: "停止", ttsUnsupported: "这台装置不支援语音朗读", ttsLoading: "准备语音中…", fontSizeLabel: "调整字级大小",
    hlAddNote: "加笔记", hlEditNote: "编辑笔记", hlAskXz: "问小智", hlNotePlaceholder: "写下你的领受或问题…", hlSave: "储存", hlCancel: "取消", askAboutLine: "关于这一段：「", askAboutLineEnd: "」——",
    hlSheetTitle: "✍️ 写下你的领受", hlReflectionPlaceholder: "这句话带给你什么领受、感动，或圣灵的提醒？写下来，把焦点对准耶稣……", hlSaveReflection: "储存领受", hlClearNote: "删除领受", hlRemoveHighlight: "移除画线", hlColorLabel: "画线颜色",
    hlHint: "💡 读到圣灵光照、有感动的句子，点一下就能画线；画线后再点一下可以写下你的领受。",
    tracksTitle: "关键词轨迹", occurrences: "次", chaptersSpanned: "课出现",
    checklistTitle: "教导诚信检核", checklistPickChapter: "选择要检核的课别", checklistDone: "已完成",
    journeyTitle: "321旅程地图",
    tier: { A: "A｜圣经明文教导", B: "B｜可讨论的神学推论", C: "C｜321应用性表达" },
    companionQsToggle: "💡 范例问题", companionQsHide: "收起范例问题", companionQsHint: "点一下问题，直接问小智",
    msgExpand: "展开全部", msgCollapse: "收合", msgSave: "收藏", msgSaved: "已收藏", msgDelete: "删除", msgDeleteConfirm: "要删除这则回复吗？",
    meFavorites: "我的收藏", meNoFavorites: "还没有收藏。在陪读对话中点一下「收藏」，把小智的回答留下来。",
    meFontSize: "字级大小", fontStandard: "标准", fontLarge: "大", fontXLarge: "特大", fontXXLarge: "超大",
    meVoice: "朗读声音",
    modeRead: "读", modeShare: "享", modeTeach: "讲", modeLead: "带",
    modeReadDesc: "完整版讲章", modeShareDesc: "部落格文章・一键分享", modeTeachDesc: "投影片＋讲解重点＋逐字稿", modeLeadDesc: "全萤幕带领：投影片→讨论→操练",
    keyVerse: "主题经文", practices: "本课操练", practiceHint: "勾选你今天要去做的一项，记入操练簿。", practiceFor: "为谁操练？（可不填）", practiceSaved: "已记入操练簿",
    declarations: "信心宣告", prayer: "回应祷告", discussion: "小组讨论",
    copyAll: "复制全文", copied: "已复制 ✓", shareBtn: "分享", exportSlides: "汇出投影片文字", slides12: "12张（15分钟）", slides21: "21张（30分钟）",
    speakerNotes: "讲解重点", script: "口语逐字稿", loading: "载入中…",
    my2: "我的「2」", my2Hint: "每一个跟你有关系的人，都是你的「2」。写下他们的名字，在他们面前操练无己「0」的生命，结出圣灵的「9」样果子。", my2Add: "新增", my2Placeholder: "名字或称呼",
    unitOverview: "单元总览", heroSub: "晨读321 全套一百七十三课・读 享 讲 带", plan: "读经计划",
  };
  var UI = { zh: UI_ZH, zs: UI_ZS, en: UI_ZH };

  var state = {
    lang: (localStorage.getItem(LANG_KEY) === "zs" ? "zs" : "zh"),
    index: null,          // data.zh.index.json
    units: {},            // n -> unit pack (lessons map)
    d: { chapters: {}, companionQs: [] }, // D() view: merged chapters from all loaded units
    tracks: null,
    user: loadUser(),
    font: parseInt(localStorage.getItem(FONT_KEY), 10) || 0,
  };
  function t() { return UI[state.lang]; }
  try { document.documentElement.setAttribute("data-lang", state.lang); } catch (e) {}

  function applyFont() {
    try {
      document.documentElement.classList.remove("fs-lg", "fs-xl", "fs-xxl");
      var cls = FONT_CLASS[state.font] || "";
      if (cls) document.documentElement.classList.add(cls);
    } catch (e) {}
  }
  function setFont(n) {
    state.font = n;
    try { localStorage.setItem(FONT_KEY, String(state.font)); } catch (e) {}
    applyFont();
  }
  function cycleFont() { setFont((state.font + 1) % FONT_CLASS.length); }
  window.cycleFont = cycleFont;

  // ---------------------------------------------------------------
  // 語音朗讀 Read-Aloud — Azure real-voice via Cloudflare Worker (azure-tts.spch321.workers.dev),
  // falls back to the device's built-in speechSynthesis if the Worker is unreachable.
  // NOTE: this sandbox has no egress to *.workers.dev, so the Azure path is written to the
  // same documented request contract as the existing companion/TTS Workers but is UNTESTED
  // against the live Worker — verify voice names + response format after deploying, exactly
  // like the companion chat's known limitation.
  // ---------------------------------------------------------------
  var TTS_ENDPOINT = "https://azure-tts.spch321.workers.dev";
  var TTS_SIL_SENTENCE = 140, TTS_SIL_COMMA = 140, TTS_SIL_ENUM = 260;
  // 每個語言版本可選的朗讀聲音——跟姊妹App「晨讀321」共用同一個Worker、同一批Azure真人語音，
  // 使用者可在「我的」分頁依目前所在的語言版本切換；voice id存在 state.user.ttsVoice[lang]。
  var TTS_VOICE_OPTIONS = {
    zh: [
      { id: "yunjhe", voice: "zh-TW-YunJheNeural", label: "雲哲" },
      { id: "yunfan", voice: "zh-CN-Yunfan:DragonHDLatestNeural", label: "雲帆" },
      { id: "xiaochen", voice: "zh-CN-Xiaochen:DragonHDLatestNeural", label: "曉辰" },
    ],
    zs: [
      { id: "yunfan", voice: "zh-CN-Yunfan:DragonHDLatestNeural", label: "云帆" },
      { id: "yunjhe", voice: "zh-TW-YunJheNeural", label: "云哲" },
      { id: "xiaochen", voice: "zh-CN-Xiaochen:DragonHDLatestNeural", label: "晓辰" },
    ],
    en: [
      { id: "andrew", voice: "en-US-AndrewNeural", label: "Andrew" },
      { id: "emma", voice: "en-US-EmmaNeural", label: "Emma" },
      { id: "brian", voice: "en-US-BrianNeural", label: "Brian" },
    ],
  };
  var TTS_VOICE_DEFAULT = { zh: "yunjhe", zs: "yunfan", en: "andrew" };

  // ---------------------------------------------------------------
  // Highlight colors — picked from the "顏色" swatch row inside the reflection sheet, stored
  // per-highlight as h.color (default "gold" for both new highlights and any highlight saved
  // before this feature existed). `dot` is the swatch button's own fixed color (same in light
  // and dark mode, like a real highlighter's cap color); the actual soft background tint shown
  // behind highlighted text is theme-aware and lives in CSS as --hlbg-<id> (gold reuses the
  // existing --gold-soft var rather than a new one).
  var HL_COLORS = [
    { id: "gold", dot: "#D9A73D" },
    { id: "green", dot: "#6FAE71" },
    { id: "blue", dot: "#6C93D1" },
    { id: "pink", dot: "#E58FA0" },
    { id: "purple", dot: "#A48AC9" },
    // v1.3.13：深色系三色（酒紅／咖啡棕／墨黑），跟前五色的淺亮色系做出區隔，
    // 適合想標記「較沉重、較嚴肅」語氣的段落（例如警語、罪性反省）時使用。
    { id: "maroon", dot: "#8C4A4E" },
    { id: "brown", dot: "#8A6740" },
    { id: "charcoal", dot: "#54534E" },
  ];
  var HL_COLOR_NAMES = {
    zh: { gold: "金", green: "綠", blue: "藍", pink: "粉", purple: "紫", maroon: "酒紅", brown: "咖啡", charcoal: "墨黑" },
    zs: { gold: "金", green: "绿", blue: "蓝", pink: "粉", purple: "紫", maroon: "酒红", brown: "咖啡", charcoal: "墨黑" },
    en: { gold: "Gold", green: "Green", blue: "Blue", pink: "Pink", purple: "Purple", maroon: "Maroon", brown: "Brown", charcoal: "Charcoal" },
  };

  // ---------------------------------------------------------------
  // TTS pronunciation fix-up ("破音字" homophone substitution) — applied ONLY
  // to the text sent to the speech engine, never to anything shown on screen.
  // Chinese TTS engines routinely mis-read polyphonic characters (破音字);
  // these word-level substitutions swap in a homophone that forces the
  // correct reading, per Taiwan (zh) vs Mainland (zs) standard pronunciation.
  // Applied longest-pattern-first so multi-character phrases aren't partially
  // clobbered by a shorter overlapping pattern.
  // ---------------------------------------------------------------
  var TTS_FIX_ZH = [ // Traditional Chinese / Taiwan standard reading
    ["血液循環", "寫液循環"], ["血流成河", "穴流成河"], ["心血", "心穴"], ["流血", "流寫"],
    ["便宜貨", "胼宜貨"], ["方便", "方變"], ["順便", "順變"],
    ["得著", "得鑿"], ["睡著", "睡鑿"], ["著火", "鑿火"], ["著陸", "灼陸"], ["著想", "灼想"], ["著裝", "灼裝"], ["看著", "看這"], ["聽著", "聽這"], ["慢著", "慢這"],
    ["我和你", "我漢你"], ["一唱一和", "一唱一賀"], ["和平", "何平"], ["和麵", "活麵"],
    ["期待", "七待"], ["星期", "星七"], ["期間", "七間"],
    ["阿姨", "啊姨"], ["阿諛奉承", "婀諛奉承"],
    ["把手拿開", "巴手拿開"], ["刀把", "刀爸"], ["茶壺把兒", "茶壺爸兒"],
    ["紙很薄", "紙很刨"], ["薄弱", "勃弱"], ["刻薄", "刻勃"], ["薄荷糖", "迫荷糖"],
    ["背景", "貝景"], ["背叛", "貝叛"], ["背包", "杯包"],
    ["東奔西跑", "東本西跑"], ["投奔", "投笨"], ["奔向目標", "笨向目標"],
    ["參加", "餐加"], ["人參", "人深"], ["參差不齊", "蹭差不齊"],
    ["收藏", "收常"], ["躲藏", "躲常"], ["西藏", "西葬"], ["寶藏", "寶葬"],
    ["差別", "叉別"], ["很差", "很岔"], ["差點", "岔點"], ["出差", "出柴"], ["公差", "公柴"], ["參差", "參呲"],
    ["長短", "常短"], ["長江", "常江"], ["長大", "掌大"], ["校長", "校掌"],
    ["組長", "組掌"], ["長執", "掌執"], ["長老", "掌老"], ["家長", "家掌"], ["增長", "增掌"], ["長進", "掌進"], ["部長", "部掌"],
    ["倒車", "道車"], ["倒茶", "道茶"], ["跌倒", "跌島"], ["公司倒閉", "公司島閉"],
    ["得到", "德到"], ["你得加油", "你歹加油"], ["跑得快", "跑的快"],
    ["的確", "敵確"], ["目的", "目地"],
    ["身分", "身份"], ["本分", "本份"], ["分開", "吩開"],
    ["角色", "決色"], ["主角", "主決"], ["角度", "腳度"],
    ["企業企劃", "氣業氣劃"],
    ["懸崖勒馬", "懸巖樂馬"], ["勒索", "樂索"], ["勒緊", "雷緊"],
    ["測量", "測良"], ["量身高", "良身高"], ["數量", "數亮"], ["力量", "力亮"],
    ["露水", "路水"], ["暴露", "暴路"], ["露馬腳", "漏馬腳"],
    ["降落", "降洛"], ["落枕", "酪枕"], ["丟三落四", "丟三辣四"],
    ["效率", "效綠"], ["機率", "機綠"], ["率領", "帥領"],
    ["困難", "苦南"], ["災難", "災南"],
    ["強大", "牆大"], ["勉強", "勉搶"], ["倔強", "倔匠"],
    ["切西瓜", "七西瓜"], ["一切", "一妾"],
    ["彎曲", "彎區"], ["歌曲", "歌取"],
    ["塞車", "腮車"], ["阻塞", "阻澀"], ["邊塞", "邊賽"],
    ["少年", "哨年"], ["老少咸宜", "老哨咸宜"],
    ["剝削", "剝靴"], ["削蘋果", "消蘋果"],
    ["液體", "頁體"], ["汁液", "汁頁"],
    ["記載", "記宰"], ["刊載", "刊宰"], ["載客", "在客"], ["載歌載舞", "在歌在舞"],
    ["骯髒", "骯張"], ["內臟", "內葬"],
    ["中間", "忠間"], ["中獎", "眾獎"], ["中毒", "眾毒"],
    ["種子", "腫子"], ["種花", "眾花"],
    ["教會", "叫會"], // 全書「教會」都是名詞（宗教/教育的教，ㄐㄧㄠˋ），不是「教書」的ㄐㄧㄠ動詞讀音
    ["看、聽、想、講、行", "看、聽、想、講、型"], // 提綱固定用語「看聽想講行」的「行」是ㄒㄧㄥˊ（力行/實行），不是ㄏㄤˊ／ㄒㄧㄥˋ
  ];
  var TTS_FIX_ZS = [ // Simplified Chinese / Mainland standard reading
    ["血液循环", "穴液循环"], ["流血了", "流写了"], ["血淋淋", "写淋淋"],
    ["便宜货", "胼宜货"], ["方便", "方变"], ["顺便", "顺变"],
    ["得着", "得凿"], ["睡着", "睡凿"], ["着火", "凿火"], ["着陆", "灼陆"], ["着想", "灼想"], ["着装", "灼装"], ["看着", "看这"], ["听着", "听这"],
    ["我和你", "我河你"], ["一唱一和", "一唱一贺"], ["和面", "活面"], ["和泥", "活泥"], ["搅和", "搅货"],
    ["期待", "七待"], ["星期", "星七"], ["期间", "七间"],
    ["阿姨", "啊姨"], ["阿谀奉承", "婀谀奉承"],
    ["把手拿开", "巴手拿开"], ["刀把", "刀爸"], ["茶壶把儿", "茶壶爸儿"],
    ["纸很薄", "纸很雹"], ["薄弱", "勃弱"], ["刻薄", "勃刻"], ["薄荷糖", "迫荷糖"],
    ["背景", "贝景"], ["背叛", "贝叛"], ["背包", "杯包"],
    ["东奔西跑", "东本西跑"], ["投奔", "投笨"], ["奔向目标", "笨向目标"],
    ["参加", "餐加"], ["人参", "人深"], ["参差不齐", "蹭差不齐"],
    ["收藏", "收常"], ["躲藏", "躲常"], ["西藏", "西葬"], ["宝藏", "宝葬"],
    ["差别", "叉别"], ["很差", "很岔"], ["差点", "岔点"], ["出差", "出柴"], ["公差", "公柴"], ["参差", "参呲"],
    ["长短", "常短"], ["长江", "常江"], ["长大", "掌大"], ["校长", "校掌"],
    ["组长", "组掌"], ["长执", "掌执"], ["长老", "掌老"], ["家长", "家掌"], ["增长", "增掌"], ["长进", "掌进"], ["部长", "部掌"],
    ["倒车", "道车"], ["倒茶", "道茶"], ["跌倒", "跌岛"], ["公司倒闭", "公司岛闭"],
    ["得到", "德到"], ["你得加油", "你歹加油"], ["跑得快", "跑的快"],
    ["的确", "敌确"], ["目的", "目地"],
    ["成分", "成份"], ["分开", "吩开"],
    ["角色", "决色"], ["主角", "主决"], ["角度", "脚度"],
    ["企业企划", "起业起划"],
    ["测量", "测良"], ["量身高", "良身高"], ["数量", "数亮"], ["力量", "力亮"],
    ["露水", "路水"], ["暴露", "暴路"], ["露马脚", "漏马脚"],
    ["降落", "降洛"], ["落枕", "酪枕"], ["丢三落四", "丢三辣四"],
    ["效率", "效绿"], ["机率", "机绿"], ["率领", "帅领"],
    ["困难", "苦南"], ["灾难", "灾南"],
    ["强大", "墙大"], ["勉强", "勉抢"], ["倔强", "倔匠"],
    ["切西瓜", "七西瓜"], ["一切", "一妾"],
    ["弯曲", "弯区"], ["歌曲", "歌取"],
    ["塞车", "腮车"], ["阻塞", "阻色"], ["边塞", "边赛"],
    ["少年", "哨年"], ["老少咸宜", "老哨咸宜"],
    ["剥削", "剥靴"], ["削苹果", "消苹果"],
    ["液体", "夜体"], ["汁液", "汁夜"],
    ["记载", "记宰"], ["刊载", "刊宰"], ["载客", "在客"], ["载歌载舞", "在歌在舞"],
    ["肮脏", "肮张"], ["内脏", "内葬"],
    ["中间", "忠间"], ["中奖", "众奖"], ["中毒", "众毒"],
    ["种子", "肿子"], ["种花", "众花"],
    ["教会", "叫会"], // 全书「教会」都是名词（宗教/教育的教，ㄐㄧㄠˋ），不是「教书」的ㄐㄧㄠ动词读音
    ["看、听、想、讲、行", "看、听、想、讲、型"], // 提纲固定用语「看听想讲行」的「行」是ㄒㄧㄥˊ（力行/实行），不是ㄏㄤˊ／ㄒㄧㄥˋ
  ];
  // 321專用術語的數字要「逐字讀」（3-2-1／9-2-0／2-3-5），不是唸成整數
  // （如「三百二十一」）。用正則把獨立出現的321/920/235換成逐字的中文數字，
  // 只在zh／zs生效；(?<![0-9])…(?![0-9]) 確保不會誤觸更長數字（如1920、2350）中的子字串。
  // v1.3.12曾經試著改成「後面緊接中文字時保留阿拉伯數字原樣、交給語音引擎自己唸」，
  // 目的是讓「321理念」這種緊接中文字的品牌複合詞唸起來不要像分開的倒數語氣；
  // v1.3.14修正（還原）：實測發現這個調整反而更糟——語音引擎把沒轉換的阿拉伯數字「321」
  // 直接當成整數唸，繁體唸成「三百二十一」、簡體唸成更離譜的「三二十一」，完全錯誤，
  // 比原本「三…二…一…」略顯生硬但至少數字正確的唸法還糟。所以改回一律逐字轉換
  // （只要不是被更長的數字包住，例如1920、2350裡的子字串不會誤觸），
  // 不再依「後面是否緊接中文字」而保留原樣。
  var TTS_DIGIT_FIXES = [
    [/(?<![0-9])321(?![0-9])/g, "三二一"],
    [/(?<![0-9])920(?![0-9])/g, "九二零"],
    [/(?<![0-9])235(?![0-9])/g, "二三五"],
  ];
  // English edition: same brand terms should be read digit-by-digit too ("three two one",
  // not "three hundred twenty-one"). Same not-adjacent-to-another-digit guard.
  var TTS_DIGIT_FIXES_EN = [
    [/(?<![0-9])321(?![0-9])/g, "three two one"],
    [/(?<![0-9])920(?![0-9])/g, "nine two zero"],
    [/(?<![0-9])235(?![0-9])/g, "two three five"],
  ];
  // 「為大／为大」全書幾乎都是「以…為大」「誰願為大」這種「認為是大」的用法，要讀ㄨㄟˊ
  // (wéi)，不是「為了」的ㄨㄟˋ(wèi)；唯一例外是「為大使命」（為了大使命），這裡的「為」
  // 是ㄨㄟˋ，所以用負向前瞻排除掉，其餘一律換成同音字「惟」強制唸成ㄨㄟˊ。
  var TTS_WEI_DA_FIX = [
    [/為大(?!使命)/g, "惟大"],
    [/为大(?!使命)/g, "惟大"],
  ];
  // 中式編號「一、」「二、」…唸出來要用自然的口吻帶成「第一，」「第二，」，不是把「、」
  // 前的數字單獨唸出來，聽起來才像真人在說話，不是機械式報數字。
  var TTS_ENUM_FIX = /([一二三四五六七八九十百]+)、/g;

  // ---------------------------------------------------------------
  // 朗讀時跳過「純經文出處」的括號附註（如「（約翰福音十三章三至五節）」／
  // "(John 13:3–5)"）——那只是給讀者自己核對用的出處標示，唸出來反而生硬；
  // 但保留解釋性括號（如「（約20分鐘）」「（我沒有資格談領導）」），因為那些是
  // 內容的一部分。做法：先看括號裡有沒有「聖經書卷名+數字」，沒有就完全不動；
  // 有的話，把「書卷+章節」這種出處片段整段拿掉，剩下的內容如果還有東西（代表
  // 括號裡不只是出處，還夾雜別的說明），就整個括號原封不動保留；如果拿掉出處後
  // 什麼都不剩，才把整個括號（連同前面的空格）一起刪除。
  // ---------------------------------------------------------------
  var BIBLE_BOOKS_ZH = [
    "創世記", "創", "出埃及記", "出", "利未記", "利", "民數記", "民", "申命記", "申", "約書亞記", "書", "士師記", "士", "路得記", "得",
    "撒母耳記上", "撒上", "撒母耳記下", "撒下", "列王紀上", "王上", "列王紀下", "王下", "歷代志上", "代上", "歷代志下", "代下",
    "以斯拉記", "拉", "尼希米記", "尼", "以斯帖記", "斯", "約伯記", "伯", "詩篇", "詩", "箴言", "箴", "傳道書", "傳", "雅歌", "歌",
    "以賽亞書", "賽", "耶利米書", "耶", "耶利米哀歌", "哀", "以西結書", "結", "但以理書", "但",
    "何西阿書", "何", "約珥書", "珥", "阿摩司書", "摩", "俄巴底亞書", "俄", "約拿書", "拿", "彌迦書", "彌",
    "那鴻書", "鴻", "哈巴谷書", "哈", "西番雅書", "番", "哈該書", "該", "撒迦利亞書", "亞", "瑪拉基書", "瑪",
    "馬太福音", "太", "馬可福音", "可", "路加福音", "路", "約翰福音", "約", "使徒行傳", "徒", "羅馬書", "羅",
    "哥林多前書", "林前", "哥林多後書", "林後", "加拉太書", "加", "以弗所書", "弗", "腓立比書", "腓",
    "歌羅西書", "西", "帖撒羅尼迦前書", "帖前", "帖撒羅尼迦後書", "帖後", "提摩太前書", "提前", "提摩太後書", "提後",
    "提多書", "多", "腓利門書", "門", "希伯來書", "來", "雅各書", "雅",
    "彼得前書", "彼前", "彼得後書", "彼後", "約翰一書", "約一", "約壹", "約翰二書", "約二", "約貳", "約翰三書", "約三", "約參",
    "猶大書", "猶", "啟示錄", "啟",
  ];
  // NOTE (fixed in v1.3.7): this list used to be independently (and incompletely) authored —
  // it was missing "路加福音"/"路" (Luke) entirely, plus most single-character book
  // abbreviations (创/出/利/民/申/得/太/可/路/徒/加/弗/腓/西/雅/多/彼前/帖前/帖后/提前/提后 …).
  // Any scripture citation using one of those missing forms silently failed the
  // "book name + number" detection in stripScriptureRefParens() and so never got skipped
  // during 簡體 read-aloud. Now generated as an exact simplified-character mirror of
  // BIBLE_BOOKS_ZH (same 135 entries, same order) so the two lists can never drift apart again.
  var BIBLE_BOOKS_ZS = [
    "创世记", "创", "出埃及记", "出", "利未记", "利", "民数记", "民", "申命记", "申", "约书亚记", "书", "士师记", "士", "路得记", "得", "撒母耳记上", "撒上", "撒母耳记下", "撒下", "列王纪上", "王上", "列王纪下", "王下", "历代志上", "代上", "历代志下", "代下", "以斯拉记", "拉", "尼希米记", "尼", "以斯帖记", "斯", "约伯记", "伯", "诗篇", "诗", "箴言", "箴", "传道书", "传", "雅歌", "歌", "以赛亚书", "赛", "耶利米书", "耶", "耶利米哀歌", "哀", "以西结书", "结", "但以理书", "但", "何西阿书", "何", "约珥书", "珥", "阿摩司书", "摩", "俄巴底亚书", "俄", "约拿书", "拿", "弥迦书", "弥", "那鸿书", "鸿", "哈巴谷书", "哈", "西番雅书", "番", "哈该书", "该", "撒迦利亚书", "亚", "玛拉基书", "玛", "马太福音", "太", "马可福音", "可", "路加福音", "路", "约翰福音", "约", "使徒行传", "徒", "罗马书", "罗", "哥林多前书", "林前", "哥林多后书", "林后", "加拉太书", "加", "以弗所书", "弗", "腓立比书", "腓", "歌罗西书", "西", "帖撒罗尼迦前书", "帖前", "帖撒罗尼迦后书", "帖后", "提摩太前书", "提前", "提摩太后书", "提后", "提多书", "多", "腓利门书", "门", "希伯来书", "来", "雅各书", "雅", "彼得前书", "彼前", "彼得后书", "彼后", "约翰一书", "约一", "约壹", "约翰二书", "约二", "约贰", "约翰三书", "约三", "约参", "犹大书", "犹", "启示录", "启",
  ];
  var BIBLE_BOOKS_EN = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
    "Ezra", "Nehemiah", "Esther", "Job", "Psalm", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Song of Songs",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
    "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
    "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians",
    "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
    "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation",
  ];
  function bibleBooksAlt(arr) {
    return arr.slice().sort(function (a, b) { return b.length - a.length; }).join("|");
  }
  var BIBLE_ALT_ZH = bibleBooksAlt(BIBLE_BOOKS_ZH);
  var BIBLE_ALT_ZS = bibleBooksAlt(BIBLE_BOOKS_ZS);
  var BIBLE_ALT_EN = bibleBooksAlt(BIBLE_BOOKS_EN);
  // ---------------------------------------------------------------
  // Canonical book-name lookup (alias/abbreviation → full name), built directly from the same
  // flat BIBLE_BOOKS_ZH/ZS arrays above so it can never drift out of sync with them. The flat
  // arrays are laid out as consecutive groups of [fullName, abbrev, abbrev...] — 61 books with
  // exactly 1 abbreviation, then 約翰一/二/三書 (约翰一/二/三书) with 2 abbreviations each, then
  // 猶大書/啟示錄 (犹大书/启示录) with 1 abbreviation each — 66 books, 135 entries total.
  var BIBLE_BOOK_GROUP_SIZES = (function () {
    var sizes = [];
    for (var i = 0; i < 61; i++) sizes.push(2);
    sizes.push(3, 3, 3);
    sizes.push(2, 2);
    return sizes;
  })();
  function buildBookCanon(flatArr) {
    var map = {}, idx = 0;
    BIBLE_BOOK_GROUP_SIZES.forEach(function (sz) {
      var full = flatArr[idx];
      for (var j = 0; j < sz; j++) map[flatArr[idx + j]] = full;
      idx += sz;
    });
    return map;
  }
  var BIBLE_CANON_ZH = buildBookCanon(BIBLE_BOOKS_ZH);
  var BIBLE_CANON_ZS = buildBookCanon(BIBLE_BOOKS_ZS);
  // Arabic-numeral → spoken Chinese numeral (covers Bible chapter/verse numbers, max ~176).
  function numToZh(n) {
    n = parseInt(n, 10);
    if (!isFinite(n)) return String(n);
    var d = "零一二三四五六七八九";
    if (n === 0) return d[0];
    if (n < 10) return d[n];
    if (n < 20) return "十" + (n % 10 ? d[n % 10] : "");
    if (n < 100) {
      var tens = Math.floor(n / 10), ones = n % 10;
      return d[tens] + "十" + (ones ? d[ones] : "");
    }
    var hundreds = Math.floor(n / 100), rem = n % 100;
    var out = d[hundreds] + "百";
    if (rem === 0) return out;
    if (rem < 10) return out + "零" + d[rem];
    var tens2 = Math.floor(rem / 10), ones2 = rem % 10;
    if (tens2 === 1) return out + "一十" + (ones2 ? d[ones2] : "");
    return out + d[tens2] + "十" + (ones2 ? d[ones2] : "");
  }
  // Expands abbreviated scripture citations (as 小智/Sage AI's freeform replies tend to write
  // them, e.g. "太28:19-20" or "约3:16") into the fully spoken Chinese form ("馬太福音二十八章
  // 十九到二十節" / "约翰福音三章十六节") — the book content's own 55 fixed chapters never use
  // this abbreviated arabic-numeral notation (already verified: 0 occurrences in either corpus),
  // so this only ever fires on the AI companion's dynamically generated text. Runs AFTER
  // stripScriptureRefParens() on purpose: that function only recognizes the already-fully-spelled-
  // out "書卷名+中文數字+章...節" form used by the book itself, so it correctly leaves this
  // abbreviated colon/arabic form untouched — if the order were reversed, the freshly-expanded
  // citation would then look exactly like the book's own skippable footnote citations and get
  // silently stripped instead of read aloud.
  function expandScriptureRefs(text, lang) {
    if (lang !== "zh" && lang !== "zs") return text;
    var alt = lang === "zs" ? BIBLE_ALT_ZS : BIBLE_ALT_ZH;
    var canon = lang === "zs" ? BIBLE_CANON_ZS : BIBLE_CANON_ZH;
    var jie = lang === "zs" ? "节" : "節";
    if (!alt) return text;
    var out = String(text || "");
    var reColon = new RegExp("(" + alt + ")\\s*([0-9]{1,3})\\s*[:：]\\s*([0-9]{1,3})(?:\\s*[-–~]\\s*([0-9]{1,3}))?", "g");
    var reZhang = new RegExp("(" + alt + ")\\s*([0-9]{1,3})\\s*章\\s*([0-9]{1,3})(?:\\s*[至到\\-–~]\\s*([0-9]{1,3}))?\\s*" + jie + "?", "g");
    function expand(m, book, chap, v1, v2) {
      var full = canon[book] || book;
      // 詩篇／诗篇的「篇」不是「章」——中文習慣說「詩篇六十二篇八節」，不是「詩篇六十二章八節」，
      // 這是聖經書卷裡唯一的例外（其餘65卷都用「章」），所以這裡單獨判斷書卷全名來換單位詞。
      var unit = (full === "詩篇" || full === "诗篇") ? "篇" : "章";
      var s = full + numToZh(chap) + unit + numToZh(v1);
      if (v2) s += "到" + numToZh(v2);
      return s + jie;
    }
    out = out.replace(reColon, expand);
    out = out.replace(reZhang, expand);
    return out;
  }
  // Strips emoji (and the invisible variation-selector/ZWJ codepoints that often ride along with
  // them) before TTS — 小智/Sage AI's replies sometimes end a sentence with a friendly emoji
  // (😊🙏✨❤️👍 etc.), which TTS engines otherwise mangle into an awkward spoken word/noise.
  // Deliberately narrow ranges (BMP Dingbats/Misc Symbols/Misc Symbols&Arrows + the supplementary-
  // plane pictograph blocks used by nearly all emoji) so this never touches meaningful punctuation
  // or symbols actually used in the book's own text (e.g. "→" U+2192 is in the Arrows block,
  // U+2190–21FF, which is intentionally NOT included here).
  var EMOJI_RE = /[\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200D]|[\uD83C-\uD83E][\uDC00-\uDFFF]/g;
  function stripEmoji(text) {
    return String(text || "").replace(EMOJI_RE, "").replace(/[ \t]{2,}/g, " ");
  }
  function stripScriptureRefParens(text, lang) {
    var alt = lang === "en" ? BIBLE_ALT_EN : (lang === "zs" ? BIBLE_ALT_ZS : BIBLE_ALT_ZH);
    if (!alt) return text;
    var hasBookDigit = new RegExp("(" + alt + ")\\s*[0-9一二三四五六七八九十百千]");
    var refToken = lang === "en"
      ? new RegExp("(" + alt + ")\\s+[0-9]{1,3}\\s*[:：]\\s*[0-9]{1,3}(?:\\s*[-–~]\\s*[0-9]{1,3})?", "g")
      : new RegExp("(" + alt + ")\\s*[一二三四五六七八九十百千0-9]+\\s*章\\s*[一二三四五六七八九十百千0-9]*(?:\\s*[至到\\-–~]\\s*[一二三四五六七八九十百千0-9]+)?\\s*[節节]?", "g");
    return String(text || "").replace(/\s?[（(]([^（）()]*)[）)]/g, function (m, inner) {
      if (!hasBookDigit.test(inner)) return m; // no "book name + number" inside → not a reference, leave untouched
      var t = inner.replace(refToken, "");
      // NOTE: this connector-cleanup list must cover BOTH Traditional and Simplified forms of
      // every particle (與/与, 見/见, 節/节, 參/参, …) — a Simplified-only leftover here used to
      // make the SC edition wrongly conclude "something meaningful remains" and keep the whole
      // parenthetical un-stripped, even though the reference token itself had matched fine.
      t = lang === "en" ? t.replace(/\b(and|cf|see)\b/gi, "") : t.replace(/[、，,;；和與与及節节章篇上下至到參参见見cf]/gi, "");
      t = t.replace(/[\s\-–~:：]/g, "");
      return t.length ? m : ""; // anything meaningful left over → keep the whole parenthetical as-is
    });
  }

  function ttsPronounceFix(text) {
    if (!text) return text;
    var out = String(text);
    out = stripEmoji(out);
    out = stripScriptureRefParens(out, state.lang);
    out = expandScriptureRefs(out, state.lang);
    if (state.lang === "zh" || state.lang === "zs") {
      TTS_DIGIT_FIXES.forEach(function (pair) { out = out.replace(pair[0], pair[1]); });
      TTS_WEI_DA_FIX.forEach(function (pair) { out = out.replace(pair[0], pair[1]); });
      out = out.replace(TTS_ENUM_FIX, "第$1，");
    } else if (state.lang === "en") {
      TTS_DIGIT_FIXES_EN.forEach(function (pair) { out = out.replace(pair[0], pair[1]); });
    }
    var fixes = state.lang === "zs" ? TTS_FIX_ZS : (state.lang === "zh" ? TTS_FIX_ZH : null);
    if (!fixes) return out;
    for (var i = 0; i < fixes.length; i++) { out = out.split(fixes[i][0]).join(fixes[i][1]); }
    return out;
  }

  // `curKey` identifies WHAT is currently playing ("ch:ch01" for a chapter, "msg:<id>" for
  // one companion reply) so any number of 🔊 buttons across the app can each independently
  // know whether they're the one that's active, instead of there being only one hardcoded
  // chapter-toolbar button.
  var spk = {
    supported: (typeof window !== "undefined" && "speechSynthesis" in window),
    active: false, paused: false, loading: false, mode: "", queue: [], idx: 0, token: 0, curKey: null, audio: null, title: "",
    // queueEls[i] is the DOM element (a ".sent" span, or a deeper-card's question span) that
    // corresponds to queue[i], for the chapter read-along highlight/auto-scroll feature — null
    // for a synthetic narration item (a heading, or the "想更深" lead-in phrase) that has no
    // single on-screen sentence to highlight. Left as [] for non-chapter readings (companion
    // chat replies have no per-sentence DOM spans), which the highlight code treats as "no
    // element for any index" — read-along highlighting simply never activates for those.
    queueEls: [],
  };

  // ---------------------------------------------------------------
  // Read-along: highlight the sentence currently being read + smoothly auto-scroll it into
  // view, for chapter reading only (spk.queueEls carries the DOM mapping — see comment above).
  // A soft rounded box-shadow (not `background`) is used for the highlight so it never fights
  // the existing tap-to-highlight color system for the `background` CSS property — both can be
  // visible on the same sentence at once (a user-highlighted sentence currently being read gets
  // both its saved color AND the reading ring).
  // ---------------------------------------------------------------
  var RA_MANUAL_SCROLL_COOLDOWN_MS = 4000; // how long a manual scroll suppresses auto-scroll
  var raState = { curEl: null, userScrollUntil: 0, listening: false };
  function raClearHighlight() {
    if (raState.curEl) { try { raState.curEl.classList.remove("tts-reading"); } catch (e) {} }
    raState.curEl = null;
  }
  function raScrollTo(el) {
    if (!el) return;
    if (Date.now() < raState.userScrollUntil) return; // user is actively scrolling on their own — don't fight them
    try { el.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
  }
  // Manual-scroll detection listens for real user-gesture events (wheel / touch drag / the
  // scroll-relevant keys) rather than the generic "scroll" event. A plain "scroll" listener
  // can't tell our own scrollIntoView call apart from the user's own scrolling — both fire the
  // same event — but wheel/touchmove/keydown only ever happen from an actual person touching
  // the trackpad, mouse wheel, screen, or keyboard, so there's no race to guard against.
  var RA_SCROLL_KEYS = { ArrowUp: 1, ArrowDown: 1, PageUp: 1, PageDown: 1, Home: 1, End: 1, " ": 1, Spacebar: 1 };
  function raOnManualGesture() {
    raState.userScrollUntil = Date.now() + RA_MANUAL_SCROLL_COOLDOWN_MS;
  }
  function raOnKeyDown(e) {
    if (e && RA_SCROLL_KEYS[e.key]) raOnManualGesture();
  }
  function raStartListening() {
    if (raState.listening) return;
    raState.listening = true;
    window.addEventListener("wheel", raOnManualGesture, { passive: true });
    window.addEventListener("touchmove", raOnManualGesture, { passive: true });
    window.addEventListener("keydown", raOnKeyDown);
  }
  function raStopListening() {
    if (!raState.listening) return;
    raState.listening = false;
    window.removeEventListener("wheel", raOnManualGesture);
    window.removeEventListener("touchmove", raOnManualGesture);
    window.removeEventListener("keydown", raOnKeyDown);
  }
  // Called on pause/resume/stop — clears any stale "user just scrolled, stay back" suppression
  // so highlight/scroll behavior always starts clean relative to whatever the playback state
  // just changed to, rather than inheriting a cooldown set up before the pause.
  function raReset() {
    raState.userScrollUntil = 0;
  }
  function spkOnItemStart(idx) {
    var el = (spk.queueEls && spk.queueEls[idx]) || null;
    if (el === raState.curEl) return; // already the highlighted one — nothing to do
    raClearHighlight();
    if (!el) return; // a synthetic narration item (heading / 想更深 lead-in) — nothing to highlight
    try { el.classList.add("tts-reading"); } catch (e) { return; }
    raState.curEl = el;
    raScrollTo(el);
  }

  function spkGetAudio() {
    if (!spk.audio) {
      spk.audio = new Audio();
      spk.audio.preload = "auto";
      try { spk.audio.playsInline = true; spk.audio.setAttribute("playsinline", ""); } catch (e) {}
    }
    return spk.audio;
  }
  function stripHtml(html) {
    var div = document.createElement("div");
    div.innerHTML = html || "";
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
  }
  // split plain text into speakable sentence-sized chunks (CJK + English enders).
  // Chunks are merged up to ~120 chars before cutting (not just at the first sentence-ender)
  // so a reading has fewer, longer pieces — fewer audio-source swaps, which is what actually
  // sounds like a "join" between chunks — matching the sister app 晨讀321's own chunking size.
  function spkChunks(text) {
    var t = String(text || "").replace(/\s+/g, " ").trim();
    if (!t) return [];
    var enders = "。！？；\n";
    var out = [], buf = "";
    for (var i = 0; i < t.length; i++) {
      buf += t[i];
      if (enders.indexOf(t[i]) >= 0 && buf.length >= 120) { out.push(buf); buf = ""; }
    }
    if (buf.trim()) out.push(buf);
    var fin = [];
    out.forEach(function (s) {
      if (/[a-zA-Z]/.test(s) && s.length > 260) {
        s.split(/(?<=[.!?])\s+/).forEach(function (p) { if (p.trim()) fin.push(p.trim()); });
      } else {
        fin.push(s);
      }
    });
    var out2 = [];
    fin.forEach(function (s) {
      while (s.length > 320) { out2.push(s.slice(0, 320)); s = s.slice(320); }
      if (s) out2.push(s);
    });
    return out2.length ? out2 : [t];
  }
  // 帶入「想更深」時，用自然口吻的引言句，而不是把題目/內容直接接在正文後面唸。
  var DEEPER_SPEAK_LEAD = {
    zh: "我們一起來想更深一點。",
    zs: "我们一起来想更深一点。",
    en: "Let's pause for a moment and think a bit deeper.",
  };
  // 確保每一段唸完都有明確的句尾標點，讓朗讀在段落／小標題／想更深之間有自然的停頓，
  // 而不是把不相干的句子直接黏在一起唸。
  function ttsEnsureEnd(s) {
    s = String(s || "").trim();
    if (!s) return "";
    if (!/[。！？；.!?;]$/.test(s)) s += (state.lang === "en" ? "." : "。");
    return s;
  }
  // English section headings are numbered "1. The Night…", "2. Emptying Himself…" — reading
  // the leading digit literally sounds robotic, so for English only, a leading "N. " is
  // swapped for its spoken ordinal ("First, The Night…"), matching the zh/zs TTS_ENUM_FIX's
  // "一、"→"第一，" treatment of the exact same fixed 10-section headings.
  var EN_ORDINALS = ["Zeroth", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"];
  function ttsHeadingOrdinal(heading) {
    if (state.lang !== "en") return heading;
    var m = /^(\d{1,2})\.\s*/.exec(heading || "");
    if (!m) return heading;
    var n = parseInt(m[1], 10);
    var word = EN_ORDINALS[n] || (n + ".");
    return word + ", " + heading.slice(m[0].length);
  }
  function chapterSpeakChunks(ch) {
    var d = D();
    var bank = d.deeperBank || {};
    var anchors = ch.deeper || {};
    var lead = DEEPER_SPEAK_LEAD[state.lang] || DEEPER_SPEAK_LEAD.zh;
    function deeperSpeak(ids) {
      if (!ids || !ids.length) return "";
      var out = "";
      ids.forEach(function (id) {
        var it = bank[id];
        if (!it) return;
        out += " " + lead + " " + ttsEnsureEnd(it.q) + " " + ttsEnsureEnd(it.a);
      });
      return out;
    }
    var parts = [ttsEnsureEnd(stripHtml(ch.intro))];
    parts.push(deeperSpeak(anchors["intro"]));
    (ch.sections || []).forEach(function (s) {
      if (s.heading) parts.push(ttsEnsureEnd(ttsHeadingOrdinal(s.heading)));
      parts.push(ttsEnsureEnd(stripHtml(s.html)));
      parts.push(deeperSpeak(anchors[String(s.no)]));
    });
    return spkChunks(ttsPronounceFix(parts.join(" ")));
  }
  function ttsVoiceName() {
    var opts = TTS_VOICE_OPTIONS[state.lang] || TTS_VOICE_OPTIONS.zh;
    var chosenId = (state.user.ttsVoice && state.user.ttsVoice[state.lang]) || TTS_VOICE_DEFAULT[state.lang] || opts[0].id;
    var found = null;
    for (var i = 0; i < opts.length; i++) { if (opts[i].id === chosenId) { found = opts[i]; break; } }
    return (found || opts[0]).voice;
  }
  function setTtsVoice(lang, id) {
    if (!state.user.ttsVoice) state.user.ttsVoice = {};
    state.user.ttsVoice[lang] = id;
    saveUser();
    if (spk.active) spkStopAll(); // voice just changed — any in-progress playback was using the old one
  }

  // ---------------------------------------------------------------
  // Pre-download-ahead + progressive playback + background playback.
  //
  // Only the FIRST chunk needs to finish downloading before reading starts — there's no
  // "wait for the whole chapter" delay any more. While that first chunk plays, the next
  // couple of chunks are already being fetched in the background (a lookahead window, not
  // one-at-a-time-on-demand), so by the time the current chunk's audio ends, the next one
  // is normally already sitting in memory — that lookahead is what actually fixes the
  // reported "斷斷續續" choppiness (a live network round-trip used to sit between every
  // chunk because the old version only started fetching chunk N+1 once chunk N had already
  // finished playing). Every chunk fetched is also cached on-device via the Cache Storage
  // API, so replaying the same reading later — even offline — needs no network at all. A
  // single long-lived <audio> element is reused for every chunk (its src is swapped, the
  // element itself never recreated) — that's what lets iOS keep audio going in the
  // background / on the lock screen, backed by the MediaSession wiring below.
  // ---------------------------------------------------------------
  var TTS_AUDIO_CACHE = "l321-tts-audio-v3";
  // v1.3.16: chapter reading now queues one chunk per SENTENCE (for the read-along highlight
  // feature) instead of merging several sentences into one longer chunk — individual sentences
  // are shorter/quicker to play than the old merged chunks, so the lookahead window is widened
  // from 2 to 4 to give the prefetch more of a head start against that shorter per-item playback
  // time (keeps the "next chunk is already cached by the time it's needed" guarantee that fixed
  // the original 斷斷續續 choppiness in v1.3.4/v1.3.5).
  var TTS_LOOKAHEAD = 4; // how many chunks beyond the one currently playing to keep pre-fetched
  function ttsCacheKeyFor(voice, rate, text) {
    // Cache Storage keys on a Request/URL, not a hash — synthesize one deterministically
    // from voice+rate+text (no hashing library needed) so identical text always maps to
    // the same cache entry, and a changed voice/rate never collides with an old one.
    var h = 0;
    for (var i = 0; i < text.length; i++) { h = ((h << 5) - h + text.charCodeAt(i)) | 0; }
    return TTS_ENDPOINT + "?voice=" + encodeURIComponent(voice) + "&rate=" + encodeURIComponent(rate) + "&h=" + h + "&n=" + text.length;
  }
  // In-flight de-dupe: the chunk currently being "stepped to" and the background lookahead
  // prefetch can otherwise both go to fetch the very same not-yet-cached piece at once —
  // this makes the second caller just await the first call's own promise instead of firing
  // a duplicate network request.
  var TTS_INFLIGHT = {};
  // v1.3.14／v1.3.15：使用者反映「開啟App後切換到簡體版」朗讀常常直接變成裝置內建的機械音，
  // 抓不到真人語音（雲帆）；但接著切到繁體版很快就能聽到真人語音（雲哲），這時候再切回簡體版
  // 也能聽到雲帆了。這個「一整個App session裡永遠只有第一次朗讀請求會失敗、之後不管切到哪個
  // 語言都正常」的模式，很清楚指向問題出在Worker本身「被叫醒」的冷啟動延遲——第一次呼叫要
  // 花比較久時間把底層跟Azure的連線／授權建立起來，跟使用者選的是哪個語言／哪個聲音無關。
  // v1.3.14先加了「失敗後等一下重試一次」，但實測這樣還不夠（重試的等待時間或次數不足以
  // 撐過真正的冷啟動）。v1.3.15雙管齊下：(1)重試次數加到2次、等待時間也拉長且遞增
  // （800ms、1600ms），給冷啟動更多機會恢復；(2)App一開啟就在背景先送一個小小的「暖身」
  // 請求到語音伺服器（不等結果、不影響任何畫面或播放），提早把冷啟動的延遲吃掉，讓使用者
  // 真正點下🔊朗讀的時候，Worker多半已經醒了。
  var TTS_RETRY_DELAYS_MS = [800, 1600];
  function yunFetchOnce(voice, rate, piece) {
    return fetch(TTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voice: voice, rate: rate, sil: TTS_SIL_SENTENCE, silc: TTS_SIL_COMMA, sile: TTS_SIL_ENUM, text: piece }),
    }).then(function (res) {
      if (!res.ok) throw new Error("TTS HTTP " + res.status);
      return res;
    });
  }
  function yunFetchWithRetry(voice, rate, piece) {
    function attempt(delaysLeft, lastErr) {
      if (!delaysLeft.length) return yunFetchOnce(voice, rate, piece); // final try — let its own rejection propagate
      return yunFetchOnce(voice, rate, piece).catch(function (err) {
        return new Promise(function (resolve) { setTimeout(resolve, delaysLeft[0]); })
          .then(function () { return attempt(delaysLeft.slice(1), err); });
      });
    }
    return attempt(TTS_RETRY_DELAYS_MS.slice(), null);
  }
  // Fire-and-forget "warm up" ping — sent once as soon as the app boots, well before the user
  // ever taps 🔊, so a slow first connection to the Worker (see comment above) has already
  // happened in the background by the time a real reading is requested. Uses a throwaway
  // one-character piece of text with the current language's default voice; result (success or
  // failure) is silently ignored either way — this must never surface an error or delay boot.
  function ttsWarmUp() {
    try {
      var opts = TTS_VOICE_OPTIONS[state.lang] || TTS_VOICE_OPTIONS.zh;
      var defId = TTS_VOICE_DEFAULT[state.lang] || (opts[0] && opts[0].id);
      var found = null;
      for (var i = 0; i < opts.length; i++) { if (opts[i].id === defId) { found = opts[i]; break; } }
      var voice = (found || opts[0]).voice;
      yunFetchOnce(voice, "+0%", "。").catch(function () {});
    } catch (e) {}
  }
  function yunFetchBuffer(piece) {
    var voice = ttsVoiceName(), rate = "+0%";
    var key = ttsCacheKeyFor(voice, rate, piece);
    if (TTS_INFLIGHT[key]) return TTS_INFLIGHT[key];
    var canCache = ("caches" in window) && ("Request" in window);
    var req = canCache ? new Request(key) : null;
    var openCache = canCache ? caches.open(TTS_AUDIO_CACHE).catch(function () { return null; }) : Promise.resolve(null);
    var p = openCache.then(function (cache) {
      var matchP = (cache && req) ? cache.match(req) : Promise.resolve(null);
      return matchP.then(function (cached) {
        if (cached) return cached.arrayBuffer();
        return yunFetchWithRetry(voice, rate, piece).then(function (res) {
          var resForCache = (cache && req) ? res.clone() : null;
          return res.arrayBuffer().then(function (buf) {
            // Wait for the cache write to actually land before resolving — otherwise an
            // immediate re-read (e.g. re-opening the same chapter right away) can race
            // ahead of the write and miss the cache even though this exact chunk was just
            // fetched a moment ago.
            if (resForCache) {
              return Promise.resolve(cache.put(req, resForCache)).catch(function () {}).then(function () { return buf; });
            }
            return buf;
          });
        });
      });
    });
    p.then(function () { delete TTS_INFLIGHT[key]; }, function () { delete TTS_INFLIGHT[key]; });
    TTS_INFLIGHT[key] = p;
    return p;
  }
  // Makes sure the chunks from spk.idx up to +TTS_LOOKAHEAD are already being fetched (fire
  // and forget — failures here are silently ignored, spkAdvanceAzure will hit the same
  // network error again for real, in order, when it actually gets to that chunk).
  function ttsPrefetchAhead(myToken) {
    for (var d = 1; d <= TTS_LOOKAHEAD; d++) {
      var i = spk.idx + d;
      if (i >= spk.queue.length) break;
      (function (piece) {
        yunFetchBuffer(piece).catch(function () {});
      })(spk.queue[i]);
    }
    void myToken; // kept for symmetry/future use — prefetch itself is token-agnostic (its results just sit in cache)
  }
  // Plays spk.queue[spk.idx], then on "ended" advances to the next chunk — reusing the same
  // <audio> element throughout. Combined with ttsPrefetchAhead() above, only the very first
  // chunk is ever waited on "cold"; every later chunk is normally already fetched by the
  // time it's needed.
  function spkAdvanceAzure(myToken) {
    if (myToken !== spk.token) return;
    if (spk.idx >= spk.queue.length) { spkStopAll(); return; }
    var first = (spk.idx === 0);
    var piece = spk.queue[spk.idx];
    spk.loading = first;
    if (first) updateSpeakButtons();
    yunFetchBuffer(piece).then(function (buf) {
      if (myToken !== spk.token) return;
      spk.loading = false;
      ttsPrefetchAhead(myToken);
      var url;
      try { url = URL.createObjectURL(new Blob([buf], { type: "audio/mpeg" })); } catch (e) { spkStopAll(); return; }
      var a = spkGetAudio();
      var oldSrc = a.src;
      a.onended = null; a.onerror = null;
      a.src = url;
      if (oldSrc) { try { URL.revokeObjectURL(oldSrc); } catch (e) {} }
      a.onended = function () { if (myToken === spk.token) { spk.idx++; spkAdvanceAzure(myToken); } };
      a.onerror = function () {
        if (myToken !== spk.token) return;
        if (first) { spk.mode = "native"; spkPlayNativeQueue(myToken); }
        else { spk.idx++; spkAdvanceAzure(myToken); } // a mid-reading chunk failed to decode — skip it, keep going
      };
      if (first) setupMediaSession(spk.title);
      try { if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing"; } catch (e) {}
      spkOnItemStart(spk.idx); // read-along: highlight + auto-scroll this chunk's sentence, if it has one
      var p = a.play();
      if (p && p.catch) {
        p.catch(function () {
          if (myToken !== spk.token) return;
          if (first) { spk.mode = "native"; spkPlayNativeQueue(myToken); }
          else { spk.idx++; spkAdvanceAzure(myToken); }
        });
      }
      updateSpeakButtons();
    }).catch(function () {
      if (myToken !== spk.token) return;
      spk.loading = false;
      if (first) { spk.mode = "native"; spkPlayNativeQueue(myToken); }
      else { spk.idx++; spkAdvanceAzure(myToken); } // network hiccup mid-reading — skip this one, don't hard-stop
    });
  }
  function setupMediaSession(title) {
    try {
      if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
      navigator.mediaSession.metadata = new MediaMetadata({ title: title || t().brand, artist: t().brand });
      navigator.mediaSession.playbackState = "playing";
      navigator.mediaSession.setActionHandler("play", function () { try { spkGetAudio().play(); } catch (e) {} });
      navigator.mediaSession.setActionHandler("pause", function () { try { spkGetAudio().pause(); } catch (e) {} });
      navigator.mediaSession.setActionHandler("stop", function () { spkStopAll(); });
    } catch (e) {}
  }
  // Every 🔊 button in the currently-rendered view (the chapter toolbar's, or one per
  // companion reply) carries a data-speak-key; whichever one matches spk.curKey shows
  // playing/paused, every other one shows idle — so any number of them can coexist.
  function updateSpeakButtons() {
    qsa("[data-speak-key]").forEach(function (btn) {
      var key = btn.getAttribute("data-speak-key");
      if (spk.active && spk.curKey === key) {
        if (spk.loading) {
          btn.setAttribute("data-state", "loading"); btn.textContent = "⏳"; btn.setAttribute("aria-label", t().ttsLoading);
          return;
        }
        btn.setAttribute("data-state", spk.paused ? "paused" : "playing");
        btn.textContent = spk.paused ? "▶" : "⏸";
        btn.setAttribute("aria-label", spk.paused ? t().resumeAloud : t().pauseAloud);
      } else {
        btn.setAttribute("data-state", "idle");
        btn.textContent = "🔊";
        btn.setAttribute("aria-label", t().readAloud);
      }
    });
  }
  function spkStopAll() {
    spk.token++;
    spk.active = false; spk.paused = false; spk.loading = false; spk.mode = ""; spk.queue = []; spk.queueEls = []; spk.idx = 0; spk.curKey = null; spk.title = "";
    try {
      if (spk.audio) {
        spk.audio.pause(); spk.audio.onended = null; spk.audio.onerror = null;
        if (spk.audio.src) { URL.revokeObjectURL(spk.audio.src); spk.audio.removeAttribute("src"); }
      }
    } catch (e) {}
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    try { if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "none"; } catch (e) {}
    raClearHighlight();
    raReset();
    raStopListening();
    updateSpeakButtons();
  }
  function spkPlayNativeQueue(myToken) {
    if (myToken !== spk.token || spk.paused) return;
    if (spk.idx >= spk.queue.length) { spkStopAll(); return; }
    if (!spk.supported) { spkStopAll(); uiToast(t().ttsUnsupported); return; }
    var utter = new SpeechSynthesisUtterance(spk.queue[spk.idx]);
    utter.lang = state.lang === "en" ? "en-US" : (state.lang === "zs" ? "zh-CN" : "zh-TW");
    utter.onend = function () { if (myToken === spk.token && !spk.paused) { spk.idx++; spkPlayNativeQueue(myToken); } };
    utter.onerror = function () { if (myToken === spk.token) spkStopAll(); };
    spkOnItemStart(spk.idx); // read-along: highlight + auto-scroll, same as the Azure-voice path
    try { window.speechSynthesis.speak(utter); } catch (e) { spkStopAll(); }
  }
  // key: a string identifying what's playing ("ch:ch01" / "msg:<id>") so its button(s) can
  // be found again later. buildQueue(): returns the array of text chunks to speak. title:
  // shown on the lock-screen "now playing" card via MediaSession. queueEls (optional): the
  // parallel array of DOM elements for the read-along highlight — see the `spk.queueEls` comment.
  function speakStart(key, queue, title, queueEls) {
    spk.token++;
    var myToken = spk.token;
    if (!queue || !queue.length) return;
    spk.queue = queue; spk.queueEls = queueEls || []; spk.idx = 0; spk.active = true; spk.paused = false; spk.loading = true; spk.curKey = key; spk.mode = "azure"; spk.title = title || "";
    if (spk.queueEls.length) raStartListening(); else raStopListening();
    updateSpeakButtons();
    spkAdvanceAzure(myToken);
  }
  // buildQueueEls (optional): companion how buildQueue() supplies its parallel DOM-mapping —
  // called once, right alongside buildQueue(), only when starting a NEW reading (not on a
  // pause/resume toggle of an already-active one).
  function speakToggle(key, buildQueue, title, buildQueueEls) {
    if (spk.active && spk.curKey === key) {
      spk.paused = !spk.paused;
      raReset(); // fresh scroll-suppression state across the pause/resume boundary
      if (spk.paused) {
        if (spk.mode === "native") { try { window.speechSynthesis.pause(); } catch (e) {} }
        else { try { spkGetAudio().pause(); } catch (e) {} }
      } else {
        if (spk.mode === "native") { try { window.speechSynthesis.resume(); } catch (e) {} spkPlayNativeQueue(spk.token); }
        else { try { spkGetAudio().play(); } catch (e) {} }
        // resuming — re-center on the current sentence in case the user scrolled away from it
        // while paused (the highlight itself was never removed, so nothing to re-apply there).
        var curEl = (spk.queueEls && spk.queueEls[spk.idx]) || null;
        if (curEl) raScrollTo(curEl);
      }
      updateSpeakButtons();
    } else {
      spkStopAll();
      var queue = buildQueue();
      var els = buildQueueEls ? buildQueueEls() : [];
      speakStart(key, queue, title, els);
    }
  }
  // Walks the ALREADY-RENDERED ".reader" DOM (built by renderChapter()'s sentence-splitting
  // pass, same one the tap-to-highlight feature uses) in document order, building the
  // read-along queue directly from real on-screen elements rather than re-deriving sentence
  // boundaries from the raw chapter data — this guarantees every queue item maps to the exact
  // sentence span the user sees, with zero risk of drifting out of sync with how ".sent" spans
  // are actually split (SENT_END_RE, quote-handling, etc. all live in one place). A heading or
  // a "想更深" lead-in phrase has no single on-screen sentence, so those become "synthetic"
  // items (still spoken, just with a null DOM element — no highlight for them). Memoized per
  // speakToggleForChapter() call so buildQueue()/buildQueueEls() below always agree, even
  // though they're invoked as two separate callbacks.
  function buildChapterReadAlongQueue() {
    var readerEl = qs(".reader");
    var texts = [], els = [];
    function pushItem(raw, el) {
      var fixed = ttsPronounceFix(ttsEnsureEnd(raw));
      if (!fixed || !fixed.trim()) return;
      texts.push(fixed);
      els.push(el || null);
    }
    function walk(node) {
      if (!node || node.nodeType !== 1) return;
      if (node.tagName === "H2") { pushItem(ttsHeadingOrdinal(node.textContent), null); return; }
      if (node.classList && node.classList.contains("sent")) { pushItem(node.textContent, node); return; }
      if (node.tagName === "DETAILS" && node.classList && node.classList.contains("deeper")) {
        pushItem(DEEPER_SPEAK_LEAD[state.lang] || DEEPER_SPEAK_LEAD.zh, null);
        var qEl = node.querySelector("summary .q");
        if (qEl) pushItem(qEl.textContent, qEl);
        Array.prototype.forEach.call(node.querySelectorAll(".a .sent"), function (s) { pushItem(s.textContent, s); });
        return;
      }
      Array.prototype.forEach.call(node.children || [], walk);
    }
    if (readerEl) Array.prototype.forEach.call(readerEl.children, walk);
    return { texts: texts, els: els };
  }
  function speakToggleForChapter(chId) {
    var d = D();
    var ch = d.chapters[chId];
    if (!ch) return;
    var built = null;
    function ensureBuilt() { if (!built) built = buildChapterReadAlongQueue(); return built; }
    speakToggle("ch:" + chId,
      function () { return ensureBuilt().texts; },
      ch.numFull + "　" + ch.title,
      function () { return ensureBuilt().els; }
    );
  }
  window.speakToggleForChapter = speakToggleForChapter;
  // Reads one companion reply aloud — reuses mdToHtml()+stripHtml() to turn the markdown
  // back into clean spoken text (headers/bold/table syntax stripped, not read as symbols),
  // then the same pronunciation-fix + chunking pipeline as chapter reading.
  function speakToggleForMsg(mi) {
    var m = chatSession.messages[mi];
    if (!m || m.role !== "ai" || m.pending) return;
    if (!m.id) m.id = newMsgId();
    var plain = stripHtml(mdToHtml(m.text));
    speakToggle("msg:" + m.id, function () { return spkChunks(ttsPronounceFix(plain)); }, t().companionTitle);
  }
  function uiToast(msg) {
    try {
      var el = document.createElement("div");
      el.className = "uitoast";
      el.textContent = msg;
      document.body.appendChild(el);
      setTimeout(function () { el.remove(); }, 2200);
    } catch (e) {}
  }

  // ---------------------------------------------------------------
  // User data（沿用領導力App的欄位，新增 practicesDone／practiceLog／my2）
  // ---------------------------------------------------------------
  function userDefaults() {
    return {
      readChapters: {}, completedChapters: {}, revisits: {}, deeperOpened: {},
      highlights: {}, declarations: [], checklist: {}, discussionDone: {}, favorites: [],
      practicesDone: {},   // chId -> {idx: true}
      practiceLog: [],     // {chId, chTitle, text, person, at}
      my2: [],             // ["名字", ...]
      shares: {},          // chId -> count（分享／匯出次數，旅程地圖「繁殖」步用）
      plan: null,          // {type:"daily"|"weekly"|"unit8", start: ts}
      remind: { on: false, hour: 7 },
      theme: "auto",
      ttsVoice: { zh: "yunjhe", zs: "yunfan", en: "andrew" },
    };
  }
  function loadUser() {
    var defaults = userDefaults();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        for (var k in defaults) { if (!(k in saved)) saved[k] = defaults[k]; }
        return saved;
      }
    } catch (e) {}
    return defaults;
  }
  function saveUser() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user)); } catch (e) {} }

  // ---------------------------------------------------------------
  // Data loading — 索引檔先載，單元分包依需要載入並在背景預抓
  // ---------------------------------------------------------------
  function fetchJson(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error("load failed: " + url + " " + r.status); return r.json(); });
  }
  function loadIndex() {
    if (state.index) return Promise.resolve(state.index);
    return fetchJson("data." + state.lang + ".index.json").then(function (idx) {
      state.index = idx;
      state.d.companionQs = buildCompanionQs(idx);
      return idx;
    });
  }
  var unitInflight = {};
  function loadUnit(n) {
    if (state.units[n]) return Promise.resolve(state.units[n]);
    if (unitInflight[n]) return unitInflight[n];
    var p = fetchJson("data." + state.lang + ".u" + n + ".json").then(function (u) {
      state.units[n] = u;
      Object.keys(u.lessons).forEach(function (id) { state.d.chapters[id] = u.lessons[id]; });
      delete unitInflight[n];
      return u;
    }).catch(function (e) { delete unitInflight[n]; throw e; });
    unitInflight[n] = p;
    return p;
  }
  function loadTracks() {
    if (state.tracks) return Promise.resolve(state.tracks);
    return fetchJson("data." + state.lang + ".tracks.json").then(function (tr) { state.tracks = tr; return tr; });
  }
  function D() { return state.d; }
  function unitOf(chId) {
    var idx = state.index; if (!idx) return null;
    for (var i = 0; i < idx.units.length; i++) {
      var u = idx.units[i];
      for (var j = 0; j < u.lessons.length; j++) if (u.lessons[j].id === chId) return u;
    }
    return null;
  }
  function lessonMeta(chId) {
    var u = unitOf(chId); if (!u) return null;
    for (var j = 0; j < u.lessons.length; j++) if (u.lessons[j].id === chId) return u.lessons[j];
    return null;
  }
  function chapterIds() {
    var out = [];
    (state.index ? state.index.units : []).forEach(function (u) { u.lessons.forEach(function (l) { out.push(l.id); }); });
    return out;
  }
  function unitCn(n) { return "一二三四五六七八九十"[n - 1] || String(n); }
  function unitLabel(u) { return "第" + unitCn(u.n) + "單元"; }

  // 範例問題：每單元二十題，依該單元課名自動組成（試用版；正式版由編輯逐題撰寫）
  function buildCompanionQs(idx) {
    var tmpl = [
      "「{t}」這一課，對我今天的生活最具體的提醒是什麼？",
      "我要怎麼在家庭裡落實「{t}」？",
      "「{t}」跟「無己」有什麼關係？",
      "讀完「{t}」，我可以做的最小行動是什麼？",
      "「{t}」這一課，聖經最核心的根據是哪一段經文？",
      "在職場上，「{t}」會遇到什麼阻力？我該怎麼靠聖靈面對？",
      "「{t}」怎樣幫助我讓耶穌作王？",
      "請用一個比喻幫我明白「{t}」。",
    ];
    var general = [
      "什麼是「有己」和「無己」？我怎麼分辨自己現在是哪一種？",
      "改變觀念的八大步驟，今天我可以走到哪一步？",
      "920操練是什麼？我可以從誰開始？",
      "為什麼說「用心靠聖靈，不要用腦靠自己」？",
      "先生命、再關係、後事工，為什麼次序這麼重要？",
      "謙卑和驕傲的分別是什麼？我怎麼知道自己驕傲了？",
      "什麼是屬神的體系？我的家可以成為屬神的體系嗎？",
      "我失敗跌倒了，怎樣反敗為勝？",
    ];
    return idx.units.map(function (u) {
      var qs = (u.qs && u.qs.length) ? u.qs.slice() : [];
      if (!qs.length) {
        u.lessons.forEach(function (l, i) { qs.push(tmpl[i % tmpl.length].replace("{t}", l.title)); });
        qs = qs.slice(0, 14);
        general.forEach(function (g) { if (qs.length < 20) qs.push(g); });
      }
      return { partNo: u.n, label: unitLabel(u) + "　" + u.title, qs: qs };
    });
  }

  function esc(s) {
    return (s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Small, dependency-free Markdown -> HTML renderer for AI chat replies
  // (headers, bold/italic, blockquotes, tables, hr, lists, inline code).
  // Everything is esc()'d first so no HTML/script can be injected via a reply.
  function mdInline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<i>$2</i>");
    return s;
  }
  function mdToHtml(text) {
    var lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
    var html = "", i = 0, inList = false, inTable = false;
    function closeList() { if (inList) { html += "</ul>"; inList = false; } }
    function closeTable() { if (inTable) { html += "</table>"; inTable = false; } }
    while (i < lines.length) {
      var line = lines[i];
      var h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        closeList(); closeTable();
        var lvl = Math.min(h[1].length + 3, 6); // markdown h1-h4 -> html h4-h6, keeps chat-bubble scale sane
        html += "<h" + lvl + ">" + mdInline(h[2].trim()) + "</h" + lvl + ">";
        i++; continue;
      }
      if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
        closeList(); closeTable();
        html += "<hr>"; i++; continue;
      }
      var bq = line.match(/^>\s?(.*)$/);
      if (bq) {
        closeList(); closeTable();
        var qlines = [bq[1]];
        i++;
        while (i < lines.length && /^>\s?/.test(lines[i])) { qlines.push(lines[i].replace(/^>\s?/, "")); i++; }
        html += "<blockquote>" + qlines.map(mdInline).join("<br>") + "</blockquote>";
        continue;
      }
      // table: a header row followed by a |---|---| separator row
      if (/^\s*\|.*\|\s*$/.test(line) && lines[i + 1] && /^\s*\|?[\s:|-]+\|[\s:|-]*\|?\s*$/.test(lines[i + 1])) {
        closeList();
        var headCells = line.trim().replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); });
        html += '<div class="msg-table-wrap"><table><thead><tr>' + headCells.map(function (c) { return "<th>" + mdInline(c) + "</th>"; }).join("") + "</tr></thead><tbody>";
        i += 2;
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
          var cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); });
          html += "<tr>" + cells.map(function (c) { return "<td>" + mdInline(c) + "</td>"; }).join("") + "</tr>";
          i++;
        }
        html += "</tbody></table></div>";
        continue;
      }
      var li = line.match(/^\s*[-*•]\s+(.*)$/);
      if (li) {
        closeTable();
        if (!inList) { html += "<ul>"; inList = true; }
        html += "<li>" + mdInline(li[1]) + "</li>";
        i++; continue;
      }
      if (!line.trim()) { closeList(); closeTable(); i++; continue; }
      closeList(); closeTable();
      html += "<p>" + mdInline(line.trim()) + "</p>";
      i++;
    }
    closeList(); closeTable();
    return html || esc(text || "");
  }
  function fmtDate(iso) {
    try {
      var dt = new Date(iso);
      return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
    } catch (e) { return ""; }
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function on(el, ev, sel, fn) {
    el.addEventListener(ev, function (e) {
      var t = e.target.closest(sel);
      if (t && el.contains(t)) fn(e, t);
    });
  }

  function chapterProgressState(chId) {
    if (state.user.completedChapters[chId]) return "done";
    if (state.user.readChapters[chId]) return "progress";
    return "none";
  }
  function navigate(hash) { location.hash = hash; }
  window.LS321 = { state: state, saveUser: saveUser, mdToHtml: mdToHtml, spk: spk, loadUnit: loadUnit, D: D };

  // ---------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------
  function parseHash() {
    var h = (location.hash || "#/today").replace(/^#\//, "");
    var parts = h.split("/").filter(Boolean);
    return parts.length ? parts : ["today"];
  }
  function render() {
    var parts = parseHash();
    var root = parts[0];
    if (spk.active) {
      var stillOnSameChapter = root === "course" && parts[1] && ("ch:" + parts[1]) === spk.curKey;
      var stillOnCompanion = root === "companion" && spk.curKey && spk.curKey.indexOf("msg:") === 0;
      if (!stillOnSameChapter && !stillOnCompanion) spkStopAll();
    }
    var view = qs("#view");
    view.innerHTML = "";
    updateTabbar(root);
    qs("#brandName").textContent = t().brand;
    document.title = t().brand;
    if (root === "today") return renderToday(view);
    if (root === "course" && parts[1]) return withChapter(view, parts[1], function (ch) { renderChapter(view, parts[1], parts[2] || "read", parts[3]); });
    if (root === "course") return renderCourseList(view);
    if (root === "tools" && parts[1] === "journey") return renderJourney(view);
    if (root === "tools" && parts[1] === "tracks") return renderTracks(view);
    if (root === "tools" && parts[1] === "checklist") return renderChecklist(view, parts[2]);
    if (root === "tools" && parts[1] === "prompter" && parts[2]) return withChapter(view, parts[2], function () { launchPrompter(parts[2], parts[3] || "12"); });
    if (root === "tools" && parts[1] === "speaker") return renderSpeaker(view, parts[2]);
    if (root === "tools" && parts[1] === "920") return render920(view);
    if (root === "tools") return renderToolsList(view);
    if (root === "companion") return renderCompanion(view, parts[1]);
    if (root === "me") return renderMe(view);
    return renderToday(view);
  }
  // 確保該課所屬單元的分包已載入，再渲染
  function withChapter(view, chId, fn) {
    var u = unitOf(chId);
    if (!u) { view.innerHTML = '<div class="empty">404</div>'; return; }
    if (state.d.chapters[chId]) { fn(state.d.chapters[chId]); return; }
    view.innerHTML = '<div class="empty">' + esc(t().loading) + '</div>';
    loadUnit(u.n).then(function () { if (parseHash().join("/").indexOf(chId) >= 0) fn(state.d.chapters[chId]); })
      .catch(function (e) { view.innerHTML = '<div class="empty">載入單元失敗，請檢查網路後重試。<br><span style="font-size:11px">' + esc(String(e)) + '</span></div>'; });
  }
  function updateTabbar(root) {
    qsa("#tabbar a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-tab") === root); });
    qs("#tab-today").textContent = t().tabToday; qs("#tab-course").textContent = t().tabCourse; qs("#tab-tools").textContent = t().tabTools;
    qs("#tab-companion").textContent = t().tabCompanion; qs("#tab-me").textContent = t().tabMe;
  }
  function ringSvg(pct) {
    var r = 16, c = 2 * Math.PI * r, off = c * (1 - pct);
    return '<svg class="progress-ring" viewBox="0 0 38 38"><circle cx="19" cy="19" r="' + r + '" fill="none" stroke="var(--border)" stroke-width="4"/><circle cx="19" cy="19" r="' + r + '" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 19 19)"/></svg>';
  }

  // ---------------------------------------------------------------
  // 今日
  // ---------------------------------------------------------------
  function renderToday(view) {
    var idx = state.index, ids = chapterIds();
    var lastId = currentChapterHint();
    var nextId = lastId || ids[0];
    var meta = lessonMeta(nextId), u = unitOf(nextId);
    var doneCount = ids.filter(function (c) { return state.user.completedChapters[c]; }).length;
    var html = '<div class="hero-badge"><img src="icon-192.png" alt="落實321"><div class="hb-title">' + esc(t().brand) + '</div><div class="hb-sub">' + esc(t().heroSub) + '</div></div>';
    html += '<div class="card"><div class="pill">' + esc(unitLabel(u) + "　" + u.title) + '</div>';
    html += "<h3 style='margin-top:8px'>" + esc(meta.no) + "　" + esc(meta.title) + "</h3>";
    if (meta.subtitle) html += '<p class="muted">' + esc(meta.subtitle) + '</p>';
    html += '<p class="muted">' + doneCount + ' / ' + ids.length + ' 課已完成</p>';
    html += '<a class="btn primary block" href="#/course/' + nextId + '">' + esc(lastId ? t().continueReading : t().readBtn) + '</a></div>';
    html += planCard(idx);
    html += spacedDeclCard();
    // 今日金句：依日期輪流取單元主題經文
    var day = Math.floor(Date.now() / 86400000) % idx.units.length;
    var du = idx.units[day];
    html += '<div class="section-title">' + esc(t().todayVerse) + '</div><div class="declbox"><p class="decl">「' + esc(du.verse) + '」</p><p class="muted" style="margin:0">' + esc(du.vref) + '　·　' + esc(unitLabel(du) + " " + du.title) + '</p></div>';
    html += '<div class="section-title">' + esc(t().unitOverview) + '</div><div class="card" style="padding:8px 16px;">';
    idx.units.forEach(function (uu) {
      var chs = uu.lessons.map(function (l) { return l.id; });
      var done = chs.filter(function (c) { return state.user.completedChapters[c]; }).length;
      html += '<a class="rowlink" href="#/course/' + chs[0] + '">' + ringSvg(done / chs.length) + '<div class="meta"><div class="t">' + esc(unitLabel(uu)) + '　' + esc(uu.title) + '</div><div class="s">第' + uu.start + '–' + uu.end + '課 · ' + done + '/' + chs.length + '</div></div><span class="chev">›</span></a>';
    });
    html += '</div>';
    html += '<div class="section-title">' + esc(t().tools) + '</div><div class="card"><a class="btn block" href="#/tools/journey">🧭 ' + esc(t().toolJourney) + '</a><a class="btn block" style="margin-top:8px" href="#/tools/920">🍇 ' + esc(t().tool920) + '</a></div>';
    view.innerHTML = html;
    wirePlan(view);
  }

  // 讀經計畫：每日一課（約半年）／每週一課（約三年半）／第八單元速成（看聽想講行 33 課）
  var PLAN_TYPES = [["daily", "每日一課", "約半年走完 173 課"], ["weekly", "每週一課", "約三年半，配合小組"], ["unit8", "看聽想講行速成", "第八單元 33 課，每日一課"]];
  function planTodayId(plan) {
    if (!plan) return null;
    var ids = chapterIds();
    if (plan.type === "unit8") ids = ids.filter(function (c) { var u = unitOf(c); return u && u.n === 8; });
    var days = Math.floor((Date.now() - plan.start) / 86400000);
    var n = plan.type === "weekly" ? Math.floor(days / 7) : days;
    return ids[Math.min(Math.max(n, 0), ids.length - 1)];
  }
  function planCard(idx) {
    var p = state.user.plan, r = state.user.remind || { on: false, hour: 7 };
    var html = '<div class="section-title">讀經計畫</div><div class="card">';
    if (!p) {
      html += '<p class="muted" style="margin:0 0 8px">選一個節奏，「今日」會每天告訴你該讀哪一課。</p>';
      PLAN_TYPES.forEach(function (pt) { html += '<button class="btn block" data-plan="' + pt[0] + '" style="margin-bottom:6px;justify-content:space-between"><span>' + pt[1] + '</span><span class="muted" style="font-size:12px">' + pt[2] + '</span></button>'; });
    } else {
      var pt = PLAN_TYPES.filter(function (x) { return x[0] === p.type; })[0] || PLAN_TYPES[0];
      var tid = planTodayId(p), tm = tid ? lessonMeta(tid) : null;
      var done = tid && state.user.completedChapters[tid];
      html += '<div class="pill">' + esc(pt[1]) + '　·　第 ' + (Math.floor((Date.now() - p.start) / 86400000) + 1) + ' 天</div>';
      if (tm) html += '<h3 style="margin:8px 0 4px">今天：' + esc(tm.no) + '　' + esc(tm.title) + (done ? ' ✓' : '') + '</h3>';
      if (tid) html += '<a class="btn ' + (done ? '' : 'primary') + ' block" href="#/course/' + tid + '">' + (done ? '再讀一次' : '開始今天這一課') + '</a>';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;font-size:13px"><span>每天提醒 ' + String(r.hour).padStart(2, "0") + ':00</span><div><button class="btn" id="remindToggle" style="padding:5px 10px;font-size:12px">' + (r.on ? '關閉提醒' : '開啟提醒') + '</button> <button class="btn" id="remindHour" style="padding:5px 10px;font-size:12px">改時間</button></div></div>';
      html += '<button class="btn" id="planReset" style="margin-top:8px;font-size:12px;padding:5px 10px">重設計畫</button>';
    }
    html += '</div>';
    return html;
  }
  function spacedDeclCard() {
    // 間隔重複：完成後第 3、7、30 天，把該課的信心宣告再提出來
    var now = Date.now(), items = [];
    Object.keys(state.user.completedChapters).forEach(function (c) {
      var d = Math.floor((now - state.user.completedChapters[c]) / 86400000);
      if (d === 3 || d === 7 || d === 30) { var ch = state.d.chapters[c]; var m = lessonMeta(c); if (m) items.push({ id: c, meta: m, ch: ch, d: d }); }
    });
    if (!items.length) return "";
    var html = '<div class="section-title">複習宣告</div>';
    items.slice(0, 3).forEach(function (it) {
      var decl = (it.ch && it.ch.declarations && it.ch.declarations[0]) || null;
      html += '<div class="declbox"><p class="muted" style="margin:0 0 4px;font-size:12px">完成第 ' + it.d + ' 天 · ' + esc(it.meta.no) + '　' + esc(it.meta.title) + '</p>' + (decl ? '<p class="decl">' + esc(decl) + '</p>' : '<p class="decl">回到這一課，再讀一次信心宣告。</p>') + '<a class="btn" href="#/course/' + it.id + '" style="margin-top:6px">重溫這一課</a></div>';
    });
    return html;
  }
  function wirePlan(view) {
    qsa("[data-plan]", view).forEach(function (b) { b.addEventListener("click", function () { state.user.plan = { type: b.getAttribute("data-plan"), start: Date.now() }; saveUser(); renderToday(view); }); });
    var rt = qs("#remindToggle", view);
    if (rt) rt.addEventListener("click", function () {
      var r = state.user.remind = state.user.remind || { on: false, hour: 7 };
      if (!r.on) {
        if (!("Notification" in window)) { uiToast("這台裝置不支援通知"); return; }
        Notification.requestPermission().then(function (perm) { if (perm === "granted") { r.on = true; saveUser(); renderToday(view); scheduleReminderCheck(); } else uiToast("未取得通知權限"); });
      } else { r.on = false; saveUser(); renderToday(view); }
    });
    var rh = qs("#remindHour", view);
    if (rh) rh.addEventListener("click", function () { var v = parseInt(window.prompt("每天幾點提醒？（0–23）", String((state.user.remind || {}).hour || 7)), 10); if (v >= 0 && v <= 23) { state.user.remind.hour = v; saveUser(); renderToday(view); } });
    var pr = qs("#planReset", view);
    if (pr) pr.addEventListener("click", function () { if (window.confirm("要重設讀經計畫嗎？進度紀錄不會清除。")) { state.user.plan = null; saveUser(); renderToday(view); } });
  }
  // App 開著（或從背景回來）時，到了提醒時刻且今天這一課還沒完成，就發一則本機通知（PWA 不需伺服器）
  var reminderTimer = null;
  function scheduleReminderCheck() {
    if (reminderTimer) clearInterval(reminderTimer);
    reminderTimer = setInterval(checkReminder, 60000); checkReminder();
  }
  function checkReminder() {
    try {
      var r = state.user.remind, p = state.user.plan;
      if (!r || !r.on || !p || !("Notification" in window) || Notification.permission !== "granted") return;
      var now = new Date(), key = "ls321_reminded_" + now.toDateString();
      if (now.getHours() < r.hour || localStorage.getItem(key)) return;
      var tid = planTodayId(p); if (!tid || state.user.completedChapters[tid]) return;
      var m = lessonMeta(tid);
      localStorage.setItem(key, "1");
      var show = function () { try { new Notification("落實321 · 今天這一課", { body: m.no + "　" + m.title, icon: "icon-192.png", tag: "ls321-daily" }); } catch (e) {} };
      if (navigator.serviceWorker && navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(function (reg) { reg.showNotification("落實321 · 今天這一課", { body: m.no + "　" + m.title, icon: "icon-192.png", tag: "ls321-daily" }).catch(show); }).catch(show); else show();
    } catch (e) {}
  }

  // ---------------------------------------------------------------
  // 課程
  // ---------------------------------------------------------------
  function renderCourseList(view) {
    var idx = state.index;
    var html = "<h2 style='margin-top:4px'>" + esc(t().allParts) + "</h2>";
    var hint = currentChapterHint();
    var hintUnit = hint ? unitOf(hint) : null;
    idx.units.forEach(function (u) {
      var chs = u.lessons.map(function (l) { return l.id; });
      var done = chs.filter(function (c) { return state.user.completedChapters[c]; }).length;
      var open = hintUnit ? (hintUnit.n === u.n) : (u.n === 1);
      html += '<details class="part"' + (open ? " open" : "") + '><summary><span class="pn">' + esc(unitLabel(u)) + '</span><span class="pt">' + esc(u.title) + '</span><span class="muted">' + done + '/' + chs.length + '</span></summary><div class="plist">';
      html += '<div class="muted" style="padding:4px 0 8px">「' + esc(u.verse) + '」（' + esc(u.vref) + '）</div>';
      u.lessons.forEach(function (l) {
        var st = chapterProgressState(l.id);
        html += '<a class="rowlink" href="#/course/' + l.id + '"><div class="meta"><div class="t">' + esc(l.no) + '　' + esc(l.title) + '</div><div class="s">' + (l.subtitle ? esc(l.subtitle) + ' · ' : '') + (st === "done" ? esc(t().doneLabel) : (st === "progress" ? esc(t().inProgress) : esc(t().notStarted))) + '</div></div><span class="chev">' + (st === "done" ? "✓" : (st === "progress" ? "•" : "")) + '</span></a>';
      });
      html += '</div></details>';
    });
    view.innerHTML = html;
  }

  // ---------------------------------------------------------------
  // 課程頁：讀／享／講／帶
  // ---------------------------------------------------------------
  function withSecAttr(html, secKey) {
    return html.replace(/<p(\s[^>]*)?>/g, function (m) { return m.slice(0, -1) + ' data-sec="' + secKey + '">'; });
  }
  function modeBar(chId, mode) {
    var modes = [["read", t().modeRead, t().modeReadDesc], ["share", t().modeShare, t().modeShareDesc], ["teach", t().modeTeach, t().modeTeachDesc], ["lead", t().modeLead, t().modeLeadDesc]];
    var html = '<div class="langswitch modebar" style="display:flex;width:100%;margin:8px 0 4px">';
    modes.forEach(function (m) { html += '<a href="#/course/' + chId + '/' + m[0] + '" class="' + (mode === m[0] ? "active" : "") + '" style="flex:1;text-align:center;padding:8px 4px;font-weight:700;font-size:14px;text-decoration:none;color:' + (mode === m[0] ? '#fff' : 'var(--ink-soft)') + ';background:' + (mode === m[0] ? 'var(--accent)' : 'var(--surface)') + '">' + esc(m[1]) + '</a>'; });
    html += '</div>';
    var cur = modes.filter(function (m) { return m[0] === mode; })[0];
    html += '<div class="muted" style="font-size:12px;margin-bottom:8px">' + esc(cur ? cur[2] : "") + '</div>';
    return html;
  }
  function chapterHead(ch, chId, mode) {
    var html = '<div class="chtoolbar"><a class="chtb-btn" href="#/today" aria-label="' + esc(t().backHome) + '">🏠</a><a class="chtb-btn" href="#/course" aria-label="' + esc(t().backToc) + '">☰</a><span class="chtb-spacer"></span>';
    if (mode === "read") html += '<button class="chtb-btn" id="chSpeakBtn" data-speak-key="ch:' + esc(chId) + '" data-state="idle" aria-label="' + esc(t().readAloud) + '">🔊</button>';
    html += '<button class="chtb-btn" onclick="cycleFont()" aria-label="' + esc(t().fontSizeLabel) + '">A⁺</button></div>';
    html += '<div class="chhead"><div class="pn">' + esc(ch.partTitle) + '</div><h1>' + esc(ch.numFull) + '　' + esc(ch.title) + '</h1>';
    if (ch.subtitle) html += '<h2 style="font-size:16px;color:var(--ink-soft);margin:0 0 6px;font-weight:600">' + esc(ch.subtitle) + '</h2>';
    html += '</div>';
    html += modeBar(chId, mode);
    return html;
  }
  function prevNext(chId) {
    var ids = chapterIds(), pos = ids.indexOf(chId), html = '<div style="display:flex;gap:10px;margin-top:12px;">';
    if (pos > 0) html += '<a class="btn" style="flex:1" href="#/course/' + ids[pos - 1] + '">‹ ' + esc(lessonMeta(ids[pos - 1]).no) + '</a>';
    if (pos < ids.length - 1) html += '<a class="btn" style="flex:1" href="#/course/' + ids[pos + 1] + '">' + esc(lessonMeta(ids[pos + 1]).no) + ' ›</a>';
    return html + '</div>';
  }
  function renderChapter(view, chId, mode, sub) {
    var ch = D().chapters[chId];
    if (!ch) { view.innerHTML = '<div class="empty">404</div>'; return; }
    var now = Date.now();
    if (!state.user.readChapters[chId]) state.user.readChapters[chId] = { openedAt: now };
    else { state.user.revisits[chId] = (state.user.revisits[chId] || 0) + 1; state.user.readChapters[chId].openedAt = now; }
    saveUser();
    // 背景預抓下一單元
    var u = unitOf(chId); if (u && u.n < 10 && !state.units[u.n + 1]) setTimeout(function () { loadUnit(u.n + 1).catch(function () {}); }, 2500);
    if (mode === "share") return renderShare(view, chId, ch);
    if (mode === "teach") return renderTeach(view, chId, ch, sub || "12");
    if (mode === "lead") return renderLead(view, chId, ch);
    return renderRead(view, chId, ch);
  }

  function renderRead(view, chId, ch) {
    var html = chapterHead(ch, chId, "read");
    html += '<div class="reader">';
    var hasAnyHighlight = Object.keys(state.user.highlights).some(function (k) { return (state.user.highlights[k] || []).length > 0; });
    if (!hasAnyHighlight) html += '<div class="hl-hint">' + esc(t().hlHint) + '</div>';
    html += '<p class="htype">' + esc(t().keyVerse) + '</p>';
    html += withSecAttr(ch.keyVerses.map(function (v) { return '<p class="warn">' + esc(v) + '</p>'; }).join(""), "kv");
    html += withSecAttr(ch.intro, "intro");
    ch.sections.forEach(function (s) {
      html += "<h2>" + esc(s.heading) + "</h2>";
      html += withSecAttr(s.html, String(s.no));
    });
    html += '</div>';
    // 操練
    if (ch.practices && ch.practices.length) {
      var pd = state.user.practicesDone[chId] || {};
      html += '<div class="card"><h3>✅ ' + esc(t().practices) + '</h3><p class="muted" style="margin:0 0 6px">' + esc(t().practiceHint) + '</p>';
      ch.practices.forEach(function (p, i) { html += '<label class="clitem"><input type="checkbox" data-prac="' + i + '"' + (pd[i] ? " checked" : "") + '><span>' + esc(p) + '</span></label>'; });
      html += '</div>';
    }
    // 信心宣告
    html += '<div class="declbox"><p class="htype" style="margin:0 0 6px">🗣 ' + esc(t().declarations) + '</p>';
    if (ch.declarations && ch.declarations.length) {
      html += '<p class="muted" style="margin:0 0 6px;font-size:12.5px">' + esc(t().declPick) + '</p>';
      ch.declarations.forEach(function (d, i) { html += '<p class="decl" style="cursor:pointer" data-decl="' + i + '">' + esc(d) + '</p>'; });
    }
    html += '<textarea id="declInput" rows="2" placeholder="' + esc(t().writeDeclaration) + '" style="width:100%;border:1px solid var(--border-strong);border-radius:8px;padding:10px;font-family:inherit;font-size:14px;background:var(--surface);color:var(--ink);margin-top:6px"></textarea>';
    html += '<button class="btn gold savebtn" id="declSaveBtn">' + esc(t().saveDecl) + '</button></div>';
    // 禱告
    if (ch.prayer && ch.prayer.length) html += '<details class="part"><summary><span class="pt">🙏 ' + esc(t().prayer) + '</span></summary><div class="plist reader">' + ch.prayer.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("") + '</div></details>';
    // 討論
    if (ch.discussion && ch.discussion.length) {
      html += '<div class="card"><h3>💬 ' + esc(t().discussion) + '</h3>' + ch.discussion.map(function (q, i) { return '<p class="q" style="margin:0 0 8px">' + (i + 1) + '. ' + esc(q) + '</p>'; }).join("");
      html += '<a class="btn primary block" href="#/tools/prompter/' + chId + '/12">▶ ' + esc(t().toolPrompter) + '</a></div>';
    }
    var isDone = !!state.user.completedChapters[chId];
    html += '<button class="btn ' + (isDone ? "" : "primary") + ' block" id="markDoneBtn">' + (isDone ? "✓ " + esc(t().doneLabel) : esc(t().markDone)) + '</button>';
    html += prevNext(chId);
    view.innerHTML = html;
    window.scrollTo(0, 0);
    var speakBtn = qs("#chSpeakBtn", view);
    if (speakBtn) { speakBtn.addEventListener("click", function () { speakToggleForChapter(chId); }); updateSpeakButtons(); }
    wireHighlights(view, chId, ch);
    qsa("input[data-prac]", view).forEach(function (inp) {
      inp.addEventListener("change", function () {
        var i = parseInt(inp.getAttribute("data-prac"), 10);
        var pd = state.user.practicesDone[chId] = state.user.practicesDone[chId] || {};
        pd[i] = inp.checked;
        if (inp.checked) {
          var person = "";
          if (state.user.my2.length) { person = window.prompt(t().practiceFor + "\n" + state.user.my2.join("、"), "") || ""; }
          state.user.practiceLog.push({ chId: chId, chTitle: ch.numFull + "　" + ch.title, text: ch.practices[i], person: person.trim(), at: Date.now() });
          uiToast(t().practiceSaved);
        }
        saveUser();
      });
    });
    qsa("[data-decl]", view).forEach(function (p) {
      p.addEventListener("click", function () {
        state.user.declarations.push({ chId: chId, chTitle: ch.numFull + "　" + ch.title, text: p.textContent, at: Date.now(), lang: state.lang });
        saveUser(); uiToast(t().declSaved);
      });
    });
    var dsBtn = qs("#declSaveBtn", view);
    if (dsBtn) dsBtn.addEventListener("click", function () {
      var ta = qs("#declInput", view); var val = (ta.value || "").trim(); if (!val) return;
      state.user.declarations.push({ chId: chId, chTitle: ch.numFull + "　" + ch.title, text: val, at: Date.now(), lang: state.lang });
      saveUser(); ta.value = ""; dsBtn.textContent = t().declSaved; setTimeout(function () { dsBtn.textContent = t().saveDecl; }, 1400);
    });
    var mdBtn = qs("#markDoneBtn", view);
    if (mdBtn) mdBtn.addEventListener("click", function () {
      if (state.user.completedChapters[chId]) delete state.user.completedChapters[chId]; else state.user.completedChapters[chId] = Date.now();
      saveUser(); renderRead(view, chId, ch);
    });
  }

  function copyText(txt, btn) {
    function ok() { if (btn) { var o = btn.textContent; btn.textContent = t().copied; setTimeout(function () { btn.textContent = o; }, 1500); } }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, function () { fallback(); });
    else fallback();
    function fallback() { try { var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); ok(); } catch (e) {} }
  }
  function bumpShare(chId) { state.user.shares[chId] = (state.user.shares[chId] || 0) + 1; saveUser(); }

  function renderShare(view, chId, ch) {
    var B = ch.blog;
    var html = chapterHead(ch, chId, "share");
    html += '<div style="display:flex;gap:8px;margin-bottom:10px"><button class="btn primary" id="copyBlog" style="flex:1">📋 ' + esc(t().copyAll) + '</button>' + (navigator.share ? '<button class="btn" id="shareBlog" style="flex:1">📤 ' + esc(t().shareBtn) + '</button>' : '') + '</div>';
    html += '<div class="reader"><h2 style="border:none;padding-top:0;margin-top:0">' + esc(B.title) + '</h2>';
    B.blocks.forEach(function (b) { html += b.t === "h2" ? '<h3>' + esc(b.x) + '</h3>' : '<p>' + esc(b.x) + '</p>'; });
    html += '<p>' + (B.tags || []).map(function (x) { return '<span class="pill" style="margin-right:4px">#' + esc(x) + '</span>'; }).join("") + '</p></div>';
    html += prevNext(chId);
    view.innerHTML = html; window.scrollTo(0, 0);
    var txt = B.title + "\n\n" + B.blocks.map(function (b) { return b.x; }).join("\n\n") + "\n\n" + (B.tags || []).map(function (x) { return "#" + x; }).join(" ") + "\n\n— 落實321 " + ch.numFull;
    qs("#copyBlog", view).addEventListener("click", function () { copyText(txt, this); bumpShare(chId); });
    var sb = qs("#shareBlog", view);
    if (sb) sb.addEventListener("click", function () { navigator.share({ title: B.title, text: txt }).then(function () { bumpShare(chId); }).catch(function () {}); });
  }

  function renderTeach(view, chId, ch, len) {
    var S = ch["slides" + len], Br = ch["brief" + len], Sc = ch["script" + len];
    var html = chapterHead(ch, chId, "teach");
    html += '<div class="langswitch" style="display:inline-flex;margin-bottom:8px"><a href="#/course/' + chId + '/teach/12" style="padding:6px 12px;text-decoration:none;font-size:12.5px;font-weight:600;color:' + (len === "12" ? '#fff' : 'var(--ink-soft)') + ';background:' + (len === "12" ? 'var(--accent)' : 'var(--surface)') + '">' + esc(t().slides12) + '</a><a href="#/course/' + chId + '/teach/21" style="padding:6px 12px;text-decoration:none;font-size:12.5px;font-weight:600;color:' + (len === "21" ? '#fff' : 'var(--ink-soft)') + ';background:' + (len === "21" ? 'var(--accent)' : 'var(--surface)') + '">' + esc(t().slides21) + '</a></div>';
    html += '<div style="display:flex;gap:8px;margin-bottom:10px"><button class="btn" id="exportSlides" style="flex:1">📋 ' + esc(t().exportSlides) + '</button><a class="btn primary" style="flex:1" href="#/tools/prompter/' + chId + '/' + len + '">▶ ' + esc(t().toolPrompter) + '</a></div>';
    S.forEach(function (s, i) {
      var br = Br[i] || { notes: [] }, sc = Sc[i] || { script: [] };
      html += '<div class="card" style="padding:0;overflow:hidden"><div style="background:var(--accent);color:#fff;padding:8px 14px;font-weight:700;font-size:14px">' + s.n + '　' + esc(s.title) + '</div><div style="padding:12px 14px">';
      html += s.lines.map(function (l) { return '<div style="font-size:16.5px;font-weight:600;line-height:1.6">' + esc(l) + '</div>'; }).join("");
      if (br.notes && br.notes.length) html += '<details style="margin-top:8px"><summary style="color:var(--gold);font-weight:700;font-size:13px;cursor:pointer">' + esc(t().speakerNotes) + '</summary><ol style="margin:6px 0 0;padding-left:20px;font-size:14px;color:var(--ink-soft)">' + br.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("") + '</ol></details>';
      if (sc.script && sc.script.length) html += '<details style="margin-top:6px"><summary style="color:var(--gold);font-weight:700;font-size:13px;cursor:pointer">' + esc(t().script) + '</summary><div style="font-size:14.5px;margin-top:6px">' + sc.script.map(function (p) { return '<p style="margin:0 0 8px">' + esc(p) + '</p>'; }).join("") + '</div></details>';
      html += '</div></div>';
    });
    html += prevNext(chId);
    view.innerHTML = html; window.scrollTo(0, 0);
    qs("#exportSlides", view).addEventListener("click", function () {
      var txt = ch.numFull + "　" + ch.title + "（" + len + "張投影片）\n\n" + S.map(function (s, i) {
        var br = Br[i] || { notes: [] };
        return "【投影片" + s.n + "】" + s.title + "\n" + s.lines.join("\n") + (br.notes && br.notes.length ? "\n講解重點：\n" + br.notes.map(function (n, k) { return (k + 1) + ". " + n; }).join("\n") : "");
      }).join("\n\n");
      copyText(txt, this); bumpShare(chId);
    });
  }

  function renderLead(view, chId, ch) {
    var html = chapterHead(ch, chId, "lead");
    html += '<div class="card"><p class="muted">' + esc(t().modeLeadDesc) + '。全螢幕深色介面、螢幕保持喚醒、分段計時。</p>';
    html += '<a class="btn primary block" href="#/tools/prompter/' + chId + '/12">▶ 12張版（約15分鐘）</a><a class="btn block" style="margin-top:8px" href="#/tools/prompter/' + chId + '/21">▶ 21張版（約30分鐘）</a></div>';
    html += '<div class="card"><h3>💬 ' + esc(t().discussion) + '</h3>' + (ch.discussion || []).map(function (q, i) { return '<p class="q" style="margin:0 0 8px">' + (i + 1) + '. ' + esc(q) + '</p>'; }).join("") + '</div>';
    html += '<div class="card"><h3>✅ ' + esc(t().practices) + '</h3><ol style="margin:0;padding-left:20px">' + (ch.practices || []).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join("") + '</ol></div>';
    html += '<a class="btn block" href="#/tools/checklist/' + chId + '">✔ ' + esc(t().toolChecklist) + '</a>';
    html += prevNext(chId);
    view.innerHTML = html; window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------
  // 工具
  // ---------------------------------------------------------------
  function renderToolsList(view) {
    var html = '<h2 style="margin-top:4px">' + esc(t().tools) + '</h2><div class="toolgrid">';
    [["journey", "🧭", t().toolJourney, t().toolJourneyDesc], ["920", "🍇", t().tool920, t().tool920Desc], ["tracks", "🔎", t().toolTracks, t().toolTracksDesc], ["checklist", "✅", t().toolChecklist, t().toolChecklistDesc], ["speaker", "🎤", t().toolSpeaker, t().toolSpeakerDesc]].forEach(function (it) {
      html += '<a class="toolcard" href="#/tools/' + it[0] + '"><div class="ic">' + it[1] + '</div><h4>' + esc(it[2]) + '</h4><p>' + esc(it[3]) + '</p></a>';
    });
    html += '</div><div class="section-title">' + esc(t().toolPrompter) + '</div><div class="card"><p class="muted">' + esc(t().toolPrompterDesc) + '。從任一課的「帶」模式進入，或先在「課程」選一課。</p><a class="btn block" href="#/course">' + esc(t().tabCourse) + ' ›</a></div>';
    view.innerHTML = html;
  }
  var JOURNEY_STEPS = [["資訊", "讀過本單元的課"], ["啟示", "讀過半數以上、有畫線"], ["信服", "存了宣告"], ["實踐", "勾了操練"], ["檢討", "做過教導誠信檢核"], ["修正", "同一課再次讀過"], ["反覆", "完成半數以上的課"], ["繁殖", "分享或匯出給別人"]];
  function computeUnitStep(u) {
    var chs = u.lessons.map(function (l) { return l.id; });
    var opened = chs.filter(function (c) { return state.user.readChapters[c]; }).length;
    var hls = chs.filter(function (c) { return (state.user.highlights[c] || []).length; }).length;
    var decl = state.user.declarations.filter(function (d) { return chs.indexOf(d.chId) >= 0; }).length;
    var prac = chs.filter(function (c) { var p = state.user.practicesDone[c]; return p && Object.keys(p).some(function (k) { return p[k]; }); }).length;
    var chk = chs.filter(function (c) { var p = state.user.checklist[c]; return p && Object.keys(p).some(function (k) { return p[k]; }); }).length;
    var rev = chs.filter(function (c) { return state.user.revisits[c] > 0; }).length;
    var done = chs.filter(function (c) { return state.user.completedChapters[c]; }).length;
    var sh = chs.filter(function (c) { return state.user.shares[c] > 0; }).length;
    var step = 0;
    if (opened > 0) step = 1;
    if (opened * 2 >= chs.length && hls > 0) step = 2;
    if (step >= 2 && decl > 0) step = 3;
    if (step >= 3 && prac > 0) step = 4;
    if (step >= 4 && chk > 0) step = 5;
    if (step >= 5 && rev > 0) step = 6;
    if (step >= 6 && done * 2 >= chs.length) step = 7;
    if (step >= 7 && sh > 0) step = 8;
    return step;
  }
  function renderJourney(view) {
    var html = '<h2 style="margin-top:4px">' + esc(t().journeyTitle) + '</h2><p class="muted">改變觀念的八大步驟 × 十單元。依你的閱讀、畫線、宣告、操練、檢核、重讀、完成與分享自動推算。</p><div class="card">';
    state.index.units.forEach(function (u) {
      var reached = computeUnitStep(u);
      html += '<div class="jrow"><div class="jt">' + esc(unitLabel(u)) + '</div><div class="jdots">' + JOURNEY_STEPS.map(function (s, i) { return '<i class="' + (i < reached ? "on" : "") + '" title="' + esc(s[0]) + '"></i>'; }).join("") + '</div></div>';
    });
    html += '</div><div class="section-title">八大步驟</div><div class="card">';
    JOURNEY_STEPS.forEach(function (s, i) { html += '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);"><div style="font-family:\'Noto Serif TC\',serif;color:var(--gold);font-weight:700;width:22px;">' + (i + 1) + '</div><div><div style="font-weight:700;">' + esc(s[0]) + '</div><div class="muted">' + esc(s[1]) + '</div></div></div>'; });
    html += '</div>';
    view.innerHTML = html;
  }
  function renderTracks(view) {
    view.innerHTML = '<div class="empty">' + esc(t().loading) + '</div>';
    loadTracks().then(function (data) {
      var html = '<h2 style="margin-top:4px">' + esc(t().tracksTitle) + '</h2>';
      data.keywords.forEach(function (kw) {
        var occ = data.tracks[kw] || []; if (!occ.length) return;
        html += '<details class="part"><summary><span class="pt">' + esc(kw) + '</span><span class="muted">' + occ.length + ' ' + esc(t().chaptersSpanned) + '</span></summary><div class="plist">';
        occ.slice(0, 40).forEach(function (o) { html += '<a class="rowlink" href="#/course/' + o.chId + '"><div class="meta"><div class="t">' + esc(o.chTitle) + '</div><div class="s">' + esc(o.snippet) + '</div></div></a>'; });
        html += '</div></details>';
      });
      view.innerHTML = html;
    });
  }
  var CHECKLIST = [
    { id: "c1", group: "耶穌是我的榜樣", text: "本課的信息是否指向耶穌的榜樣，而不是高舉人？" },
    { id: "c2", group: "耶穌是我的榜樣", text: "我自己是否先活出了這一課所教的？" },
    { id: "c3", group: "聖經是我的準則", text: "所引經文是否核對和合本原文，沒有斷章取義？" },
    { id: "c4", group: "聖經是我的準則", text: "神學推論是否誠實標示層級（A／B／C）？" },
    { id: "c5", group: "聖靈是我的引導", text: "預備過程中是否安靜尋求聖靈的感動？" },
    { id: "c6", group: "聖靈是我的引導", text: "是否留空間讓聖靈在聽者心中工作，而不是講員說服？" },
    { id: "c7", group: "讓耶穌作王", text: "講道的目標是讓聽者順服耶穌，不是順服我？" },
    { id: "c8", group: "讓耶穌得著一切的榮耀", text: "是否避免引人注意自己的口才、學問或經歷？" },
    { id: "c9", group: "建立屬神的體系", text: "是否有具體操練，讓真理落實到家庭、職場、教會？" },
    { id: "c10", group: "建立屬神的體系", text: "是否鼓勵聽者找屬靈同伴（2）一起實踐？" },
    { id: "c11", group: "建立屬神的體系", text: "是否把這一課的信息傳給另一個人（繁殖）？" },
  ];
  function renderChecklist(view, chId) {
    if (!chId) {
      var html = '<h2 style="margin-top:4px">' + esc(t().checklistTitle) + '</h2><p class="muted">' + esc(t().checklistPickChapter) + '</p><div class="card" style="padding:8px 16px;">';
      chapterIds().forEach(function (cid) {
        var cl = state.user.checklist[cid] || {}; var doneN = Object.keys(cl).filter(function (k) { return cl[k]; }).length; var m = lessonMeta(cid);
        if (!doneN && !state.user.readChapters[cid]) return;
        html += '<a class="rowlink" href="#/tools/checklist/' + cid + '"><div class="meta"><div class="t">' + esc(m.no) + '　' + esc(m.title) + '</div><div class="s">' + doneN + '/' + CHECKLIST.length + '</div></div><span class="chev">›</span></a>';
      });
      html += '</div><p class="muted">只列出你讀過或檢核過的課。</p>';
      view.innerHTML = html; return;
    }
    var m2 = lessonMeta(chId); if (!m2) { view.innerHTML = '<div class="empty">404</div>'; return; }
    var cl = state.user.checklist[chId] = state.user.checklist[chId] || {};
    var html2 = '<h2 style="margin-top:4px">' + esc(t().checklistTitle) + '</h2><p class="muted">' + esc(m2.no) + '　' + esc(m2.title) + '</p><div class="card">';
    var groups = {}; CHECKLIST.forEach(function (it) { (groups[it.group] = groups[it.group] || []).push(it); });
    Object.keys(groups).forEach(function (g) { html2 += '<div class="clgroup">' + esc(g) + '</div>'; groups[g].forEach(function (it) { html2 += '<label class="clitem"><input type="checkbox" data-cl-id="' + it.id + '"' + (cl[it.id] ? " checked" : "") + '><span>' + esc(it.text) + '</span></label>'; }); });
    html2 += '</div><a class="btn block" href="#/course/' + chId + '">‹ 回到本課</a>';
    view.innerHTML = html2;
    qsa("input[data-cl-id]", view).forEach(function (inp) { inp.addEventListener("change", function () { cl[inp.getAttribute("data-cl-id")] = inp.checked; saveUser(); }); });
  }
  function renderSpeaker(view, chId) {
    var html = '<h2 style="margin-top:4px">' + esc(t().toolSpeaker) + '</h2><p class="muted">每一課都有 12 張與 21 張兩種投影片、講解重點與口語逐字稿（約15／30分鐘）。選一課進入「講」模式，可一鍵匯出投影片文字到簡報軟體。</p><div class="card" style="padding:8px 16px;">';
    var hint = currentChapterHint();
    var ids = hint ? [hint] : [];
    chapterIds().forEach(function (c) { if (state.user.readChapters[c] && ids.indexOf(c) < 0) ids.push(c); });
    if (!ids.length) ids = chapterIds().slice(0, 5);
    ids.slice(0, 12).forEach(function (c) { var m = lessonMeta(c); html += '<a class="rowlink" href="#/course/' + c + '/teach/12"><div class="meta"><div class="t">' + esc(m.no) + '　' + esc(m.title) + '</div><div class="s">約 ' + Math.round(m.chars / 250) + ' 分鐘完整講章 · 12／21張投影片</div></div><span class="chev">›</span></a>'; });
    html += '</div><a class="btn block" href="#/course">' + esc(t().tabCourse) + ' ›</a>';
    view.innerHTML = html;
  }
  function render920(view) {
    var html = '<h2 style="margin-top:4px">🍇 ' + esc(t().tool920) + '</h2><p class="muted">' + esc(t().my2Hint) + '</p>';
    html += '<div class="card"><h3>' + esc(t().my2) + '</h3><div id="my2list">' + state.user.my2.map(function (n, i) { return '<span class="pill" style="margin:0 6px 6px 0;font-size:13px">' + esc(n) + ' <button data-rm="' + i + '" style="border:none;background:transparent;color:var(--gold);cursor:pointer">✕</button></span>'; }).join("") + '</div>';
    html += '<div style="display:flex;gap:8px;margin-top:8px"><input id="my2in" placeholder="' + esc(t().my2Placeholder) + '" style="flex:1;border:1px solid var(--border-strong);border-radius:8px;padding:8px 10px;background:var(--surface);color:var(--ink);font-family:inherit"><button class="btn primary" id="my2add">' + esc(t().my2Add) + '</button></div></div>';
    var fruits = ["仁愛", "喜樂", "和平", "忍耐", "恩慈", "良善", "信實", "溫柔", "節制"];
    html += '<div class="card"><h3>' + esc(t().mePractices) + '　<span class="muted" style="font-weight:400">' + state.user.practiceLog.length + ' 次</span></h3>';
    var log = state.user.practiceLog.slice().reverse();
    if (!log.length) html += '<div class="empty">' + esc(t().meNoPractices) + '</div>';
    log.slice(0, 40).forEach(function (l) { html += '<div class="declitem"><div class="d">' + esc(l.text) + '</div><div class="m">' + esc(l.chTitle) + (l.person ? ' · 為 ' + esc(l.person) : '') + ' · ' + fmtDate(l.at) + '</div></div>'; });
    html += '</div><div class="card"><h3>聖靈的九樣果子</h3><p class="muted">「聖靈所結的果子，就是仁愛、喜樂、和平、忍耐、恩慈、良善、信實、溫柔、節制。」（加拉太書五章22至23節）</p><div>' + fruits.map(function (f) { return '<span class="pill" style="margin:0 6px 6px 0">' + f + '</span>'; }).join("") + '</div></div>';
    view.innerHTML = html;
    qs("#my2add", view).addEventListener("click", function () { var v = (qs("#my2in", view).value || "").trim(); if (!v) return; state.user.my2.push(v); saveUser(); render920(view); });
    qsa("[data-rm]", view).forEach(function (b) { b.addEventListener("click", function () { state.user.my2.splice(parseInt(b.getAttribute("data-rm"), 10), 1); saveUser(); render920(view); }); });
  }

  // ---------------------------------------------------------------
  // 提詞機／小組帶領：投影片精簡版 → 小組討論 → 操練
  // ---------------------------------------------------------------
  var prompterState = null;
  var wakeLock = null;
  function launchPrompter(chId, len) {
    var ch = D().chapters[chId]; if (!ch) { navigate("#/course/" + chId); return; }
    var items = [];
    (ch["brief" + (len || "12")] || []).forEach(function (s) { items.push({ type: "slide", phase: "投影片", title: s.n + "　" + s.title, lines: s.text || [], notes: s.notes || [] }); });
    (ch.discussion || []).forEach(function (q, i) { items.push({ type: "q", phase: "小組討論", title: "第" + (i + 1) + "題", lines: [q], must: true, no: i + 1 }); });
    if (ch.declarations && ch.declarations.length) items.push({ type: "decl", phase: "信心宣告", title: "一起宣告", lines: ch.declarations });
    (ch.practices || []).forEach(function (p, i) { items.push({ type: "p", phase: "本週操練", title: "操練" + "一二三四五六"[i], lines: [p] }); });
    prompterState = { chId: chId, items: items, idx: 0, startTs: Date.now(), timerInt: null };
    var el = qs("#prompter"); el.hidden = false; requestWakeLock(); renderPrompterFrame(); document.body.style.overflow = "hidden";
  }
  function exitPrompter() {
    var el = qs("#prompter"); el.hidden = true; el.innerHTML = ""; document.body.style.overflow = "";
    if (prompterState && prompterState.timerInt) clearInterval(prompterState.timerInt);
    var chId = prompterState ? prompterState.chId : null;
    prompterState = null; releaseWakeLock();
    if (chId && location.hash.indexOf("/tools/prompter/") >= 0) navigate("#/course/" + chId + "/lead");
  }
  function renderPrompterFrame() {
    var el = qs("#prompter"), ps = prompterState, ch = D().chapters[ps.chId], total = ps.items.length, cur = ps.items[ps.idx];
    var html = '<div class="ptop"><button id="pClose" aria-label="' + esc(t().promptClose) + '">✕</button><span>' + esc(ch.numFull + "　" + ch.title) + '</span><span class="ptimer" id="pTimer">00:00</span></div><div class="pdots">';
    ps.items.forEach(function (it, i) { html += '<i class="' + (i < ps.idx ? "done" : (i === ps.idx ? "now" : "")) + '"></i>'; });
    html += '</div><div class="pbody"><div class="ptitle">' + esc(cur.phase) + ' · ' + esc(cur.title) + ' · ' + (ps.idx + 1) + ' / ' + total + '</div>';
    html += '<div class="pq">' + cur.lines.map(function (l) { return '<div style="margin-bottom:.4em">' + esc(l) + '</div>'; }).join("") + '</div>';
    if (cur.notes && cur.notes.length) html += '<details style="margin-top:14px;color:#C9B98A;font-size:14px"><summary style="cursor:pointer">講解重點</summary><ol style="padding-left:20px">' + cur.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("") + '</ol></details>';
    html += '</div><div class="pctl"><button id="pPrev"' + (ps.idx === 0 ? " disabled" : "") + '>‹ ' + esc(t().prev) + '</button>';
    if (cur.type === "q") html += '<button id="pDoneMust">' + (state.user.discussionDone[ps.chId] && state.user.discussionDone[ps.chId][cur.no] ? "✓ 已討論" : "○ 標記已討論") + '</button>';
    html += '<button id="pNext">' + (ps.idx === total - 1 ? esc(t().exitPrompter) : esc(t().next) + ' ›') + '</button></div>';
    el.innerHTML = html;
    qs("#pClose", el).addEventListener("click", exitPrompter);
    qs("#pPrev", el).addEventListener("click", function () { if (ps.idx > 0) { ps.idx--; renderPrompterFrame(); } });
    qs("#pNext", el).addEventListener("click", function () { if (ps.idx === total - 1) { exitPrompter(); return; } ps.idx++; renderPrompterFrame(); });
    var dm = qs("#pDoneMust", el);
    if (dm) dm.addEventListener("click", function () { var dd = state.user.discussionDone[ps.chId] = state.user.discussionDone[ps.chId] || {}; dd[cur.no] = !dd[cur.no]; saveUser(); renderPrompterFrame(); });
    if (ps.timerInt) clearInterval(ps.timerInt);
    ps.timerInt = setInterval(function () {
      var sec = Math.floor((Date.now() - ps.startTs) / 1000), tEl = qs("#pTimer", el);
      if (tEl) { tEl.textContent = String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0"); tEl.classList.toggle("warn", sec > 60 * 45); }
    }, 1000);
  }

  // ---------------------------------------------------------------
  // 陪讀：小智．落實教練
  // ---------------------------------------------------------------
  var chatSession = { messages: [] };
  var XIAOZHI_ENDPOINT = "https://xiaozhi-proxy.spch321.workers.dev";
  var pendingAsk = null;
  var pendingAskAutoSend = false;
  var msgIdSeq = 0;
  function newMsgId() { msgIdSeq++; return "m" + Date.now().toString(36) + msgIdSeq; }
  function companionSystemPrompt(chId) {
    var ch = chId ? D().chapters[chId] : null;
    var base = "你是「小智」，《落實321》App內的AI陪讀，人設是一位謙卑、有盼望、充滿愛心的「321落實教練」。這個App收錄晨讀321全套一百七十三課（十個單元：邁進末後大復興、復興的焦點——耶穌、從心開始、觀念的改變、無己、謙卑、捨己、生命、建立關係、服侍），核心是321理念：三個基礎——耶穌是我的榜樣、聖經是我的準則、聖靈是我的引導；兩個核心——讓耶穌作王、讓耶穌得著一切的榮耀；一個目的——建立屬神的體系。關鍵概念：有己是人類墮落的根源、驕傲是問題的根源；謙卑戰勝驕傲、無己戰勝撒但；改變觀念的八大步驟（資訊、啟示、信服、實踐、檢討、修正、反覆、繁殖）；先生命再關係後事工；920操練（每個與我有關係的人是我的2，活出無己0，結出9聖靈果子）；235關係（屬靈同伴、屬靈父母兒女、屬靈戰友）；用心靠聖靈不用腦靠自己；焦點在耶穌不在自己不在別人不在環境。" +
      "準則：①每一則回答都要「落實」：先回到聖經（引用和合本繁體全句並標出處），再回到321理念，最後給出一個今天就能做的最小行動；②涉及神學推論時誠實標示層級——A為聖經明文教導，B為可討論的神學推論需說明「這是我的理解，歡迎與牧者再確認」，C為321的應用性語言；③遇到讀者具體人生抉擇，引導讀者用321原則自己思考、鼓勵與屬靈父母／小組尋求印證，不直接替讀者下判斷；④語氣謙卑、盼望、帶著愛心，避免說教與居高臨下；⑤這是手機聊天介面：整則回覆約150-250字（除非讀者要求詳細），偶爾使用一個「##」小標題，優先用簡短段落與條列，重點適度加粗，不用表格。";
    var baseZs = "你是「小智」，《落实321》App内的AI陪读，人设是一位谦卑、有盼望、充满爱心的「321落实教练」。这个App收录晨读321全套一百七十三课（十个单元：迈进末后大复兴、复兴的焦点——耶稣、从心开始、观念的改变、无己、谦卑、舍己、生命、建立关系、服侍），核心是321理念：三个基础——耶稣是我的榜样、圣经是我的准则、圣灵是我的引导；两个核心——让耶稣作王、让耶稣得著一切的荣耀；一个目的——建立属神的体系。关键概念：有己是人类堕落的根源、骄傲是问题的根源；谦卑战胜骄傲、无己战胜撒但；改变观念的八大步骤（资讯、启示、信服、实践、检讨、修正、反复、繁殖）；先生命再关系后事工；920操练（每个与我有关系的人是我的2，活出无己0，结出9圣灵果子）；235关系（属灵同伴、属灵父母儿女、属灵战友）；用心靠圣灵不用脑靠自己；焦点在耶稣不在自己不在别人不在环境。" +
      "准则：①每一则回答都要「落实」：先回到圣经（引用和合本繁体全句并标出处），再回到321理念，最后给出一个今天就能做的最小行动；②涉及神学推论时诚实标示层级——A为圣经明文教导，B为可讨论的神学推论需说明「这是我的理解，欢迎与牧者再确认」，C为321的应用性语言；③遇到读者具体人生抉择，引导读者用321原则自己思考、鼓励与属灵父母／小组寻求印证，不直接替读者下判断；④语气谦卑、盼望、带著爱心，避免说教与居高临下；⑤这是手机聊天介面：整则回复约150-250字（除非读者要求详细），偶尔使用一个「##」小标题，优先用简短段落与条列，重点适度加粗，不用表格。";
    if (state.lang === "zs") base = baseZs.replace("和合本繁体", "和合本简体");
    if (ch) base += (state.lang === "zs" ? "\n\n读者目前所在课别：" : "\n\n讀者目前所在課別：") + ch.numFull + "　" + ch.title + "（" + ch.partTitle + "）。本課主題經文：" + (ch.keyVerses || []).join(" ") + (ch.practices && ch.practices.length ? " 本課操練：" + ch.practices.join("；") : "");
    return base;
  }

  function requestWakeLock() {
    if ("wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then(function (wl) { wakeLock = wl; }).catch(function () {});
    }
  }
  function releaseWakeLock() {
    if (wakeLock) { wakeLock.release().catch(function () {}); wakeLock = null; }
  }
  var companionQsOpen = false;
  var companionQsPart = null;

  function renderCompanion(view, chId) {
    var d = D();
    var chId2 = chId || currentChapterHint();
    var curPartNo = (chId2 && unitOf(chId2)) ? unitOf(chId2).n : 1;
    if (!companionQsPart) companionQsPart = curPartNo || 1;

    var html = '<div class="chatwrap">';
    html += '<div class="chatlog" id="chatlog">';
    if (!chatSession.messages.length) {
      html += '<div class="msg ai">' + esc(t().companionIntro) + '</div>';
    }
    chatSession.messages.forEach(function (m, mi) {
      if (m.role === "user") {
        html += '<div class="msg user">' + esc(m.text) + '</div>';
        return;
      }
      if (m.pending) {
        html += '<div class="msg ai">' + esc(m.text) + '</div>';
        return;
      }
      var isFav = !!(m.id && state.user.favorites.some(function (f) { return f.msgId === m.id; }));
      html += '<div class="msg ai" data-mi="' + mi + '">';
      html += '<div class="msg-body' + (m.collapsed !== false ? " clamped" : "") + '">' + mdToHtml(m.text) + '</div>';
      html += '<div class="msg-actions">';
      html += '<button type="button" class="msg-act msg-speak" data-mi="' + mi + '" data-speak-key="msg:' + esc(m.id || "") + '" data-state="idle" aria-label="' + esc(t().readAloud) + '">🔊</button>';
      html += '<button type="button" class="msg-act msg-collapse" data-mi="' + mi + '" hidden></button>';
      html += '<button type="button" class="msg-act msg-fav' + (isFav ? " on" : "") + '" data-mi="' + mi + '">' + (isFav ? "★ " + esc(t().msgSaved) : "☆ " + esc(t().msgSave)) + '</button>';
      html += '<button type="button" class="msg-act msg-del" data-mi="' + mi + '">🗑 ' + esc(t().msgDelete) + '</button>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '<button type="button" class="qs-toggle" id="companionQsToggle">' + esc(companionQsOpen ? t().companionQsHide : t().companionQsToggle) + '</button>';
    html += '<div class="qs-panel" id="companionQsPanel" ' + (companionQsOpen ? "" : 'hidden') + '>';
    var qsData = d.companionQs || [];
    html += '<div class="qs-parts" id="qsParts">';
    qsData.forEach(function (p) {
      html += '<button type="button" class="qs-partchip' + (p.partNo === companionQsPart ? ' on' : '') + '" data-part="' + p.partNo + '">' + p.partNo + '</button>';
    });
    html += '</div>';
    var curPart = qsData.find(function (p) { return p.partNo === companionQsPart; });
    if (curPart) {
      html += '<div class="qs-partlabel">' + esc(curPart.label) + '</div>';
      html += '<div class="qs-hint">' + esc(t().companionQsHint) + '</div>';
      html += '<div class="qs-list">';
      curPart.qs.forEach(function (q, qi) {
        html += '<button type="button" class="qs-chip" data-qidx="' + qi + '">' + esc(q) + '</button>';
      });
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="chatinput"><textarea id="chatIn" rows="1" placeholder="' + esc(t().companionPlaceholder) + '"></textarea><button id="chatSend">' + esc(t().companionSend) + '</button></div>';
    html += '</div>';
    view.innerHTML = html;

    var log = qs("#chatlog", view);
    log.scrollTop = log.scrollHeight;

    // A long AI reply's "展開全部/收合" toggle only appears if the reply actually overflows
    // the collapsed height — measured against the real rendered content (tables/headers and
    // all), not a character-count guess, so it works no matter what the reply contains.
    qsa(".msg.ai[data-mi]", log).forEach(function (bubble) {
      var mi = parseInt(bubble.getAttribute("data-mi"), 10);
      var m = chatSession.messages[mi];
      var body = qs(".msg-body", bubble);
      var btn = qs(".msg-collapse", bubble);
      if (!m || !body || !btn) return;
      body.classList.remove("clamped");
      var full = body.scrollHeight;
      if (full > 194) {
        var collapsed = m.collapsed !== false;
        m.collapsed = collapsed;
        body.classList.toggle("clamped", collapsed);
        btn.hidden = false;
        btn.textContent = collapsed ? t().msgExpand : t().msgCollapse;
      } else {
        m.collapsed = false;
        btn.hidden = true;
      }
    });
    log.addEventListener("click", function (e) {
      var speakBtn2 = e.target.closest(".msg-speak");
      var collapseBtn = e.target.closest(".msg-collapse");
      var favBtn = e.target.closest(".msg-fav");
      var delBtn = e.target.closest(".msg-del");
      if (speakBtn2) {
        speakToggleForMsg(parseInt(speakBtn2.getAttribute("data-mi"), 10));
        return;
      }
      if (collapseBtn) {
        var m1 = chatSession.messages[parseInt(collapseBtn.getAttribute("data-mi"), 10)];
        if (m1) { m1.collapsed = !m1.collapsed; renderCompanion(view, chId); }
        return;
      }
      if (favBtn) {
        toggleFavorite(parseInt(favBtn.getAttribute("data-mi"), 10), chId2);
        renderCompanion(view, chId);
        return;
      }
      if (delBtn) {
        if (!window.confirm(t().msgDeleteConfirm)) return;
        var delMi = parseInt(delBtn.getAttribute("data-mi"), 10);
        var delMsg = chatSession.messages[delMi];
        if (delMsg && spk.active && spk.curKey === "msg:" + delMsg.id) spkStopAll();
        chatSession.messages.splice(delMi, 1);
        renderCompanion(view, chId);
        return;
      }
    });
    updateSpeakButtons();

    var chatInEl = qs("#chatIn", view);
    if (pendingAsk) {
      chatInEl.value = pendingAsk;
      var autoSend = pendingAskAutoSend;
      pendingAsk = null; pendingAskAutoSend = false;
      if (autoSend) { sendChat(chId2); } else { setTimeout(function () { chatInEl.focus(); }, 0); }
    }
    qs("#chatSend", view).addEventListener("click", function () { sendChat(chId2); });
    chatInEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(chId2); }
    });

    qs("#companionQsToggle", view).addEventListener("click", function () {
      companionQsOpen = !companionQsOpen;
      renderCompanion(view, chId);
    });
    var partsEl = qs("#qsParts", view);
    if (partsEl) {
      partsEl.addEventListener("click", function (e) {
        var btn = e.target.closest(".qs-partchip");
        if (!btn) return;
        companionQsPart = parseInt(btn.getAttribute("data-part"), 10);
        renderCompanion(view, chId);
      });
    }
    var listEl = qs(".qs-list", view);
    if (listEl && curPart) {
      listEl.addEventListener("click", function (e) {
        var btn = e.target.closest(".qs-chip");
        if (!btn) return;
        var qi = parseInt(btn.getAttribute("data-qidx"), 10);
        var qText = curPart.qs[qi];
        if (!qText) return;
        chatInEl.value = qText;
        sendChat(chId2);
      });
    }
  }

  function currentChapterHint() {
    var lastId = null, lastAt = 0;
    Object.keys(state.user.readChapters).forEach(function (cid) {
      var r = state.user.readChapters[cid];
      if (r && r.openedAt > lastAt) { lastAt = r.openedAt; lastId = cid; }
    });
    return lastId;
  }

  function toggleFavorite(mi, chId2) {
    var m = chatSession.messages[mi];
    if (!m || m.role !== "ai" || m.pending) return;
    if (!m.id) m.id = newMsgId();
    var existingIdx = state.user.favorites.findIndex(function (f) { return f.msgId === m.id; });
    if (existingIdx >= 0) {
      state.user.favorites.splice(existingIdx, 1);
    } else {
      var d = D();
      var ch = chId2 ? (d.chapters[chId2] || (function(){var m=lessonMeta(chId2);return m?{numFull:m.no,title:m.title}:null;})()) : null;
      var question = null;
      for (var i = mi - 1; i >= 0; i--) {
        if (chatSession.messages[i].role === "user") { question = chatSession.messages[i].text; break; }
      }
      state.user.favorites.push({
        msgId: m.id, chId: chId2 || null, chTitle: ch ? (ch.numFull + "　" + ch.title) : "",
        question: question, answer: m.text, at: Date.now(),
      });
    }
    saveUser();
  }

  function sendChat(chId) {
    var ta = qs("#chatIn");
    var text = (ta.value || "").trim();
    if (!text) return;
    chatSession.messages.push({ role: "user", text: text, id: newMsgId() });
    ta.value = "";
    renderCompanion(qs("#view"), chId);
    var log = qs("#chatlog"); if (log) log.scrollTop = log.scrollHeight;

    if (!navigator.onLine) {
      chatSession.messages.push({ role: "ai", text: t().companionNeedNet, id: newMsgId() });
      renderCompanion(qs("#view"), chId);
      return;
    }

    var thinkingId = newMsgId();
    chatSession.messages.push({ role: "ai", text: "…", id: thinkingId, pending: true });
    renderCompanion(qs("#view"), chId);

    var payload = {
      system: companionSystemPrompt(chId),
      messages: chatSession.messages
        .filter(function (m) { return m.id !== thinkingId; })
        .slice(-12)
        .map(function (m) { return { role: m.role === "user" ? "user" : "assistant", content: m.text }; }),
    };

    // Look up the "…" placeholder by id (not array index) when the reply lands, since the
    // user may have deleted an earlier message in the meantime and shifted every index.
    function findMsgIdxById(id) {
      for (var i = 0; i < chatSession.messages.length; i++) { if (chatSession.messages[i].id === id) return i; }
      return -1;
    }

    fetch(XIAOZHI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(function (r) {
      if (!r.ok) throw new Error("proxy error " + r.status);
      return r.json();
    }).then(function (data) {
      var reply = extractReplyText(data);
      var idx = findMsgIdxById(thinkingId);
      if (idx >= 0) chatSession.messages[idx] = { role: "ai", text: reply || (state.lang === "en" ? "(no reply)" : "（沒有收到回覆）"), id: thinkingId };
      renderCompanion(qs("#view"), chId);
      var log2 = qs("#chatlog"); if (log2) log2.scrollTop = log2.scrollHeight;
    }).catch(function (err) {
      var idx2 = findMsgIdxById(thinkingId);
      if (idx2 >= 0) chatSession.messages[idx2] = { role: "ai", text: (state.lang === "en" ? "Connection error. Please try again." : "連線發生問題，請稍後再試。"), id: thinkingId };
      renderCompanion(qs("#view"), chId);
    });
  }

  function extractReplyText(data) {
    // Defensive parsing: supports a few common proxy response shapes.
    if (!data) return "";
    if (typeof data === "string") return data;
    if (data.content && Array.isArray(data.content) && data.content[0] && data.content[0].text) return data.content[0].text;
    if (data.reply) return data.reply;
    if (data.text) return data.text;
    if (data.message) return data.message;
    if (data.choices && data.choices[0] && data.choices[0].message) return data.choices[0].message.content;
    return "";
  }

  // ---------------------------------------------------------------
  // 句子層級畫線＋領受（承襲領導力App v1.3.16，原樣沿用）
  // ---------------------------------------------------------------
  function wireHighlights(view, chId, ch) {
    var SENT_END_RE = /[。！？.!?]/;
    function isClosingPunct(ch) {
      return ch === "」" || ch === "』" || ch === "”" || ch === "’" || ch === '"' || ch === "'" || ch === ")" || ch === "）" || ch === "》" || ch === "】";
    }
    function splitIntoSentenceGroups(p) {
      // walk p's existing child nodes (a mix of text nodes and rare inline elements like the
      // <span dir="rtl"> Greek-word aside) and group them into per-sentence node arrays —
      // splitting only inside text nodes, never inside an element, so an inline tag always
      // stays fully attached to whichever sentence it falls in.
      var kids = Array.prototype.slice.call(p.childNodes);
      var groups = [[]];
      kids.forEach(function (node) {
        if (node.nodeType === 3) {
          var text = node.textContent;
          var buf = "";
          for (var i = 0; i < text.length; i++) {
            buf += text[i];
            if (SENT_END_RE.test(text[i])) {
              var j = i + 1;
              while (j < text.length && isClosingPunct(text[j])) { buf += text[j]; j++; }
              i = j - 1;
              groups[groups.length - 1].push(document.createTextNode(buf));
              buf = "";
              groups.push([]);
            }
          }
          if (buf) groups[groups.length - 1].push(document.createTextNode(buf));
        } else {
          groups[groups.length - 1].push(node);
        }
      });
      groups = groups.filter(function (g) { return g.length > 0; });
      if (!groups.length) groups = [[document.createTextNode("")]];
      return groups;
    }
    function findHighlight(sec, pidx, idx) {
      return (state.user.highlights[chId] || []).find(function (h) { return h.sec === sec && h.pidx === pidx && h.idx === idx; });
    }
    function hlNoteKey(sec, pidx, idx) { return sec + ":" + pidx + ":" + idx; }
    function findSentSpan(p, idx) { return p.querySelector('.sent[data-idx="' + idx + '"]'); }
    function renderHlNote(p, sec, pidx, idx) {
      // several sentences within the SAME paragraph can each carry their own note, so notes
      // are identified individually (data-note-key) and kept stacked in sentence order right
      // after the paragraph, instead of assuming there's only ever one note per paragraph.
      var key = hlNoteKey(sec, pidx, idx);
      var existing = p.parentNode.querySelector('.hl-note[data-note-key="' + key + '"]');
      if (existing) existing.remove();
      var h = findHighlight(sec, pidx, idx);
      if (!h || !h.note) return;
      var noteEl = document.createElement("div");
      noteEl.className = "hl-note";
      noteEl.setAttribute("data-note-key", key);
      noteEl.setAttribute("data-note-idx", idx);
      noteEl.setAttribute("data-color", h.color || "gold");
      noteEl.textContent = "📝 " + h.note;
      var anchor = p, sib = p.nextElementSibling;
      while (sib && sib.classList && sib.classList.contains("hl-note") && parseInt(sib.getAttribute("data-note-idx"), 10) < idx) {
        anchor = sib; sib = sib.nextElementSibling;
      }
      anchor.parentNode.insertBefore(noteEl, anchor.nextSibling);
      noteEl.addEventListener("click", function () { openHlSheet(findSentSpan(p, idx), sec, pidx, idx); });
    }
    function buildAskXzQuestion(sentence, note) {
      var numFull = ch.numFull;
      if (state.lang === "en") {
        return "I'm reading " + numFull + ", and I highlighted this line: “" + sentence + "”. " +
          (note ? ("My reflection: “" + note + "”. ") : "") +
          "Please help me understand what this line means for me more deeply, and help me keep my focus on Jesus.";
      }
      if (state.lang === "zs") {
        return "我正在读" + numFull + "，画了这一句：「" + sentence + "」。" +
          (note ? ("我的领受是：「" + note + "」。") : "") +
          "请帮我更深地明白这句话对我的意思，也带我把焦点对准耶稣。";
      }
      return "我正在讀" + numFull + "，畫了這一句：「" + sentence + "」。" +
        (note ? ("我的領受是：「" + note + "」。") : "") +
        "請幫我更深地明白這句話對我的意思，也帶我把焦點對準耶穌。";
    }
    function closeHlSheet() {
      var m = qs(".hlsheet-mask");
      if (m) m.remove();
    }
    function openHlSheet(span, sec, pidx, idx) {
      var h = findHighlight(sec, pidx, idx);
      if (!h || !span) return;
      closeHlSheet();
      var sentence = span.textContent.slice(0, 200);
      var p = span.parentNode;
      var curColor = h.color || "gold";
      var colorNames = HL_COLOR_NAMES[state.lang] || HL_COLOR_NAMES.zh;
      var colorsHtml = '<div class="hlsheet-colorrow">' +
        '<span class="hlsheet-colorlabel">' + esc(t().hlColorLabel) + '</span>' +
        '<div class="hlsheet-colors">' + HL_COLORS.map(function (c) {
          return '<button type="button" class="hlswatch' + (c.id === curColor ? " active" : "") + '" data-color="' + c.id + '" style="background:' + c.dot + '" aria-label="' + esc(colorNames[c.id] || c.id) + '"></button>';
        }).join("") + '</div></div>';
      var mask = document.createElement("div");
      mask.className = "hlsheet-mask";
      mask.innerHTML = '<div class="hlsheet-card">' +
        '<div class="hlsheet-title">' + esc(t().hlSheetTitle) + '</div>' +
        '<div class="hlsheet-quote">' + esc(sentence) + '</div>' +
        colorsHtml +
        '<textarea class="hlsheet-ta" placeholder="' + esc(t().hlReflectionPlaceholder) + '">' + esc(h.note || "") + '</textarea>' +
        '<div class="hlsheet-acts">' +
        '<button type="button" data-act="save" class="btn gold">' + esc(t().hlSaveReflection) + '</button>' +
        '<button type="button" data-act="ask" class="btn primary">✨ ' + esc(t().hlAskXz) + '</button>' +
        '</div>' +
        '<div class="hlsheet-acts2">' +
        '<button type="button" data-act="clearnote" class="btn">' + esc(t().hlClearNote) + '</button>' +
        '<button type="button" data-act="remove" class="btn danger">' + esc(t().hlRemoveHighlight) + '</button>' +
        '<button type="button" data-act="cancel" class="btn">' + esc(t().hlCancel) + '</button>' +
        '</div></div>';
      document.body.appendChild(mask);
      mask.addEventListener("click", function (e) { if (e.target === mask) closeHlSheet(); });
      var ta = mask.querySelector(".hlsheet-ta");
      setTimeout(function () { ta.focus(); }, 60);
      // color picker — applies immediately on tap (a categorization choice, not something that
      // needs a separate "save" step), and updates the sentence's highlight + any of its notes
      // on screen right away so the reader sees the new color without reopening the sheet.
      Array.prototype.forEach.call(mask.querySelectorAll(".hlswatch"), function (btn) {
        btn.addEventListener("click", function () {
          var color = btn.getAttribute("data-color");
          var hh = findHighlight(sec, pidx, idx);
          if (hh) { hh.color = color; saveUser(); }
          span.setAttribute("data-color", color);
          var key = hlNoteKey(sec, pidx, idx);
          var noteEl = p.parentNode.querySelector('.hl-note[data-note-key="' + key + '"]');
          if (noteEl) noteEl.setAttribute("data-color", color);
          Array.prototype.forEach.call(mask.querySelectorAll(".hlswatch"), function (b) {
            b.classList.toggle("active", b === btn);
          });
        });
      });
      mask.querySelector('[data-act="save"]').addEventListener("click", function () {
        var hh = findHighlight(sec, pidx, idx);
        if (hh) { hh.note = (ta.value || "").trim(); saveUser(); }
        closeHlSheet();
        renderHlNote(p, sec, pidx, idx);
      });
      mask.querySelector('[data-act="ask"]').addEventListener("click", function () {
        var note = (ta.value || "").trim();
        var hh = findHighlight(sec, pidx, idx);
        if (hh) { hh.note = note; saveUser(); } // keep whatever reflection was just typed, same as Save would
        pendingAsk = buildAskXzQuestion(sentence, note);
        pendingAskAutoSend = true;
        closeHlSheet();
        navigate("#/companion/" + chId);
      });
      mask.querySelector('[data-act="clearnote"]').addEventListener("click", function () {
        var hh = findHighlight(sec, pidx, idx);
        if (hh) { hh.note = ""; saveUser(); }
        closeHlSheet();
        renderHlNote(p, sec, pidx, idx);
      });
      mask.querySelector('[data-act="remove"]').addEventListener("click", function () {
        var arr = state.user.highlights[chId] || [];
        var i = arr.findIndex(function (hh) { return hh.sec === sec && hh.pidx === pidx && hh.idx === idx; });
        if (i >= 0) arr.splice(i, 1);
        saveUser();
        span.removeAttribute("data-hl");
        var key = hlNoteKey(sec, pidx, idx);
        var noteEl = p.parentNode.querySelector('.hl-note[data-note-key="' + key + '"]');
        if (noteEl) noteEl.remove();
        closeHlSheet();
      });
      mask.querySelector('[data-act="cancel"]').addEventListener("click", closeHlSheet);
    }
    // split every highlightable paragraph into sentence spans (pidx = paragraph position
    // within its section, assigned here in document order — mirrors what the old regex-based
    // per-paragraph idx counter did), restore any already-saved highlight/note state per
    // sentence, and wire the tap handler on each sentence individually.
    var secPCounts = {};
    qsa(".reader p[data-sec]", view).forEach(function (p) {
      var sec = p.getAttribute("data-sec");
      var pidx = secPCounts[sec] || 0;
      secPCounts[sec] = pidx + 1;
      var groups = splitIntoSentenceGroups(p);
      while (p.firstChild) p.removeChild(p.firstChild);
      groups.forEach(function (nodes, idx) {
        var span = document.createElement("span");
        span.className = "sent";
        span.setAttribute("data-sec", sec);
        span.setAttribute("data-pidx", pidx);
        span.setAttribute("data-idx", idx);
        var existingHl = findHighlight(sec, pidx, idx);
        if (existingHl) {
          span.setAttribute("data-hl", "1");
          span.setAttribute("data-color", existingHl.color || "gold");
        }
        nodes.forEach(function (n) { span.appendChild(n); });
        p.appendChild(span);
        span.addEventListener("click", function (e) {
          if (e.target.closest("a")) return;
          var arr = state.user.highlights[chId] = state.user.highlights[chId] || [];
          var existingIdx = arr.findIndex(function (h) { return h.sec === sec && h.pidx === pidx && h.idx === idx; });
          if (existingIdx >= 0) {
            openHlSheet(span, sec, pidx, idx);
          } else {
            arr.push({ sec: sec, pidx: pidx, idx: idx, text: span.textContent.slice(0, 200), at: Date.now(), lang: state.lang, chId: chId, chTitle: ch.title, color: "gold" });
            span.setAttribute("data-hl", "1");
            span.setAttribute("data-color", "gold");
            saveUser();
          }
        });
      });
      groups.forEach(function (nodes, idx) {
        if (findHighlight(sec, pidx, idx)) renderHlNote(p, sec, pidx, idx);
      });
    });
  }

  // ---------------------------------------------------------------
  // 我的
  // ---------------------------------------------------------------
  function renderMe(view) {
    var ids = chapterIds();
    var doneCount = ids.filter(function (c) { return state.user.completedChapters[c]; }).length;
    var html = '<div class="card"><div class="section-title" style="margin-top:0">' + esc(t().meProgress) + '</div>';
    html += '<div style="font-size:26px;font-weight:800;color:var(--accent);">' + doneCount + ' <span style="font-size:14px;color:var(--ink-faint);font-weight:600;">/ ' + ids.length + '</span></div>';
    html += '<div style="height:8px;background:var(--surface-alt);border-radius:4px;margin-top:8px;overflow:hidden;"><div style="height:100%;background:var(--accent);width:' + Math.round(doneCount / ids.length * 100) + '%;"></div></div>';
    html += '<div style="display:flex;gap:8px;margin-top:10px"><a class="btn" style="flex:1" href="#/tools/journey">🧭 旅程</a><a class="btn" style="flex:1" href="#/tools/920">🍇 920</a></div></div>';

    html += '<div class="section-title">' + esc(t().meDeclarations) + '</div><div class="card">';
    var decls = state.user.declarations.slice().reverse();
    if (!decls.length) html += '<div class="empty">' + esc(t().meNoDeclarations) + '</div>';
    decls.slice(0, 40).forEach(function (dcl) { html += '<div class="declitem"><div class="d">' + esc(dcl.text) + '</div><div class="m">' + esc(dcl.chTitle) + ' · ' + fmtDate(dcl.at) + '</div></div>'; });
    html += '</div>';

    html += '<div class="section-title">' + esc(t().mePractices) + '</div><div class="card">';
    var log = state.user.practiceLog.slice().reverse();
    if (!log.length) html += '<div class="empty">' + esc(t().meNoPractices) + '</div>';
    log.slice(0, 20).forEach(function (l) { html += '<div class="declitem"><div class="d">' + esc(l.text) + '</div><div class="m">' + esc(l.chTitle) + (l.person ? ' · 為 ' + esc(l.person) : '') + ' · ' + fmtDate(l.at) + '</div></div>'; });
    html += '</div>';

    html += '<div class="section-title">' + esc(t().meHighlights) + '</div><div class="card">';
    var hls = [];
    Object.keys(state.user.highlights).forEach(function (cid) { (state.user.highlights[cid] || []).forEach(function (h) { hls.push(h); }); });
    hls.sort(function (a, b) { return b.at - a.at; });
    if (!hls.length) html += '<div class="empty">' + esc(t().meNoHighlights) + '</div>';
    hls.slice(0, 40).forEach(function (h) { html += '<a class="rowlink" href="#/course/' + h.chId + '"><div class="meta"><div class="t">' + esc(h.text) + '</div><div class="s">' + esc(h.chTitle) + (h.note ? ' · 📝 ' + esc(h.note.slice(0, 40)) : '') + ' · ' + fmtDate(h.at) + '</div></div></a>'; });
    html += '</div>';

    html += '<div class="section-title">' + esc(t().meFavorites) + '</div><div class="card">';
    var favs = state.user.favorites.slice().reverse();
    if (!favs.length) html += '<div class="empty">' + esc(t().meNoFavorites) + '</div>';
    favs.slice(0, 60).forEach(function (f) {
      html += '<div class="favitem">' + (f.question ? '<div class="fq">' + esc(f.question) + '</div>' : '') + '<div class="fa">' + mdToHtml(f.answer) + '</div>';
      html += '<div class="m"><span>' + esc(f.chTitle || "") + (f.chTitle ? " · " : "") + fmtDate(f.at) + '</span><button type="button" class="favdel" data-favid="' + esc(f.msgId) + '">🗑</button></div></div>';
    });
    html += '</div>';

    html += '<div class="section-title">' + esc(t().meSettings) + '</div><div class="card">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;"><span>外觀</span><div class="langswitch" id="themeswitch"><button data-theme="light">' + esc(t().themeLight) + '</button><button data-theme="dark">' + esc(t().themeDark) + '</button><button data-theme="auto">' + esc(t().themeAuto) + '</button></div></div>';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-top:1px solid var(--border);"><span>' + esc(t().meFontSize) + '</span><div class="langswitch" id="fontswitch"><button data-font="0">' + esc(t().fontStandard) + '</button><button data-font="1">' + esc(t().fontLarge) + '</button><button data-font="2">' + esc(t().fontXLarge) + '</button><button data-font="3">' + esc(t().fontXXLarge) + '</button></div></div>';
    var voiceOpts = TTS_VOICE_OPTIONS[state.lang] || TTS_VOICE_OPTIONS.zh;
    var curVoiceId = (state.user.ttsVoice && state.user.ttsVoice[state.lang]) || TTS_VOICE_DEFAULT[state.lang];
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-top:1px solid var(--border);"><span>' + esc(t().meVoice) + '</span><div class="langswitch" id="voiceswitch">' + voiceOpts.map(function (o) { return '<button data-voice="' + esc(o.id) + '">' + esc(o.label) + '</button>'; }).join("") + '</div></div>';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-top:1px solid var(--border);"><span>資料備份</span><div style="display:flex;gap:6px"><button class="btn" id="exportData" style="padding:6px 10px;font-size:12.5px">匯出</button><button class="btn" id="importData" style="padding:6px 10px;font-size:12.5px">匯入</button><input type="file" id="importFile" accept="application/json" hidden></div></div>';
    html += '<p class="muted" style="margin:8px 0 0;font-size:11.5px">落實321 v' + VERSION + ' · 資料只存在這台裝置，換手機前請先匯出備份。</p></div>';
    view.innerHTML = html;
    qsa("#themeswitch button", view).forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-theme") === state.user.theme); b.addEventListener("click", function () { state.user.theme = b.getAttribute("data-theme"); saveUser(); applyTheme(); renderMe(view); }); });
    qsa("#fontswitch button", view).forEach(function (b) { b.classList.toggle("active", parseInt(b.getAttribute("data-font"), 10) === state.font); b.addEventListener("click", function () { setFont(parseInt(b.getAttribute("data-font"), 10)); renderMe(view); }); });
    qsa("#voiceswitch button", view).forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-voice") === curVoiceId); b.addEventListener("click", function () { setTtsVoice(state.lang, b.getAttribute("data-voice")); renderMe(view); }); });
    qsa(".favdel", view).forEach(function (b) { b.addEventListener("click", function () { var id = b.getAttribute("data-favid"); state.user.favorites = state.user.favorites.filter(function (f) { return f.msgId !== id; }); saveUser(); renderMe(view); }); });
    qs("#exportData", view).addEventListener("click", function () {
      try {
        var blob = new Blob([JSON.stringify(state.user, null, 1)], { type: "application/json" });
        var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "luoshi321-backup-" + fmtDate(Date.now()) + ".json"; document.body.appendChild(a); a.click(); a.remove();
      } catch (e) { uiToast("匯出失敗"); }
    });
    qs("#importData", view).addEventListener("click", function () { qs("#importFile", view).click(); });
    qs("#importFile", view).addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () { try { var obj = JSON.parse(rd.result); if (!obj || typeof obj !== "object" || !("highlights" in obj)) throw new Error("bad"); var def = userDefaults(); for (var k in def) if (!(k in obj)) obj[k] = def[k]; state.user = obj; saveUser(); applyTheme(); uiToast("已匯入"); renderMe(view); } catch (err) { uiToast("匯入失敗：檔案格式不符"); } };
      rd.readAsText(f);
    });
  }
  function applyTheme() {
    var th = state.user.theme || "auto";
    if (th === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", th);
  }

  // ---------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------
  var bootWatchdog = setTimeout(function () { var diag = qs("#boot-diag"); if (diag) diag.style.display = "flex"; }, 8000);
  function finishBoot() { clearTimeout(bootWatchdog); var boot = qs("#boot"); if (boot) boot.remove(); }
  qs("#boot-reload") && qs("#boot-reload").addEventListener("click", function () { location.reload(); });
  qs("#boot-clear") && qs("#boot-clear").addEventListener("click", function () {
    if ("caches" in window) caches.keys().then(function (keys) { Promise.all(keys.map(function (k) { return caches.delete(k); })).then(function () { location.reload(); }); });
    else location.reload();
  });
  function switchLang(lang) {
    if (lang === state.lang) return;
    spkStopAll();
    state.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    state.index = null; state.units = {}; state.d = { chapters: {}, companionQs: [] }; state.tracks = null;
    document.documentElement.setAttribute("data-lang", lang);
    qsa("#langswitch button").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-lang") === lang); });
    loadIndex().then(render).catch(function () { render(); });
  }
  function init() {
    applyTheme(); applyFont(); ttsWarmUp();
    on(qs("#langswitch"), "click", "button", function (e, btn) { switchLang(btn.getAttribute("data-lang")); });
    qsa("#langswitch button").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-lang") === state.lang); });
    window.addEventListener("hashchange", render);
    loadIndex().then(function () {
      finishBoot(); render();
      if (state.user.remind && state.user.remind.on) scheduleReminderCheck();
      document.addEventListener("visibilitychange", function () { if (!document.hidden) checkReminder(); });
      // 背景預抓第一單元（若目前不在某課）與上次所在單元
      var hint = currentChapterHint(); var u = hint ? unitOf(hint) : null;
      setTimeout(function () { loadUnit(u ? u.n : 1).catch(function () {}); }, 800);
    }).catch(function (err) {
      finishBoot();
      qs("#view").innerHTML = '<div class="empty">載入內容失敗，請檢查網路連線後重新整理。<br><span style="font-size:11px;">' + esc(String(err)) + '</span></div>';
    });
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
  }
  init();
})();
