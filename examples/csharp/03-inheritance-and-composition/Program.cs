using System;
using ConceptLab.Ch03;

var inheritedCar = new SedanByInheritance("Toyota", 140);
Console.WriteLine(inheritedCar.Describe());

var composedCar = new CarWithComposition("Civic", new PetrolEngine());
Console.WriteLine(composedCar.Drive());

composedCar.SwapEngine(new ElectricMotor());
Console.WriteLine(composedCar.Drive());
