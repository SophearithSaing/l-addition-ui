export type AdjustmentUnit = 'fixed' | 'percentage'

export interface ReceiptItemInput {
  id: number
  name: string
  amount: number
}

export interface ReceiptDinerInput {
  id: number
  name: string
  items: ReceiptItemInput[]
}

export interface ReceiptSharedItemInput extends ReceiptItemInput {
  participantIds: number[]
}

export interface ReceiptAdjustmentInput {
  id: number
  label: string
  amount: number
}

export interface ReceiptDiscountInput {
  amount: number
  unit: AdjustmentUnit
}

export interface ReceiptRoundingInput {
  unit: number
}

export interface ReceiptCalculationInput {
  diners: ReceiptDinerInput[]
  sharedItems: ReceiptSharedItemInput[]
  serviceRate: number
  taxRate: number
  adjustments: ReceiptAdjustmentInput[]
  discount: ReceiptDiscountInput
  rounding?: ReceiptRoundingInput
}

export interface ReceiptLineItem {
  id: number
  name: string
  amount: number
  source: 'individual' | 'shared'
}

export interface ReceiptDinerTotal {
  id: number
  name: string
  items: ReceiptLineItem[]
  subtotal: number
  service: number
  tax: number
  adjustments: number
  discount: number
  fees: number
  exactTotal: number
  rounding: number
  total: number
}

export interface ReceiptCalculation {
  diners: ReceiptDinerTotal[]
  subtotal: number
  service: number
  tax: number
  adjustments: number
  discount: number
  exactTotal: number
  rounding: number
  total: number
}

/**
 * Calculates receipt totals and diner-level allocations.
 *
 * @param input Bill data to calculate.
 * @returns Receipt totals and per-diner totals.
 */
export function calculateReceipt(input: ReceiptCalculationInput): ReceiptCalculation {
  const dinerSubtotals = new Map<number, number>()
  const dinerItems = new Map<number, ReceiptLineItem[]>()

  input.diners.forEach((diner) => {
    const ownSubtotal = diner.items.reduce((total, item) => total + item.amount, 0)

    dinerSubtotals.set(diner.id, ownSubtotal)
    dinerItems.set(
      diner.id,
      diner.items.map((item) => ({
        amount: item.amount,
        id: item.id,
        name: item.name,
        source: 'individual',
      })),
    )
  })

  input.sharedItems.forEach((item) => {
    const participants = item.participantIds.filter((participantId) => {
      return input.diners.some((diner) => diner.id === participantId)
    })

    if (participants.length === 0) {
      return
    }

    const participantAmount = item.amount / participants.length

    participants.forEach((participantId) => {
      dinerSubtotals.set(
        participantId,
        (dinerSubtotals.get(participantId) ?? 0) + participantAmount,
      )
      dinerItems.get(participantId)?.push({
        amount: participantAmount,
        id: item.id,
        name: item.name,
        source: 'shared',
      })
    })
  })

  const subtotal = Array.from(dinerSubtotals.values()).reduce((total, amount) => total + amount, 0)
  const service = subtotal * (input.serviceRate / 100)
  const taxableTotal = subtotal + service
  const tax = taxableTotal * (input.taxRate / 100)
  const adjustments = input.adjustments.reduce((total, adjustment) => total + adjustment.amount, 0)
  const preDiscountTotal = subtotal + service + tax + adjustments
  const discount = getDiscountAmount(input.discount, preDiscountTotal)
  const exactTotal = Math.max(0, preDiscountTotal - discount)

  const exactDiners = input.diners.map((diner) => {
    const dinerSubtotal = dinerSubtotals.get(diner.id) ?? 0
    const dinerService = dinerSubtotal * (input.serviceRate / 100)
    const dinerTax = (dinerSubtotal + dinerService) * (input.taxRate / 100)
    const dinerAdjustments = allocateEqualAmount(adjustments, input.diners.length)
    const dinerPreDiscountTotal = dinerSubtotal + dinerService + dinerTax + dinerAdjustments
    const dinerDiscount = getDinerDiscount(
      input.discount,
      discount,
      dinerPreDiscountTotal,
      preDiscountTotal,
      input.diners.length,
    )
    const dinerTotal = Math.max(0, dinerPreDiscountTotal - dinerDiscount)

    return {
      adjustments: dinerAdjustments,
      discount: dinerDiscount,
      exactTotal: dinerTotal,
      fees: dinerService + dinerTax + dinerAdjustments - dinerDiscount,
      id: diner.id,
      items: dinerItems.get(diner.id) ?? [],
      name: diner.name,
      rounding: 0,
      service: dinerService,
      subtotal: dinerSubtotal,
      tax: dinerTax,
      total: dinerTotal,
    }
  })
  const roundedReceipt = applyNearestRounding(exactDiners, exactTotal, input.rounding)

  return {
    adjustments,
    diners: roundedReceipt.diners,
    discount,
    exactTotal,
    rounding: roundedReceipt.rounding,
    service,
    subtotal,
    tax,
    total: roundedReceipt.total,
  }
}

/**
 * Applies nearest-unit rounding after exact totals are calculated.
 *
 * @param diners Exact diner totals.
 * @param exactTotal Exact receipt total.
 * @param rounding Rounding settings.
 * @returns Rounded receipt totals.
 */
function applyNearestRounding(
  diners: ReceiptDinerTotal[],
  exactTotal: number,
  rounding?: ReceiptRoundingInput,
): Pick<ReceiptCalculation, 'diners' | 'rounding' | 'total'> {
  const roundingUnit = rounding?.unit ?? 0

  if (roundingUnit <= 0 || diners.length === 0) {
    return {
      diners,
      rounding: 0,
      total: exactTotal,
    }
  }

  const roundedTotal = roundToNearestUnit(exactTotal, roundingUnit)
  const baseAllocations = diners.map((diner, index) => {
    const baseTotal = Math.floor(diner.exactTotal / roundingUnit) * roundingUnit

    return {
      baseTotal,
      diner,
      index,
      remainder: diner.exactTotal - baseTotal,
    }
  })
  const baseTotal = baseAllocations.reduce((total, allocation) => total + allocation.baseTotal, 0)
  const unitCount = Math.round((roundedTotal - baseTotal) / roundingUnit)
  const roundedDinerTotals = new Map<number, number>()

  ;[...baseAllocations]
    .sort((first, second) => {
      if (second.remainder === first.remainder) {
        return first.index - second.index
      }

      return second.remainder - first.remainder
    })
    .forEach((allocation, index) => {
      const roundedDinerTotal = allocation.baseTotal + (index < unitCount ? roundingUnit : 0)

      roundedDinerTotals.set(allocation.diner.id, roundedDinerTotal)
    })

  return {
    diners: diners.map((diner) => {
      const roundedDinerTotal = roundedDinerTotals.get(diner.id) ?? diner.exactTotal

      return {
        ...diner,
        rounding: roundedDinerTotal - diner.exactTotal,
        total: roundedDinerTotal,
      }
    }),
    rounding: roundedTotal - exactTotal,
    total: roundedTotal,
  }
}

/**
 * Rounds an amount to the nearest unit.
 *
 * @param amount Amount to round.
 * @param unit Rounding unit.
 * @returns Rounded amount.
 */
function roundToNearestUnit(amount: number, unit: number): number {
  return Math.round(amount / unit) * unit
}

/**
 * Calculates the effective discount amount.
 *
 * @param discount Discount input.
 * @param preDiscountTotal Total before discount.
 * @returns Effective discount amount.
 */
function getDiscountAmount(discount: ReceiptDiscountInput, preDiscountTotal: number): number {
  if (discount.unit === 'percentage') {
    return preDiscountTotal * (discount.amount / 100)
  }

  return discount.amount
}

/**
 * Calculates a diner-level discount allocation.
 *
 * @param discount Discount input.
 * @param discountAmount Effective total discount amount.
 * @param dinerPreDiscountTotal Diner total before discount.
 * @param preDiscountTotal Bill total before discount.
 * @param dinerCount Number of diners receiving fixed discounts.
 * @returns Diner discount allocation.
 */
function getDinerDiscount(
  discount: ReceiptDiscountInput,
  discountAmount: number,
  dinerPreDiscountTotal: number,
  preDiscountTotal: number,
  dinerCount: number,
): number {
  if (discount.unit === 'fixed') {
    return allocateEqualAmount(discountAmount, dinerCount)
  }

  return allocateAmount(discountAmount, dinerPreDiscountTotal, preDiscountTotal)
}

/**
 * Allocates a total amount equally.
 *
 * @param amount Total amount to allocate.
 * @param count Number of allocations.
 * @returns Equal allocation.
 */
function allocateEqualAmount(amount: number, count: number): number {
  if (count <= 0) {
    return 0
  }

  return amount / count
}

/**
 * Allocates a total amount proportionally.
 *
 * @param amount Total amount to allocate.
 * @param portion Portion receiving allocation.
 * @param base Total allocation base.
 * @returns Proportional allocation.
 */
function allocateAmount(amount: number, portion: number, base: number): number {
  if (base <= 0) {
    return 0
  }

  return amount * (portion / base)
}
