export const CATEGORIES = [
  { id: "op", label: "Operations", zh: "操作词 · 动词、介词、代词、连词等", count: 100, tag: "OP" },
  { id: "gt", label: "General Things", zh: "一般事物 · 抽象名词", count: 400, tag: "GT" },
  { id: "pt", label: "Picturable Things", zh: "可画名词 · 具体可视的事物", count: 200, tag: "PT" },
  { id: "qg", label: "Qualities — General", zh: "一般性质 · 形容词", count: 100, tag: "QG" },
  { id: "qo", label: "Qualities — Opposites", zh: "对立性质 · 反义形容词", count: 50, tag: "OPP" }
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
      return {
        w: word,
        c: categoryId,
        position: index + 1,
        tag: category?.tag || categoryId.toUpperCase(),
        zh: hint.zh,
        en: hint.en,
        ex: hint.ex(word),
        exz: hint.exz(word),
        s: related
      };
    });
  });
}

export function getCategory(id) {
  return CATEGORIES.find((item) => item.id === id);
}
