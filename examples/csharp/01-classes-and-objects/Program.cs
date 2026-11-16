using System;
using ConceptLab.Ch01;

var studentA = new Student("S101", "林小安", 78);
var studentB = new Student("S102", "陳以樂", 54);

Console.WriteLine(studentA.GetSummary());
Console.WriteLine(studentB.GetSummary());

studentB.UpdateScore(82);

Console.WriteLine("更新陳以樂成績後：");
Console.WriteLine(studentA.GetSummary());
Console.WriteLine(studentB.GetSummary());
