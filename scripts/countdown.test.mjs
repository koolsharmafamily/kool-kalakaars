import { getCountdownState, formatEventDate } from "../lib/countdown.ts";

const NOW = Date.parse("2026-09-06T12:00:00+05:30");
let pass = 0, fail = 0;
const check = (name, cond, got) => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name} -> ${JSON.stringify(got)}`); }
};

console.log("\nCOUNTDOWN STATE MACHINE\n");

const unset = getCountdownState(null, NOW);
check("null date -> unset", unset.status === "unset", unset);

const empty = getCountdownState("", NOW);
check("empty string -> unset", empty.status === "unset", empty);

const undef = getCountdownState(undefined, NOW);
check("undefined -> unset", undef.status === "unset", undef);

const bad = getCountdownState("19 December, sometime", NOW);
check("unparseable date -> invalid (not NaN)", bad.status === "invalid", bad);

const typo = getCountdownState("2026-13-45T99:99:99+05:30", NOW);
check("impossible date -> invalid (not NaN)", typo.status === "invalid", typo);

const past = getCountdownState("2026-01-15T18:30:00+05:30", NOW);
check("past date -> past", past.status === "past", past);

const exact = getCountdownState("2026-09-06T12:00:00+05:30", NOW);
check("exactly now -> past", exact.status === "past", exact);

const future = getCountdownState("2026-12-19T18:30:00+05:30", NOW);
check("future date -> counting", future.status === "counting", future);
check("days is a real number", Number.isInteger(future.days) && !Number.isNaN(future.days), future.days);
check("days = 104", future.days === 104, future.days);
check("hours 0-23", future.hours >= 0 && future.hours < 24, future.hours);
check("minutes 0-59", future.minutes >= 0 && future.minutes < 60, future.minutes);
check("seconds 0-59", future.seconds >= 0 && future.seconds < 60, future.seconds);

// No state anywhere may contain NaN.
const allStates = [unset, empty, undef, bad, typo, past, exact, future];
const anyNaN = allStates.some(s => Object.values(s).some(v => typeof v === "number" && Number.isNaN(v)));
check("NO state contains NaN anywhere", !anyNaN, allStates);

// One second before the event, then one second after.
const t = "2026-12-19T18:30:00+05:30";
const target = Date.parse(t);
const before = getCountdownState(t, target - 1000);
const after  = getCountdownState(t, target + 1000);
check("1s before -> counting, 0d 0h 0m 1s", before.status === "counting" && before.days === 0 && before.hours === 0 && before.minutes === 0 && before.seconds === 1, before);
check("1s after  -> past", after.status === "past", after);

console.log("\nDATE FORMATTING (Asia/Kolkata)\n");
check("null -> null", formatEventDate(null) === null, formatEventDate(null));
check("garbage -> null (never 'Invalid Date')", formatEventDate("nonsense") === null, formatEventDate("nonsense"));
const fmt = formatEventDate(t);
check("formats in IST", typeof fmt === "string" && fmt.includes("December") && fmt.includes("2026"), fmt);
console.log(`       -> "${fmt}"`);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
