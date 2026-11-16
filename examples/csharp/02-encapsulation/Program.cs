using System;
using ConceptLab.Ch02;

var account = new BankAccount("001-2026-088", "林小安", 1000.00m);

var r1 = account.Deposit(250.50m);
Console.WriteLine($"{r1.Success} | {r1.Message} | 餘額：{r1.BalanceAfter:N2}");

var r2 = account.Withdraw(2000.00m);
Console.WriteLine($"{r2.Success} | {r2.Message} | 餘額：{r2.BalanceAfter:N2}");

var r3 = account.Deposit(-100.00m);
Console.WriteLine($"{r3.Success} | {r3.Message} | 餘額：{r3.BalanceAfter:N2}");

var r4 = account.Withdraw(350.25m);
Console.WriteLine($"{r4.Success} | {r4.Message} | 餘額：{r4.BalanceAfter:N2}");
