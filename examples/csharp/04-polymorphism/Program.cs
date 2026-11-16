using System;
using System.Collections.Generic;
using ConceptLab.Ch04;

List<Animal> animals = new()
{
    new Dog("阿柴"),
    new Cat("橘貓"),
    new Duck("小鴨"),
    new Animal("未分類動物")
};

foreach (Animal animal in animals)
{
    Console.WriteLine(animal.Speak());
}

// 多載（overload）範例：編譯期依參數選擇 Speak(int)
Console.WriteLine(animals[0].Speak(2));
