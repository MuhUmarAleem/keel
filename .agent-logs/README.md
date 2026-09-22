# Agent logs

Cursor hooks write every prompt, response, and tool event into `sessions/*.jsonl`.

```
node scripts/test-agent-capture.cjs
```

That must print `CAPTURE TEST PASSED` before product work starts. Commit this directory as you go, not in one lump at the end.
