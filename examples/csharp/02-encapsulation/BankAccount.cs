namespace ConceptLab.Ch02;

public sealed class OperationResult
{
    public bool Success { get; }
    public string Message { get; }
    public decimal BalanceAfter { get; }

    public OperationResult(bool success, string message, decimal balanceAfter)
    {
        Success = success;
        Message = message;
        BalanceAfter = balanceAfter;
    }
}

public class BankAccount
{
    private decimal _balance;

    public string AccountNumber { get; }
    public string OwnerName { get; }
    public decimal Balance => _balance;

    public BankAccount(string accountNumber, string ownerName, decimal initialBalance)
    {
        AccountNumber = accountNumber;
        OwnerName = ownerName;
        _balance = initialBalance >= 0m ? initialBalance : 0m;
    }

    public OperationResult Deposit(decimal amount)
    {
        if (amount <= 0m)
        {
            return new OperationResult(false, "存款金額必須大於 0。", _balance);
        }

        _balance += amount;
        return new OperationResult(true, $"成功存入 {amount:N2} 元。", _balance);
    }

    public OperationResult Withdraw(decimal amount)
    {
        if (amount <= 0m)
        {
            return new OperationResult(false, "提款金額必須大於 0。", _balance);
        }

        if (amount > _balance)
        {
            return new OperationResult(false, "餘額不足，無法完成提款。", _balance);
        }

        _balance -= amount;
        return new OperationResult(true, $"成功提領 {amount:N2} 元。", _balance);
    }
}
