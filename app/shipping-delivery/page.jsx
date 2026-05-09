export default function ShippingDelivery() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-sm text-gray-700 leading-relaxed">
      <h1 className="text-2xl font-semibold mb-2">Shipping & Delivery Policy</h1>
      <p className="text-xs text-gray-500 mb-6">Last Updated: May 8, 2026</p>

      <h2 className="font-semibold mt-6 mb-2">Shipping Areas</h2>
      <p className="mb-2">We provide delivery across Delhi NCR including:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>South Delhi</li>
        <li>Gurgaon</li>
        <li>Noida</li>
        <li>Faridabad</li>
        <li>Ghaziabad</li>
      </ul>
      <p className="mt-3">
        Pan India delivery may be available depending on product type and order quantity.
      </p>

      <h2 className="font-semibold mt-6 mb-2">Order Processing</h2>
      <p className="mb-4">
        Orders are processed after payment confirmation. Processing time depends on stock availability.
      </p>

      <h2 className="font-semibold mt-6 mb-2">Delivery Timeline</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Delhi NCR: 2–7 business days</li>
        <li>Outside NCR: 5–15 business days</li>
      </ul>
      <p className="mt-3">
        Timelines are estimates and may change due to operational or logistics issues.
      </p>

      <h2 className="font-semibold mt-6 mb-2">Delivery Charges</h2>
      <p className="mb-2">Shipping charges depend on:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Product type</li>
        <li>Quantity</li>
        <li>Delivery location</li>
        <li>Weight and dimensions</li>
      </ul>
    </div>
  );
}