export interface AnimalItem {
  id: string;
  declaredType: 'Animal';
  runtimeType: 'Dog' | 'Cat' | 'Duck' | 'Animal';
  name: string;
  overrideLineRange: number[];
  soundOutput: string;
  overloadOutput: string;
  dispatchNote: string;
}

export const ANIMAL_COLLECTION: AnimalItem[] = [
  {
    id: 'dog',
    declaredType: 'Animal',
    runtimeType: 'Dog',
    name: '阿柴',
    overrideLineRange: [15, 17, 18, 19],
    soundOutput: '阿柴：汪汪！',
    overloadOutput: '阿柴：汪汪！（重複 2 次）',
    dispatchNote:
      '變數宣告型別是 Animal，但執行期實際物件為 Dog；CLR 查表分派至 Dog.Speak()（override）。',
  },
  {
    id: 'cat',
    declaredType: 'Animal',
    runtimeType: 'Cat',
    name: '橘貓',
    overrideLineRange: [21, 23, 24, 25],
    soundOutput: '橘貓：喵～',
    overloadOutput: '橘貓：喵～（重複 2 次）',
    dispatchNote:
      '變數宣告型別同樣是 Animal，執行期實際物件為 Cat，自動分派至 Cat.Speak()（override）。',
  },
  {
    id: 'duck',
    declaredType: 'Animal',
    runtimeType: 'Duck',
    name: '小鴨',
    overrideLineRange: [27, 29, 30, 31],
    soundOutput: '小鴨：呱呱！',
    overloadOutput: '小鴨：呱呱！（重複 2 次）',
    dispatchNote:
      '新增 Duck 時，原本巡迴 List<Animal> 的 foreach 迴圈一行都不必改，展現多型擴充性。',
  },
  {
    id: 'base',
    declaredType: 'Animal',
    runtimeType: 'Animal',
    name: '未分類動物',
    overrideLineRange: [8, 9],
    soundOutput: '未分類動物 發出一般動物聲音',
    overloadOutput: '未分類動物 發出一般動物聲音（重複 2 次）',
    dispatchNote:
      '實際物件即為基底型別 Animal，因此直接執行 virtual Speak() 的預設實作。',
  },
];
