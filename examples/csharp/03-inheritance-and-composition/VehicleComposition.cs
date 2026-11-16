namespace ConceptLab.Ch03;

// 方式 B：組合（has-a）：汽車「擁有一個」可替換的動力引擎
public interface IPowerUnit
{
    string EngineLabel { get; }
    string Start();
}

public class PetrolEngine : IPowerUnit
{
    public string EngineLabel => "1.8L 汽油引擎";
    public string Start() => "點火啟動汽油引擎";
}

public class ElectricMotor : IPowerUnit
{
    public string EngineLabel => "150kW 純電馬達";
    public string Start() => "靜音啟動純電馬達";
}

public class CarWithComposition
{
    private IPowerUnit _engine;
    public string Brand { get; }

    public CarWithComposition(string brand, IPowerUnit engine)
    {
        Brand = brand;
        _engine = engine;
    }

    public void SwapEngine(IPowerUnit nextEngine) => _engine = nextEngine;
    public string Drive() => $"{Brand} 搭載 [{_engine.EngineLabel}] → {_engine.Start()}";
}
