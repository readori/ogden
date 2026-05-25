# Authorized Word Data

Put authorized 850-word data here as `authorized-words.json`, or pass another file path with:

```bash
OGDEN_AUTHORIZED_DATA=path/to/words.json npm run build:seed
```

Supported shapes:

```json
[
  {
    "w": "come",
    "c": "op",
    "zh": "来，前来",
    "en": "move toward the speaker or a place",
    "ex": "Come here when you're ready.",
    "exz": "准备好了就过来。",
    "s": [
      { "w": "arrive", "def": "到达", "vs": "强调到达结果", "use": "arrive home" }
    ]
  }
]
```

Or:

```json
{
  "words": [
    { "w": "come", "c": "op", "zh": "...", "en": "...", "ex": "...", "exz": "...", "s": ["arrive"] }
  ],
  "synsDetail": {
    "come": {
      "arrive": { "def": "到达", "vs": "强调到达结果", "use": "arrive home" }
    }
  }
}
```

Do not import third-party translations, examples, or synonym notes unless you own them or have permission to use them.
