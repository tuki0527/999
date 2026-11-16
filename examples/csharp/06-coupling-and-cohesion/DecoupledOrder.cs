using System;

namespace ConceptLab.Ch06.Decoupled;

// 1. 內聚職責一：專注金額計算
public class PriceCalculator
{
    public decimal CalculateTotal(decimal subtotal) => subtotal * 1.05m;
}

// 2. 抽象契約：讓訂單流程依賴抽象而非具體寄信工具
public interface INotifier
{
    string ChannelName { get; }
    void Notify(string recipient, string message);
}

public class EmailNotifier : INotifier
{
    public string ChannelName => "Email";
    public void Notify(string recipient, string message)
        => Console.WriteLine($"[Email -> {recipient}] {message}");
}

public class SmsNotifier : INotifier
{
    public string ChannelName => "SMS 簡訊";
    public void Notify(string recipient, string message)
        => Console.WriteLine($"[SMS -> {recipient}] {message}");
}

// 3. 內聚職責二：協調訂單流程（新增簡訊管道時，本類別一行都不必改）
public class OrderProcessor
{
    private readonly PriceCalculator _calculator;
    private readonly INotifier _notifier;

    public OrderProcessor(PriceCalculator calculator, INotifier notifier)
    {
        _calculator = calculator;
        _notifier = notifier;
    }

    public void PlaceOrder(string customer, decimal subtotal)
    {
        decimal total = _calculator.CalculateTotal(subtotal);
        _notifier.Notify(customer, $"訂單成立，含稅總額 {total:N0} 元");
    }
}
