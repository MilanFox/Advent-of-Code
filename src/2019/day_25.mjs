import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'node:fs';
import { getUserInput } from './utils/getUserInput.mjs';

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(Number);

const vm = new IntCodeComputer(memory, { logOutputAsAscii: true });

vm.on(vm.EVENT_NAMES.NEEDS_INPUT, async () => {
  const userInput = await getUserInput({ isAscii: true });
  for (const asciiCode of userInput) vm.queueInput(asciiCode);
  await vm.run();
});

await vm.run();
