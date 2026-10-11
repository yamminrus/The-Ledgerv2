import assert from "node:assert/strict";
import { validateAnalysis } from "../src/lib/validateAnalysis";

const validAnalysis = {
  title: "Contract Review",
  summary: "A summary of the contract.",
  plainEnglishTranslation: "This agreement explains the terms.",
  riskScore: 72,
  redFlags: [],
  questionsForAttorney: [],
};

let passed = 0;

function check(name: string, value: unknown, expectedOk: boolean) {
  const result = validateAnalysis(value);
  assert.equal(
    result.ok,
    expectedOk,
    `${name}: expected ok=${expectedOk}, got ${JSON.stringify(result)}`
  );
  passed++;
  console.log(`PASS: ${name}`);
}

check("accepts valid analysis", validAnalysis, true);
check("rejects null", null, false);
check("rejects an array instead of an object", [], false);
check("rejects an empty object", {}, false);

check(
  "rejects blank title",
  { ...validAnalysis, title: "   " },
  false
);

check(
  "rejects missing summary",
  { ...validAnalysis, summary: undefined },
  false
);

check(
  "rejects missing plain-English translation",
  { ...validAnalysis, plainEnglishTranslation: undefined },
  false
);

check("rejects risk score below 1", { ...validAnalysis, riskScore: 0 }, false);
check("rejects risk score above 100", { ...validAnalysis, riskScore: 101 }, false);
check("rejects decimal risk score", { ...validAnalysis, riskScore: 72.5 }, false);
check("rejects string risk score", { ...validAnalysis, riskScore: "72" }, false);

check("rejects missing redFlags array", { ...validAnalysis, redFlags: undefined }, false);
check(
  "rejects missing questionsForAttorney array",
  { ...validAnalysis, questionsForAttorney: undefined },
  false
);

console.log(`\n${passed} validator tests passed.`);
