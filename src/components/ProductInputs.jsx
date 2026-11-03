import { Field, MoneyInput, NumberInput, Select, Segmented, TextInput, Slider } from './ui';
import { GATEWAYS, DEFAULT_PRODUCT } from '../lib/calc';
import { useStored } from '../lib/storage';

// Product numbers are shared across the Pricing, Profit and ROI tools
export function useProduct() {
  return useStored('product', DEFAULT_PRODUCT);
}

export default function ProductInputs({ product, setProduct, showPrice = true, showName = true }) {
  const set = (k) => (v) => setProduct((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid gap-4">
      {showName && (
        <Field label="Product name (optional)">
          <TextInput value={product.name} onChange={(e) => set('name')(e.target.value)} placeholder="e.g. Rechargeable neck fan" />
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        {showPrice && (
          <Field label="Selling price" tip="The price your customer pays for one unit.">
            <MoneyInput value={product.price} onChange={set('price')} />
          </Field>
        )}
        <Field label="Cost price" tip="What you pay your supplier for one unit, including shipping to you (e.g. from China or a Lagos market).">
          <MoneyInput value={product.cost} onChange={set('cost')} />
        </Field>
        <Field label="Delivery cost" tip="What you pay the rider or logistics company per order. Put 0 if the customer pays delivery separately.">
          <MoneyInput value={product.delivery} onChange={set('delivery')} />
        </Field>
        <Field label="Packaging" tip="Nylon, box, flyer, tape — per order.">
          <MoneyInput value={product.packaging} onChange={set('packaging')} />
        </Field>
        <Field label="Other costs" tip="Anything else per order: waybill, closer/sales rep commission, call credit, etc.">
          <MoneyInput value={product.other} onChange={set('other')} />
        </Field>
        <Field label="Payment method" className={showPrice ? '' : 'col-span-2'}>
          <Select
            value={product.gateway}
            onChange={set('gateway')}
            options={Object.entries(GATEWAYS).map(([value, g]) => ({ value, label: g.short === 'No fee' ? 'Transfer' : g.short }))}
          />
        </Field>
      </div>

      <div className="rounded-xl bg-paper p-4 ring-1 ring-line/70">
        <div className="mb-2 text-[13px] font-semibold text-ink-soft">How do customers pay?</div>
        <Segmented
          value={product.paymentMode}
          onChange={set('paymentMode')}
          options={[
            { value: 'pod', label: 'On delivery' },
            { value: 'prepaid', label: 'Before delivery' },
          ]}
        />
        {product.paymentMode === 'pod' && (
          <div className="mt-4 grid gap-4">
            <Field
              label={`Delivery success rate: ${product.successRate}%`}
              tip="Out of every 100 orders, how many customers actually receive and pay? Many Nigerian pay-on-delivery stores see 60–80%. Use your real number if you have it."
            >
              <Slider value={product.successRate} onChange={set('successRate')} min={30} max={100} />
            </Field>
            <Field label="Money lost per failed delivery" tip="When a customer refuses or is unreachable, what do you still pay? Usually the rider’s fee.">
              <MoneyInput value={product.failedCost} onChange={set('failedCost')} />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

export function resetProduct(setProduct) {
  setProduct(DEFAULT_PRODUCT);
}

export { NumberInput };
