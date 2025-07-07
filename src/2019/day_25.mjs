import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'node:fs';
import { getUserInput } from './utils/getUserInput.mjs';

const memory = fs.readFileSync('testInput.txt', 'utf-8').trim().split(',').map(Number);

const vm1 = new IntCodeComputer(memory, { logOutputAsAscii: true });

vm1.on(vm1.EVENT_NAMES.NEEDS_INPUT, async () => {
  const userInput = await getUserInput({ isAscii: true });
  for (const asciiCode of userInput) vm1.queueInput(asciiCode);
  await vm1.run();
});

await vm1.run();
