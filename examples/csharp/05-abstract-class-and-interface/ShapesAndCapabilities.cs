using System;

namespace ConceptLab.Ch05;

// 抽象類別：提供共用欄位（Name、Color）、建構式與抽象計算規範
public abstract class Shape
{
    public string Name { get; }
    public string Color { get; }

    protected Shape(string name, string color)
    {
        Name = name;
        Color = color;
    }

    public abstract double GetArea();
    public string Describe() => $"[{Color}] {Name}（面積：{GetArea():F2}）";
}

// 介面：定義跨類別的「可繪製」能力約定（C# 8+ 可含預設實作，但不可含實例欄位/建構式）
public interface IDrawable
{
    void Draw();
    string RenderTag() => "CanvasItem";
}

public class Circle : Shape, IDrawable
{
    public double Radius { get; }
    public Circle(string color, double radius) : base("圓形", color) => Radius = radius;

    public override double GetArea() => Math.PI * Radius * Radius;
    public void Draw() => Console.WriteLine($"繪製 {Describe()}｜標籤：{((IDrawable)this).RenderTag()}");
}

// 跨不同階層的獨立類別（並非 Shape）也可實作 IDrawable
public class TextLabel : IDrawable
{
    public string Text { get; }
    public TextLabel(string text) => Text = text;

    public void Draw() => Console.WriteLine($"繪製文字標籤：「{Text}」");
}
