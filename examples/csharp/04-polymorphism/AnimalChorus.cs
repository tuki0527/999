namespace ConceptLab.Ch04;

public class Animal
{
    public string Name { get; }
    public Animal(string name) => Name = name;

    // virtual 允許子類別依實際型別進行動態覆寫（override）
    public virtual string Speak() => $"{Name} 發出一般動物聲音";

    // overload（多載）：同名但參數數量不同，編譯期即決定呼叫版本
    public string Speak(int times) => $"{Speak()}（重複 {times} 次）";
}

public class Dog : Animal
{
    public Dog(string name) : base(name) { }
    public override string Speak() => $"{Name}：汪汪！";
}

public class Cat : Animal
{
    public Cat(string name) : base(name) { }
    public override string Speak() => $"{Name}：喵～";
}

public class Duck : Animal
{
    public Duck(string name) : base(name) { }
    public override string Speak() => $"{Name}：呱呱！";
}
