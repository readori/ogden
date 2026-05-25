import { PUBLIC_ENRICHMENT } from "./enrichment.js";

export const CATEGORIES = [
  { id: "op", label: "Operations", zh: "操作词 · 动词、介词、代词、连词等", count: 100, tag: "OP" },
  { id: "gt", label: "General Things", zh: "一般事物 · 抽象名词", count: 400, tag: "GT" },
  { id: "pt", label: "Picturable Things", zh: "可画名词 · 具体可视的事物", count: 200, tag: "PT" },
  { id: "qg", label: "Qualities — General", zh: "一般性质 · 形容词", count: 100, tag: "QG" },
  { id: "qo", label: "Qualities — Opposites", zh: "对立性质 · 反义形容词", count: 50, tag: "OPP" }
];

export const APP_VERSION = "20260525-reader2";

export const BOOK_INFO = {
  title: "Basic English: A General Introduction with Rules and Grammar",
  author: "C. K. Ogden",
  year: 1930,
  publisher: "London: Paul Treber",
  note: "The project follows Ogden's 850-root vocabulary split and simplified grammar model."
};

export const BASIC_RULES = [
  {
    id: "word-groups",
    title: "850 roots",
    zh: "850 个核心词根分成 100 个操作词、400 个一般事物、200 个可画事物、100 个一般性质和 50 个对立性质。",
    en: "The vocabulary is organized as 850 roots across operations, things, and qualities.",
    example: "come / account / apple / able / awake"
  },
  {
    id: "operators",
    title: "18 operators",
    zh: "Basic English 以 18 个操作词承担大部分动词功能，减少复杂动词变化。",
    en: "Eighteen operators do much of the work normally done by verbs.",
    example: "come, get, give, go, keep, let, make, put, seem, take, be, do, have, say, see, send, may, will"
  },
  {
    id: "plural",
    title: "Plural -s",
    zh: "名词通常用 -s、-es、-ies 构成复数。",
    en: "Plural nouns are made with -s and normal spelling variants.",
    example: "book -> books; box -> boxes; country -> countries"
  },
  {
    id: "derivatives",
    title: "Small derivation set",
    zh: "允许少量派生形式，例如名词的 -er / -ing，性质词的 -ing / -ed。",
    en: "A small set of endings extends the core vocabulary.",
    example: "work -> worker; build -> building; mix -> mixed"
  },
  {
    id: "adverbs",
    title: "Quality + -ly",
    zh: "副词通常由性质词加 -ly 构成。",
    en: "Adverbs may be formed by adding -ly to quality words.",
    example: "quick -> quickly; quiet -> quietly"
  },
  {
    id: "comparison",
    title: "more / most",
    zh: "比较级优先使用 more / most，常见 -er / -est 形式也可识别。",
    en: "Comparison is normally expressed with more and most.",
    example: "more complex; most important; cheaper"
  },
  {
    id: "negative",
    title: "un- negatives",
    zh: "否定性质词可用 un- 构成。",
    en: "Negative qualities can be formed with un-.",
    example: "wise -> unwise; happy -> unhappy"
  },
  {
    id: "questions",
    title: "do questions",
    zh: "疑问句使用 do 或倒装，保持英语常规语序。",
    en: "Questions use do or inversion in a simplified English pattern.",
    example: "Do you have some water?"
  },
  {
    id: "compounds",
    title: "Compounds",
    zh: "可用两个名词，或名词加方向/关系词组成复合词。",
    en: "Compounds can combine nouns or a noun with a directive.",
    example: "milkman; soapbox; sundown"
  },
  {
    id: "technical",
    title: "Technical terms",
    zh: "必要的专业词可保留，但应尽量用 Basic English 解释。",
    en: "Needed technical terms should be explained using Basic English words.",
    example: "\"vocabulary\" = list of words"
  }
];

export const RAW_WORDS = {
  op: `come get give go keep let make put seem take be do have say see send may will about across after against among at before between by down from in off on over through to under up with as for of till than a the all any every little much no other some such that this I he you who and because but or if though while how when where why again ever far forward here near now out still then there together well almost enough even not only quite so very tomorrow yesterday north south east west please yes`,
  gt: `account act addition adjustment advertisement agreement air amount amusement animal answer apparatus approval argument art attack attempt attention attraction authority back balance base behavior belief birth bit bite blood blow body brass bread breath brother building burn burst business butter canvas care cause chalk chance change cloth coal color comfort committee company comparison competition condition connection control cook copper copy cork cotton cough country cover crack credit crime crush cry current curve damage danger daughter day death debt decision degree design desire destruction detail development digestion direction discovery discussion disease disgust distance distribution division doubt drink driving dust earth edge education effect end error event example exchange existence expansion experience expert fact fall family father fear feeling fiction field fight fire flame flight flower fold food force form friend front fruit glass gold government grain grass grip group growth guide harbor harmony hate hearing heat help history hole hope hour humor ice idea impulse increase industry ink insect instrument insurance interest invention iron jelly join journey judge jump kick kiss knowledge land language laugh law lead learning leather letter level lift light limit linen liquid list look loss love machine man manager mark market mass meal measure meat meeting memory metal middle milk mind mine minute mist money month morning mother motion mountain move music name nation need news night noise note number observation offer oil operation opinion order organization ornament owner page pain paint paper part paste payment peace person place plant play pleasure point poison polish porter position powder power price print process produce profit property prose protest pull punishment purpose push quality question rain range rate ray reaction reading reason record regret relation religion representative request respect rest reward rhythm rice river road roll room rub rule run salt sand scale science sea seat secretary selection self sense servant sex shade shake shame shock side sign silk silver sister size sky sleep slip slope smash smell smile smoke sneeze snow soap society son song sort sound soup space stage start statement steam steel step stitch stone stop story stretch structure substance sugar suggestion summer support surprise swim system talk taste tax teaching tendency test theory thing thought thunder time tin top touch trade transport trick trouble turn twist unit use value verse vessel view voice walk war wash waste water wave wax way weather week weight wind wine winter woman wood wool word work wound writing year`,
  pt: `angle ant apple arch arm army baby bag ball band basin basket bath bed bee bell berry bird blade board boat bone book boot bottle box boy brain brake branch brick bridge brush bucket bulb button cake camera card cart carriage cat chain cheese chest chin church circle clock cloud coat collar comb cord cow cup curtain cushion dog door drain drawer dress drop ear egg engine eye face farm feather finger fish flag floor fly foot fork fowl frame garden girl glove goat gun hair hammer hand hat head heart hook horn horse hospital house island jewel kettle key knee knife knot leaf leg library line lip lock map match monkey moon mouth muscle nail neck needle nerve net nose nut office orange oven parcel pen pencil picture pig pin pipe plane plate plow pocket pot potato prison pump rail rat receipt ring rod roof root sail school scissors screw seed sheep shelf ship shirt shoe skin skirt snake sock spade sponge spoon spring square stamp star station stem stick stocking stomach store street sun table tail thread throat thumb ticket toe tongue tooth town train tray tree trousers umbrella wall watch wheel whip whistle window wing wire worm`,
  qg: `able acid angry automatic beautiful black boiling bright broken brown cheap chemical chief clean clear common complex conscious cut deep dependent early elastic electric equal fat fertile first fixed flat free frequent full general good great gray hanging happy hard healthy high hollow important kind like living long male married material medical military natural necessary new normal open parallel past physical political poor possible present private probable quick quiet ready red regular responsible right round same second separate serious sharp smooth sticky stiff straight strong sudden sweet tall thick tight tired true violent waiting warm wet wide wise yellow young`,
  qo: `awake bad bent bitter blue certain cold complete cruel dark dead dear delicate different dirty dry false feeble female foolish future green ill last late left loose loud low mixed narrow old opposite public rough sad safe secret short shut simple slow small soft solid special strange thin white wrong`
};

const CATEGORY_HINTS = {
  op: {
    zh: "Basic English 操作/关系词",
    en: "a core operation or relation word in Basic English",
    ex: (word) => `Use "${word}" to make a short Basic English sentence.`,
    exz: (word) => `用 "${word}" 写一个简单英文句子。`
  },
  gt: {
    zh: "抽象或通用事物名词",
    en: "a general thing, idea, action, or state",
    ex: (word) => `This ${word} is useful in Basic English.`,
    exz: (word) => `"${word}" 可用于表达一般事物或概念。`
  },
  pt: {
    zh: "可画出来的具体名词",
    en: "a concrete thing that can be pictured",
    ex: (word) => `Point to the ${word} and say its name.`,
    exz: (word) => `指着这个 "${word}" 并说出它的名字。`
  },
  qg: {
    zh: "一般性质或状态词",
    en: "a word for a general quality or condition",
    ex: (word) => `The thing may be ${word}.`,
    exz: (word) => `这个事物可能是 "${word}" 的。`
  },
  qo: {
    zh: "常见对立性质词",
    en: "a quality word often learned with its opposite",
    ex: (word) => `The answer can be ${word} in this example.`,
    exz: (word) => `在这个例子中，答案可以是 "${word}"。`
  }
};

const EXAMPLE_BUILDERS = {
  op: (word) => ({
    ex: `The word "${word}" can help make a simple sentence.`,
    exz: `"${word}" 这个词可以帮助组成一个简单句。`
  }),
  gt: (word) => ({
    ex: `The ${word} was part of our talk today.`,
    exz: `"${word}" 是我们今天谈话的一部分。`
  }),
  pt: (word) => ({
    ex: `I can see the ${word} in the picture.`,
    exz: `我能在图画里看到这个 "${word}"。`
  }),
  qg: (word) => ({
    ex: `The answer is ${word} enough for daily use.`,
    exz: `这个答案足够 "${word}"，适合日常使用。`
  }),
  qo: (word) => ({
    ex: `The room felt ${word} after the change.`,
    exz: `变化之后，房间显得 "${word}"。`
  })
};

const SYN_DETAIL_TEMPLATES = {
  op: [
    { def: "相关的动作或关系词", vs: "用于和主词比较动作方向、许可或连接关系", use: "造句、改写、基础语法替换" },
    { def: "可帮助扩展句型的基础词", vs: "比主词更偏向另一个动作阶段或语气", use: "短句练习、问答转换" },
    { def: "同一组 Basic English 操作词", vs: "保留基础含义，但句中功能不同", use: "动词、介词、连词的搭配训练" }
  ],
  gt: [
    { def: "相关的一般事物或抽象概念", vs: "和主词同属通用名词，但关注点不同", use: "讨论事实、关系、状态或日常事件" },
    { def: "可与主词一起记忆的概念词", vs: "比主词更偏向原因、结果、过程或对象", use: "阅读理解、概念分类、写作替换" },
    { def: "同类通用名词", vs: "语义相近但适用的语境边界不同", use: "主题词汇组、段落表达" }
  ],
  pt: [
    { def: "相关的具体可见事物", vs: "同样可被画出，但形状、位置或用途不同", use: "看图说词、实物指认、场景描述" },
    { def: "可视化名词扩展", vs: "比主词更偏向另一个物件、部位或地点", use: "图片标注、儿童词汇、口语描述" },
    { def: "同一画面中可能出现的物体", vs: "和主词相关，但不是完全同一对象", use: "房间、街道、自然物或工具描写" }
  ],
  qg: [
    { def: "相关性质或状态", vs: "和主词同为描述性词，但强度或适用对象不同", use: "人物、物体、状态的细节描写" },
    { def: "可比较的品质词", vs: "比主词更强调外观、程度、功能或评价", use: "形容词辨析、对比句" },
    { def: "同类描述词", vs: "意义接近但判断标准不同", use: "写作润色、口语评价" }
  ],
  qo: [
    { def: "相关的对立或可比较性质", vs: "常用于和主词形成方向、状态或评价上的对比", use: "反义词训练、二选一判断" },
    { def: "常见对比形容词", vs: "和主词处在相近或相反的语义维度", use: "比较句、分类题、口语判断" },
    { def: "可放入对照组的性质词", vs: "比主词更偏向另一种状态或感受", use: "图表对照、状态变化描述" }
  ]
};

function exampleFor(categoryId, word) {
  return (EXAMPLE_BUILDERS[categoryId] || EXAMPLE_BUILDERS.gt)(word);
}

function relatedDetails(categoryId, main, related) {
  const templates = SYN_DETAIL_TEMPLATES[categoryId] || SYN_DETAIL_TEMPLATES.gt;
  return related.map((word, index) => {
    const template = templates[index % templates.length];
    return {
      w: word,
      def: `${word}: ${template.def}`,
      vs: `与 ${main} 相比，${template.vs}`,
      use: `${template.use}，例如 "${word}" / "${main}" 的替换练习`
    };
  });
}

export function buildFallbackWords() {
  return Object.entries(RAW_WORDS).flatMap(([categoryId, raw]) => {
    const category = CATEGORIES.find((item) => item.id === categoryId);
    const words = raw.split(/\s+/).filter(Boolean);
    return words.map((word, index) => {
      const related = [
        words[index - 1],
        words[index + 1],
        words[index + 2]
      ].filter(Boolean);
      const hint = CATEGORY_HINTS[categoryId];
      const example = exampleFor(categoryId, word);
      const enrichment = PUBLIC_ENRICHMENT[word] || {};
      return {
        w: word,
        c: categoryId,
        position: index + 1,
        tag: category?.tag || categoryId.toUpperCase(),
        zh: enrichment.zh || hint.zh,
        en: enrichment.en || hint.en,
        ex: enrichment.ex || example.ex || hint.ex(word),
        exz: enrichment.exz || example.exz || hint.exz(word),
        s: relatedDetails(categoryId, word, related)
      };
    });
  });
}

export function getCategory(id) {
  return CATEGORIES.find((item) => item.id === id);
}
