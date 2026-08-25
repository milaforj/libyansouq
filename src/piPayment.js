// Minimal Pi Network payment flow for the "Process a Transaction" checklist step.
// Runs only inside Pi Browser, where window.Pi is injected by the SDK script in index.html.

export function runTestPiPayment(onStatus) {
  if (typeof window === "undefined" || !window.Pi) {
    onStatus("لازم تفتح التطبيق من داخل Pi Browser عشان يشتغل الدفع.");
    return;
  }

  try {
    window.Pi.init({ version: "2.0", sandbox: true });
  } catch (e) {
    onStatus("فشل تهيئة Pi SDK: " + e.message);
    return;
  }

  const scopes = ["payments"];

  window.Pi.authenticate(scopes, (payment) => {
    console.log("Incomplete payment found:", payment);
  })
    .then((auth) => {
      onStatus("تم تسجيل الدخول بـ Pi، جاري بدء الدفع...");

      window.Pi.createPayment(
        {
          amount: 1,
          memo: "دفعة تجريبية - السوق الليبي",
          metadata: { purpose: "checklist-test-payment" },
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            onStatus("جاري تأكيد الدفع من السيرفر...");
            await fetch("/api/payments/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: async (paymentId, txid) => {
            await fetch("/api/payments/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            onStatus("✅ تمت عملية الدفع التجريبية بنجاح!");
          },
          onCancel: () => onStatus("تم إلغاء عملية الدفع."),
          onError: (err) => onStatus("خطأ أثناء الدفع: " + (err?.message || err)),
        }
      );
    })
    .catch((err) => {
      onStatus("فشل تسجيل الدخول بـ Pi: " + (err?.message || err));
    });
}
