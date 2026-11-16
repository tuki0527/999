using System;

namespace ConceptLab.Ch06.Tight;

public class EmailSender
{
    public void SendEmail(string to, string body)
        => Console.WriteLine($"[Email -> {to}] {body}");
}

// 高耦合問題：直接 new EmailSender()，若改用簡訊通知必須修改本類別內部
public class TightOrderProcessor
{
    public void PlaceOrder(string customer, decimal subtotal)
    {
        decimal total = subtotal * 1.05m; // 計算邏輯也混在一起
        var sender = new EmailSender();
        sender.SendEmail(customer, $"訂單成立，含稅總額 {total:N0} 元");
    }
}
