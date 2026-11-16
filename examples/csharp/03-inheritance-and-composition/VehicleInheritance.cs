namespace ConceptLab.Ch03;

// 方式 A：繼承（is-a）：汽車「是一種」交通工具
public class VehicleBase
{
    public string Brand { get; }
    public VehicleBase(string brand) => Brand = brand;
    public virtual string Describe() => $"{Brand} 交通工具";
}

public class SedanByInheritance : VehicleBase
{
    public int HorsePower { get; }
    public SedanByInheritance(string brand, int horsePower) : base(brand)
        => HorsePower = horsePower;

    public override string Describe() => $"{Brand} 轎車（繼承動力：{HorsePower} hp）";
}
