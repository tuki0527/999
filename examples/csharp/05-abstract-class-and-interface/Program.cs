using System.Collections.Generic;
using ConceptLab.Ch05;

var circle = new Circle("深藍", 5);
var label = new TextLabel("座標原點 (0,0)");

// 以抽象類別操作同家族面積
Shape shapeRef = circle;
System.Console.WriteLine(shapeRef.Describe());

// 以介面操作跨類別的繪製能力
List<IDrawable> canvasItems = new() { circle, label };
foreach (IDrawable item in canvasItems)
{
    item.Draw();
}
