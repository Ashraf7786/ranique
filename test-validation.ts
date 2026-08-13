import { OrderCreateSchema } from "./lib/validation";

const body = {
  items: [
    {
      productId: "123",
      quantity: 1,
    }
  ],
  shippingAddress: {
    name: "Mariyam Siddiqui",
    phone: "92884 67633",
    email: "you@example.com",
    line1: "House 1",
    line2: "",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "824124",
    country: "India"
  },
  paymentMethod: "COD",
  totalAmount: 299,
  couponCode: null,
};

const parsed = OrderCreateSchema.safeParse(body);
if (!parsed.success) {
  console.log("Failed:", parsed.error.flatten().fieldErrors);
} else {
  console.log("Success");
}
