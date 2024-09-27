import { redirect } from "next/navigation";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

export async function POST(req: Request) {
  const body = await req.formData();
  const baseurl = req.headers.get("Referer");

  const pid: string = String(body.get("razorpay_payment_id"));
  const oid: string = String(body.get("razorpay_order_id"));
  const signature = String(body.get("razorpay_signature"));
  const secret: string = String(process.env.RZP_KEY_SECRET);

  const isVerified = validatePaymentVerification(
    { order_id: oid, payment_id: pid },
    signature,
    secret
  );

  console.log(isVerified);
  if (isVerified) {
    return redirect(`${baseurl}?success=1`);
  } else {
    return redirect(`${baseurl}?cancelled=1`);
  }
}
