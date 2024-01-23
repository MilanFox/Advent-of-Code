import 'dart:io';

void main() {
  List<List<int>> inputData = File('input.txt')
      .readAsStringSync()
      .trim()
      .split('\n\n')
      .map((elf) => elf.split('\n').map((cal) => int.parse(cal, radix: 10)).toList())
      .toList();

  List<int> totalCalories = inputData
      .map((elf) => elf.reduce((acc, cur) => acc + cur))
      .toList();

  totalCalories.sort((a, b) => b - a);

  print('Part 1: ${totalCalories[0]}');
  print('Part 2: ${totalCalories.sublist(0, 3).reduce((acc, cur) => acc + cur)}');
}
