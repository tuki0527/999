using ConceptLab.Ch06.Decoupled;

var calculator = new PriceCalculator();

// 原本使用 EmailNotifier
var emailOrder = new OrderProcessor(calculator, new EmailNotifier());
emailOrder.PlaceOrder("alice@example.com", 1000m);

// 需求變更為簡訊通知：OrderProcessor 完全不用修改
var smsOrder = new OrderProcessor(calculator, new SmsNotifier());
smsOrder.PlaceOrder("0912-345-678", 1000m);
